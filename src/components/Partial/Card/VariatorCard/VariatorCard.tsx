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
    <div className="flex flex-wrap gap-4 flex-col lg:flex-row pb-4 lg:pb-0">
      {data.map((pump, index: number) => (
        <Card key={index} className="flex-1 w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <span>Bomba {pump.data.bomba}</span>
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
                  <TableCell className={cn("text-right font-semibold", getColorClass(pump.data.frecuencia, [30, 50, 60]))}>
                    {pump.data.frecuencia.toFixed(2)} Hz
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center">
                    <Gauge className="w-5 h-5 mr-2 text-blue-500" /> Intensidad
                  </TableCell>
                  <TableCell className={cn("text-right font-semibold", getColorClass(pump.data.intensidad, [10, 20, 30]))}>
                    {pump.data.intensidad.toFixed(2)} A
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-purple-500" /> Potencia
                  </TableCell>
                  <TableCell className={cn("text-right font-semibold", getColorClass(pump.data.potencia, [5, 10, 15]))}>
                    {pump.data.potencia.toFixed(2)} kW
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center">
                    <Thermometer className="w-5 h-5 mr-2 text-red-500" /> Temperatura
                  </TableCell>
                  <TableCell className={cn("text-right font-semibold", getColorClass(pump.data.temperatura_unidad, [40, 60, 80]))}>
                    {pump.data.temperatura_unidad.toFixed(2)} °C
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center">
                    <Waves className="w-5 h-5 mr-2 text-cyan-500" /> Tensión de Salida
                  </TableCell>
                  <TableCell className={cn("text-right font-semibold", getColorClass(pump.data.tension_salida, [200, 220, 240]))}>
                    {pump.data.tension_salida.toFixed(2)} V
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-500" /> Tiempo en Marcha
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {pump.data.tiempo_marcha.toFixed(2)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="flex items-center">
                    <Navigation2 className="w-5 h-5 mr-2 text-orange-500" /> Velocidad y Dirección
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {pump.data.velocidad_y_direccion.toFixed(2)}
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

