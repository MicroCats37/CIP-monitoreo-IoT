import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cable as PumpIcon } from "lucide-react"
// ajusta el path según tu estructura
import { cn } from "@/lib/utils"
import { BombasDeAguaEstadoType } from "@/validators/devices/schemas"

export default function BombasDeAguaEstadoCard({ dataMQTT }: { dataMQTT: BombasDeAguaEstadoType }) {
  return (
    <div className="flex gap-4 w-full flex-col lg:flex-row">
      {dataMQTT.details.map((entry, i) => 
        Object.keys(entry.data.fields).map((pumpKey, j) => {
          const pumpData = entry.data;
          const isOn = pumpData.fields.estado===1;

          return (
            <Card
              key={`${i}-${j}`}
              className={cn(
                "flex-col w-full sm:w-1/2 lg:w-1/3 transition-all duration-300",
                isOn
                  ? "bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20"
                  : "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20"
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm font-medium">
                  <span>{pumpData.sensor.name}</span>
                  <PumpIcon
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isOn ? "text-green-500 animate-pulse" : "text-red-500"
                    )}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={isOn ? "default" : "secondary"}
                  className={cn(
                    "w-full justify-center py-1 text-xs font-normal transition-all duration-300",
                    isOn
                      ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-700/30 dark:text-green-300"
                      : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-700/30 dark:text-red-300"
                  )}
                >
                  {isOn ? "Operativo" : "No Operativo"}
                </Badge>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground text-center w-full">
                  Última actualización: {new Date(entry.time).toLocaleString()}
                </p>
              </CardFooter>
            </Card>
          );
        })
      )}
    </div>
  )
}
