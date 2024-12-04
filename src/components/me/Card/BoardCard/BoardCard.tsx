import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { BoardCardProps } from "./BoardCard.type"
  import { Zap, Activity, Loader2 } from 'lucide-react'
  
  export default function BoardCard({ data }: { data: BoardCardProps }) {
    return (
      <div className="flex gap-4 p-4 w-full">
        {data.map((board, index: number) => (
          <Card key={index} className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Tablero de potencia</span>
                {board.potencia === 'activa' && <Zap className="text-yellow-500" />}
                {board.potencia === 'reactiva' && <Activity className="text-blue-500" />}
                {board.potencia === 'aparente' && <Loader2 className="text-purple-500" />}
              </CardTitle>
              <CardDescription>
                {board.potencia.charAt(0).toUpperCase() + board.potencia.slice(1)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold">{board.value.toLocaleString()}</span>
                <span className="text-xl font-semibold text-muted-foreground">
                  {board.potencia === 'activa' ? 'W' : board.potencia === 'reactiva' ? 'VAR' : 'VA'}
                </span>
              </div>
              {board.time && (
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Última actualización: {new Date(board.time).toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  
  