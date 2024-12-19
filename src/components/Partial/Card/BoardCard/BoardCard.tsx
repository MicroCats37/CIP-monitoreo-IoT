import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BoardCardProps } from "./BoardCard.type"
import { Zap, Activity, Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function BoardCard({ data }: { data: BoardCardProps }) {
  const getCardStyle = (potencia: string) => {
    switch (potencia) {
      case 'activa':
        return "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
      case 'reactiva':
        return "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
      case 'aparente':
        return "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
      default:
        return ""
    }
  }

  const getIconColor = (potencia: string) => {
    switch (potencia) {
      case 'activa':
        return "text-yellow-500"
      case 'reactiva':
        return "text-blue-500"
      case 'aparente':
        return "text-purple-500"
      default:
        return ""
    }
  }

  const getUnitColor = (potencia: string) => {
    switch (potencia) {
      case 'activa':
        return "text-orange-600 dark:text-orange-400"
      case 'reactiva':
        return "text-cyan-600 dark:text-cyan-400"
      case 'aparente':
        return "text-pink-600 dark:text-pink-400"
      default:
        return ""
    }
  }

  return (
    <div className="flex flex-col space-y-4 w-full h-full sm:flex-row sm:space-y-0 sm:space-x-4">
      {data.map((board, index: number) => (
        <Card key={index} className={cn("w-full transition-all duration-300 hover:shadow-lg", getCardStyle(board.data.potencia))}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg font-bold">Tablero de potencia</span>
              {board.data.potencia === 'activa' && <Zap className={cn("w-6 h-6", getIconColor(board.data.potencia), "animate-pulse")} />}
              {board.data.potencia === 'reactiva' && <Activity className={cn("w-6 h-6", getIconColor(board.data.potencia), "animate-pulse")} />}
              {board.data.potencia === 'aparente' && <Loader2 className={cn("w-6 h-6", getIconColor(board.data.potencia), "animate-spin")} />}
            </CardTitle>
            <CardDescription className="text-base font-medium">
              {board.data.potencia.charAt(0).toUpperCase() + board.data.potencia.slice(1)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <span className={cn("text-4xl font-bold transition-all duration-300", getIconColor(board.data.potencia))}>
                {board.data.value.toLocaleString()}
              </span>
              <span className={cn("text-2xl font-semibold mt-2", getUnitColor(board.data.potencia))}>
                {board.data.potencia === 'activa' ? 'KW' : board.data.potencia === 'reactiva' ? 'KVAR' : 'KVA'}
              </span>
            </div>
            {board.time && (
              <p className="text-sm text-muted-foreground mt-6 text-center">
                Última actualización: {new Date(board.time).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

