"use client"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ConcentracionCloroType} from "@/validators/devices/schemas"


const getChlorineStatus = (level: number) => {
  if (level <= 1.0) {
    return {
      status: "normal",
      message: "Nivel Óptimo",
      colors: {
        gradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
        text: "text-green-500",
        badge: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-700/30 dark:text-green-300",
      },
      icon: CheckCircle2,
    }
  } else if (level <= 1.8) {
    return {
      status: "warning",
      message: "Nivel Elevado",
      colors: {
        gradient: "from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20",
        text: "text-yellow-600",
        badge: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-700/30 dark:text-yellow-300",
      },
      icon: AlertTriangle,
    }
  } else {
    return {
      status: "danger",
      message: "Nivel Crítico",
      colors: {
        gradient: "from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
        text: "text-red-500",
        badge: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-700/30 dark:text-red-300",
      },
      icon: AlertTriangle,
    }
  }
}

export default function ConcentracionCloroCard({ dataMQTT }: {dataMQTT: ConcentracionCloroType}) {
  return (
    <div className="flex gap-6 w-full flex-col lg:flex-row">
      {dataMQTT.details.map((pool, index) => {
        // Único sensor de cloro por piscina
        const cloroValue = pool.data.fields.cloro!
        const StatusIcon = getChlorineStatus(cloroValue).icon
        const status = getChlorineStatus(cloroValue)

        return (
          <Card
            key={pool.data.sensor.name}
            className={cn(
              "w-full transition-all duration-300 overflow-hidden bg-gradient-to-br hover:shadow-lg hover:-translate-y-0.5",
              status.colors.gradient
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold">
                    {pool.data.sensor.name}
                  </CardTitle>
                  <p className={cn("text-sm font-medium", status.colors.text)}>
                    {status.message}
                  </p>
                </div>
                <div className="relative">
                  <Droplets
                    className={cn(
                      "h-12 w-12 transition-all duration-300 opacity-20",
                      status.colors.text
                    )}
                  />
                  <StatusIcon
                    className={cn(
                      "h-6 w-6 absolute bottom-0 right-0 transition-all duration-300",
                      status.colors.text,
                      status.status !== "normal" && "animate-pulse"
                    )}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-4 flex flex-col items-center gap-4">
                <div className="text-4xl font-bold tracking-tighter">
                  {cloroValue.toFixed(2)}
                  <span className="text-base font-normal text-muted-foreground ml-1">
                    ppm
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "px-4 py-1 text-sm font-medium transition-all duration-300",
                    status.colors.badge
                  )}
                >
                  {status.message}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-white/50 dark:bg-black/5">
              <p className="text-sm text-muted-foreground text-center w-full pt-2">
                Última actualización: {new Date(pool.time).toLocaleString()}
              </p>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
