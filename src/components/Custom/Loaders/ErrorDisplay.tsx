"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorDisplayProps {
  error: Error | unknown
  onRetry?: () => void
  title?: string
}

const ErrorDisplay = ({ error, onRetry, title = "Error al cargar los datos" }: ErrorDisplayProps) => {
  const errorMessage = error instanceof Error ? error.message : "Ha ocurrido un error inesperado"

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 max-w-md mx-auto">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">{errorMessage}</AlertDescription>
      </Alert>

      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2 bg-transparent">
          <RefreshCw className="h-4 w-4" />
          Reintentar
        </Button>
      )}
    </div>
  )
}

export default ErrorDisplay
