import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table"
import { VariatorProps } from "./Variator.type"
import { Activity, Zap, Gauge, Thermometer, Waves, Clock, Navigation2 } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function VariatorCard({ data }: { data: VariatorProps }) {
  const getColorClass = (value: number, thresholds: [number, number, number]) => {
    if (value <= thresholds[0]) return "text-green-500"
    if (value <= thresholds[1]) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="flex flex-wrap gap-4 flex-col sm:flex-row">
      {data.map((pump, index: number) => (
        <Card key={index} className="flex-1 w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <span>Bomba {pump.bomba}</span>
              <Activity className="w-6 h-6 text-blue-500 animate-pulse" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" /> Frecuencia
                  </TableCell>
                  <TableCell className={cn("text-right font-semibold", getColorClass(pump.frecuencia, [30, 50, 60]))}>
                    {pump.frecuencia} Hz
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center">
                    <Gauge className="w-5 h-5 mr-2 text-blue-500" /> Intensidad
                  </TableCell>
                  <TableCell className={cn("text-right font-semibold", getColorClass(pump.intensidad, [10, 20, 30]))}>
                    {pump.intensidad} A
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-purple-500" /> Potencia
                  </TableCell>
                  <TableCell className={cn("text-right font-semibold", getColorClass(pump.potencia, [5, 10, 15]))}>
                    {pump.potencia} kW
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center">
                    <Thermometer className="w-5 h-5 mr-2 text-red-500" /> Temperatura
                  </TableCell>
                  <TableCell className={cn("text-right font-semibold", getColorClass(pump.temperatura_unidad, [40, 60, 80]))}>
                    {pump.temperatura_unidad} °C
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center">
                    <Waves className="w-5 h-5 mr-2 text-cyan-500" /> Tensión de Salida
                  </TableCell>
                  <TableCell className={cn("text-right font-semibold", getColorClass(pump.tension_salida, [200, 220, 240]))}>
                    {pump.tension_salida} V
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-500" /> Tiempo en Marcha
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {pump.tiempo_marcha}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center">
                    <Navigation2 className="w-5 h-5 mr-2 text-orange-500" /> Velocidad y Dirección
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {pump.velocidad_y_direccion}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              Última actualización: {new Date(pump.time!).toLocaleString()}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

