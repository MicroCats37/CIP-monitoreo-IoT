"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NestedMenuItem } from "../NestedMenuItem/NestedMenuItem"
import { linkRoutes } from "./SidebarComponent.data"
import { ThemeToggle } from "../DarkMode/theme-toggle"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCookie } from "cookies-next"
import { clearAuthCookies } from "@/actions/auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { LoggedUser } from "@/schemas/auth"

export function AppSidebar() {
  const router = useRouter()
  const [user, setUser] = useState<LoggedUser | null>(null)

  useEffect(() => {
    const userCookie = getCookie("user-session");
    if (userCookie) {
      try {
        // En Next.js 15+ las cookies parseadas desde getCookie pueden venir como string, hay que hacer parse si existe
        setUser(JSON.parse(userCookie as string));
      } catch (e) {
        console.error("No se pudo parsear el user-session", e);
      }
    }
  }, [])

  const logout = async () => {
    await clearAuthCookies();
    router.push("/login");
  }

  const hasTotalAccess = user?.categorias?.includes("Total");

  // Filter routes based on categories
  const filteredRoutes = linkRoutes.map(topRoute => {
    if (hasTotalAccess || topRoute.title !== "Monitoreo") {
      return topRoute;
    }

    // For non-"Total" users, filter inside the "Monitoreo" pages
    return {
      ...topRoute,
      pages: topRoute.pages?.filter(page =>
        page.title === "Concentracion de CL" ||
        page.title === "Automatizacion Chosica"
      )
    };
  });

  return (
    <Sidebar className="h-screen border-r">
      <SidebarHeader className="border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtlBG0gTCz0ut6KaTl1E6aKFoVRXGkvW173A&s"
                alt={user ? `${user.first_name} ${user.last_name}` : "Usuario CIP"}
              />
              <AvatarFallback>{user ? `${user.first_name[0]}${user.last_name[0]}` : "PS"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user ? `${user.first_name} ${user.last_name}` : "Pedro Sotelo"}
              </p>
              <p className="text-xs text-muted-foreground">
                {user ? user.categorias.join(", ") : "Usuario CIP"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => logout()} title="Cerrar sesión">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Dashboard IoT
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {filteredRoutes.map((route, index) => (
                <SidebarMenuItem key={`${route.title}-${index}`}>
                  <NestedMenuItem
                    item={{
                      title: route.title,
                      url: route.url,
                      icon: route.icon,
                      pages: route.pages,
                    }}
                    level={0}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Dashboard IoT v1.0</span>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
