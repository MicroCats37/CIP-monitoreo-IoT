import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  message?: string
  size?: "sm" | "md" | "lg"
}

const LoadingSpinner = ({ message = "Cargando...", size = "md" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      {message && <p className="text-sm text-muted-foreground text-center">{message}</p>}
    </div>
  )
}

export default LoadingSpinner
