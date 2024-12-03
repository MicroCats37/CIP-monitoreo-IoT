import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { 
    Table, 
    TableBody, 
    TableCell, 
    TableRow 
  } from "@/components/ui/table"
  import { Badge } from "@/components/ui/badge"
  import { VariatorProps } from "./Variator.type"
  import { Activity, Zap, Gauge, Thermometer, Waves, Clock, Navigation2 } from 'lucide-react'
  
  export default function VariatorCard({ data }: { data: VariatorProps }) {
    return (
      <div className="flex p-4 gap-4">
        {data.map((pump, index: number) => (
          <Card key={index} className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center justify-between">
                <span>Bomba {pump.bomba}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="flex items-center"><Activity className="w-4 h-4 mr-2" /> Frecuencia</TableCell>
                    <TableCell className="text-right">{pump.frecuencia} Hz</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="flex items-center"><Zap className="w-4 h-4 mr-2" /> Intensidad</TableCell>
                    <TableCell className="text-right">{pump.intensidad} A</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="flex items-center"><Gauge className="w-4 h-4 mr-2" /> Potencia</TableCell>
                    <TableCell className="text-right">{pump.potencia} kW</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="flex items-center"><Thermometer className="w-4 h-4 mr-2" /> Temperatura</TableCell>
                    <TableCell className="text-right">{pump.temperatura_unidad} °C</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="flex items-center"><Waves className="w-4 h-4 mr-2" /> Tensión de Salida</TableCell>
                    <TableCell className="text-right">{pump.tension_salida} V</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="flex items-center"><Clock className="w-4 h-4 mr-2" /> Tiempo en Marcha</TableCell>
                    <TableCell className="text-right">{pump.tiempo_marcha}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="flex items-center"><Navigation2 className="w-4 h-4 mr-2" /> Velocidad y Dirección</TableCell>
                    <TableCell className="text-right">{pump.velocidad_y_direccion}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  
  