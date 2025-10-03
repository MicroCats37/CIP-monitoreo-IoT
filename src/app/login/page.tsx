
'use client'
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

type FormData = {
  email: string
  password: string
}

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1))

      if ((data.email === "psotelo@cip.org.pe" || data.email === "gestionsecretaria@cip.org.pe" || data.email === "mantenimiento@ciplima.org.pe") && data.password === "admin") {
        router.push("/dashboard-iot/historico")
      } else {
        setError("Credenciales inválidas. Por favor, intente de nuevo.")
      }

      // Aquí iría la llamada real a tu API de backend
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // })
      // const responseData = await response.json()
      // if (responseData.success) {
      //   router.push('/dashboard')
      // } else {
      //   setError(responseData.message || 'Error de autenticación')
      // }
    } catch (err) {
      setError("Ocurrió un error al intentar iniciar sesión. Por favor, intente más tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-900 via-red-600 to-yellow-500 p-4 relative overflow-hidden">
      {/* Círculo decorativo */}
      <div className="absolute top-[-50%] left-[-25%] w-[150%] h-[150%] bg-yellow-400 rounded-full opacity-20 z-0"></div>

      <Card className="w-full max-w-md bg-white shadow-2xl relative z-10">
        <CardHeader className="pb-8 pt-6">
          <div className="flex justify-center mb-4">
            <Avatar>
              <AvatarImage
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtlBG0gTCz0ut6KaTl1E6aKFoVRXGkvW173A&s"
                alt="Colegio de Ingenieros del Perú Logo"
                className="rounded-full border-4 border-red-700 w-[200px]"
              />
            </Avatar>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-red-700">Colegio de Ingenieros del Perú</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder=".....@cip.com.pe"
                  {...register("email", { required: "El correo electrónico es requerido" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password", { required: "La contraseña es requerida" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-red-900 via-red-600 to-yellow-500 hover:from-red-800 hover:via-red-700 hover:to-yellow-600 text-white transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <a href="/dashboard-iot/historico" className="text-sm text-red-700 hover:text-yellow-500 transition-colors duration-300">
            Ingresar como invitado
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}

