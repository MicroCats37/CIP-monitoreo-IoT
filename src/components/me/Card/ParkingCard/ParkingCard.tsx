import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, AlertTriangle, Clock, CheckCircle, RefreshCw } from 'lucide-react'
import { cn } from "@/lib/utils"
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

type Estados = "libre" | "dañado" | "ocupado" | "reservado"

interface EstadoConteo {
  state: Estados
  count: number
}

interface EstacionamientoCardProps {
  sotano: string
  estados: EstadoConteo[]
  className?: string
  time: string
}

const estadoIcono: Record<Estados, React.ReactNode> = {
  libre: <CheckCircle className="h-4 w-4" />,
  dañado: <AlertTriangle className="h-4 w-4" />,
  ocupado: <Car className="h-4 w-4" />,
  reservado: <Clock className="h-4 w-4" />
}

const estadoColor: Record<Estados, string> = {
  libre: "bg-green-100 text-green-800",
  dañado: "bg-red-100 text-red-800",
  ocupado: "bg-blue-100 text-blue-800",
  reservado: "bg-yellow-100 text-yellow-800"
}

export function ParkingCard({ sotano, estados, className, time }: EstacionamientoCardProps) {
  const fechaFormateada = format(parseISO(time), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })

  return (
    <Card className={cn("w-full h-full", className)}>
      <CardHeader className="pb-2 flex-row justify-between">
        <CardTitle className="flex text-lg font-bold">Estacionamiento {sotano}</CardTitle>
        <div className="flex items-center w-auto space-x-1">
          <RefreshCw className="h-3 w-3" />
          <span>Actualizado: {fechaFormateada}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-wrap w-full h-full justify-between items-center">
          {estados.map((estado) => (
            <div key={estado.state} className="flex items-center space-x-2">
              <Badge variant="secondary" className={`px-2 py-1 ${estadoColor[estado.state]}`}>
                {estadoIcono[estado.state]}
                <span className="ml-1 text-xs font-medium">{estado.count}</span>
              </Badge>
              <span className="text-sm font-medium capitalize">{estado.state}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

