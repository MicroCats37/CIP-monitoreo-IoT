import { AlertCircle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorCardProps {
  message: string
  onRetry?: () => void
}

export function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <Card className="w-full border-destructive/50 shadow-sm transition-all duration-300 ease-in-out">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 border-b border-destructive/10 bg-destructive/5 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <CardTitle>Error</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
      {onRetry && (
        <CardFooter>
          <Button variant="outline" className="gap-2" onClick={onRetry}>
            <RefreshCcw className="h-4 w-4" />
            Reintentar
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
