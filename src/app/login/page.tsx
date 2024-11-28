'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

type FormData = {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError('')

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (data.email === 'user@cst.com' && data.password === 'admin') {
        // Login exitoso
        console.log('Login exitoso')
        router.push('/dashboard')
      } else {
        setError('Credenciales inválidas. Por favor, intente de nuevo.')
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
      setError('Ocurrió un error al intentar iniciar sesión. Por favor, intente más tarde.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex w-full h-full items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>Ingrese sus credenciales de empresa para acceder.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  placeholder="nombre@empresa.com" 
                  className="placeholder-opacity-10 placeholder-gray-500 border border-gray-300 rounded px-2 py-1"
                  {...register("email", { 
                    required: "El correo electrónico es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Dirección de correo inválida"
                    }
                  })}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password"
                  {...register("password", { 
                    required: "La contraseña es requerida",
                    minLength: {
                      value: 4,
                      message: "La contraseña debe tener al menos 4 caracteres"
                    }
                  })}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button className="w-full mt-4" type="submit" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}