'use client';

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, LogIn, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { setAuthCookies } from "@/actions/auth";
import { LoginResponseSchema } from "@/schemas/auth";

// Schema for form validation
const loginSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginFields = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginFields) => {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL_USERS
      const response = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Error en la autenticación' }));
        throw new Error(errorData.detail || 'Credenciales inválidas');
      }

      const responseData = await response.json();
      return LoginResponseSchema.parse(responseData);
    },
    onSuccess: async (data) => {
      await setAuthCookies(data.access, data.refresh, data.user);
      router.push("/dashboard-iot/historico");
    },
    onError: (err: any) => {
      setError(err.message || "Ocurrió un error al intentar iniciar sesión.");
    },
  });

  const onSubmit = (data: LoginFields) => {
    setError("");
    mutation.mutate(data);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-900 via-red-600 to-yellow-500 p-4 overflow-hidden selection:bg-red-500/30">

      {/* Background Decorator Circle */}
      <div className="absolute top-[-50%] left-[-25%] w-[150%] h-[150%] bg-yellow-400 rounded-full opacity-20 z-0 blur-3xl mix-blend-overlay pointer-events-none"></div>

      {/* Login Card */}
      <Card className="w-full max-w-md bg-white border-0 shadow-2xl relative z-10 transition-all duration-300">
        <CardHeader className="pb-8 pt-8 px-8 flex flex-col items-center space-y-6">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 opacity-60 blur-md transition duration-500 group-hover:opacity-100" />
            <Avatar className="relative h-28 w-28 border-[3px] border-white shadow-xl">
              <AvatarImage
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtlBG0gTCz0ut6KaTl1E6aKFoVRXGkvW173A&s"
                alt="Logo CIP"
                className="object-contain bg-white"
              />
              <AvatarFallback className="bg-red-50 text-red-700 font-bold text-xl">CIP</AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl font-extrabold tracking-tight text-gray-900">
              Bienvenido
            </CardTitle>
            <p className="text-sm font-medium text-gray-500">
              Colegio de Ingenieros del Perú
            </p>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                  Usuario
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-600 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Escribe tu usuario"
                    {...register("username")}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-900 border-gray-200 focus-visible:ring-red-500/30 focus-visible:border-red-500 transition-all placeholder:text-gray-400 rounded-lg shadow-sm"
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-xs font-semibold animate-in slide-in-from-top-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Contraseña
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-red-600 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 text-gray-900 border-gray-200 focus-visible:ring-red-500/30 focus-visible:border-red-500 transition-all placeholder:text-gray-400 rounded-lg shadow-sm"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs font-semibold animate-in slide-in-from-top-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="animate-in fade-in-0 slide-in-from-top-2 border-red-200 bg-red-50 text-red-700">
                <AlertDescription className="font-semibold flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full font-semibold bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white shadow-xl shadow-red-900/10 transition-all duration-300 ease-out hover:-translate-y-0.5"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="px-8 pb-8 flex justify-center border-t border-gray-100 pt-6">
          <Button
            variant="link"
            className="text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors px-0 h-auto"
            onClick={() => router.push("/dashboard-iot/historico")}
          >
            Continuar como invitado &rarr;
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
