import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, AlertTriangle, Clock, CheckCircle, RefreshCw, ParkingMeterIcon as Parking } from 'lucide-react'
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
  libre: "bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-300",
  dañado: "bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-300",
  ocupado: "bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300",
  reservado: "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-300"
}

export function ParkingCard({ sotano, estados, className, time }: EstacionamientoCardProps) {

  return (
    <Card className={cn("w-full h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 hover:shadow-lg overflow-hidden", className)}>
      <CardHeader className="py-0 pt-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-sm sm:text-base font-bold">
            <Parking className="h-6 w-6 mr-1 sm:mr-2 text-primary bg-yellow-400 text-yellow-700 rounded-lg p-1" />
            <span className="hidden sm:inline text-pretty font-extralight">Estacionamiento {' '+sotano}</span>
          </CardTitle>
          <CardDescription className="flex items-center justify-center gap-2 text-[10px]">
            <RefreshCw className="h-2 w-2 sm:h-3 sm:w-3 animate-spin" />
            <p className="text-sm text-muted-foreground text-center">
              Última actualización: {new Date(time!).toLocaleString()}
            </p>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow py-1 sm:py-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 h-full">
          {estados.map((estado) => (
            <div key={estado.state} className="flex flex-row items-center justify-center space-x-1 p-1 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
              <Badge variant="secondary" className={cn("rounded-full flex items-center justify-center", estadoColor[estado.state])}>
                {estadoIcono[estado.state]}
              </Badge>
              <span className="text-[15px] font-normal">{estado.count}</span>
              <span className="text-[10px] sm:text-xs font-medium capitalize text-center">{estado.state}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

