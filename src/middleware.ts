import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/registro", "/"];

function decodeJWT(token: string) {
    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch {
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("jwt-access")?.value;
    const path = request.nextUrl.pathname;

    const isPublicPath = PUBLIC_PATHS.includes(path);

    // Si NO hay token → permitir rutas públicas, bloquear privadas
    if (!token) {
        if (!isPublicPath && !path.startsWith("/_next") && !path.startsWith("/api/")) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next();
    }

    // Si hay token → verificar expiración y refresh proactivo
    const decoded = decodeJWT(token);
    const now = Math.floor(Date.now() / 1000); // Segundos

    if (!decoded) {
        // Token corrupto o inválido
        return handleLogout(request);
    }

    // 1. Expirado completamente -> Logout
    if (decoded.exp < now) {
        return handleLogout(request);
    }

    // 2. Refresh Proactivo: Si quedan menos de 5 minutos, intentamos refrescar
    // (Solo en rutas privadas para evitar carga innecesaria en rutas públicas o assets)
    const timeUntilExpiry = decoded.exp - now;
    const REFRESH_THRESHOLD = 5 * 60; // 5 minutos

    if (timeUntilExpiry < REFRESH_THRESHOLD && !isPublicPath && !path.startsWith("/_next")) {
        try {
            const refreshToken = request.cookies.get("jwt-refresh")?.value;

            if (refreshToken) {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL_USERS;
                const refreshRes = await fetch(`${baseUrl}/api/auth/refresh/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh: refreshToken }),
                });

                if (refreshRes.ok) {
                    const data = await refreshRes.json();
                    const newAccessToken = data.access;

                    // Clonamos la respuesta para poder setear la cookie nueva
                    const response = NextResponse.next();
                    const isDeployment = process.env.NODE_ENV === "production";

                    response.cookies.set("jwt-access", newAccessToken, {
                        httpOnly: isDeployment,
                        secure: isDeployment,
                        sameSite: "lax",
                        path: "/",
                        maxAge: 60 * 60 * 2, // 2 horas de vida de cookie para asegurar retención hasta la prox expiración
                    });

                    return response;
                }
            }
        } catch (error) {
            console.error("Error en refresh proactivo:", error);
        }
    }

    // Si el token existe y es válido → no dejar entrar al login ni registro
    if (path === "/login" || path === "/registro") {
        return NextResponse.redirect(new URL("/dashboard-iot", request.url));
    }

    return NextResponse.next();
}

/**
 * Helper para logout centralizado en middleware
 */
function handleLogout(request: NextRequest) {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("jwt-access");
    res.cookies.delete("jwt-refresh");
    res.cookies.delete("user-session");
    return res;
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
