import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Activity, Zap, Gauge, Thermometer, Waves, Clock, Navigation2 } from "lucide-react"
import type { BombasDeAguaVariadoresType } from "@/validators/devices/schemas"
import { getLabel } from "@/utils/Devices/PlotFormat/LabelandUnits"

interface Props {
  dataMQTT: BombasDeAguaVariadoresType
}

// 🎨 Mapeo de iconos por tipo de campo
const getFieldIcon = (fieldName: string) => {
  const name = fieldName.toLowerCase()
  if (name.includes("potencia")) return Zap
  if (name.includes("temperatura")) return Thermometer
  if (name.includes("velocidad")) return Navigation2
  if (name.includes("frecuencia")) return Waves
  if (name.includes("tiempo")) return Clock
  if (name.includes("intensidad")) return Activity
  return Gauge
}

export default function BombasDeAguaVariadoresCard({ dataMQTT }: Props) {
  return (
    <div className="flex flex-col sm:flex-row flex-1 w-full gap-4">
      {dataMQTT.details.map((entry, i) => (
        <Card
          key={`bomba-${i}`}
          className="flex-col w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:shadow-md transition-shadow duration-200"
        >
          {/* Header minimalista */}
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{entry.data.sensor.name}</h3>

            </div>
          </CardHeader>

          {/* Content limpio */}
          <CardContent className="space-y-3">
            {Object.entries(entry.data.fields).map(([fieldName, fieldValue], j) => {
              const FieldIcon = getFieldIcon(fieldName)
              const value =
                typeof fieldValue === "object" && fieldValue !== null && "value" in fieldValue
                  ? (fieldValue as any).value
                  : fieldValue

              return (
                <div
                  key={j}
                  className="flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-900/50 px-2 py-1.5 rounded transition-colors duration-150"
                >
                  <div className="flex items-center space-x-2">
                    <FieldIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{getLabel(fieldName,dataMQTT.device.name)}</span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-medium text-gray-900 dark:text-gray-100">
                      {typeof value === "number" ? value.toFixed(1) : value}
                    </span>
                    {typeof fieldValue === "object" && fieldValue !== null && "unit" in fieldValue && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{(fieldValue as any).unit}</span>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Timestamp discreto */}
            <div className="pt-2 mt-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Última actualización: {new Date(entry.time).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
