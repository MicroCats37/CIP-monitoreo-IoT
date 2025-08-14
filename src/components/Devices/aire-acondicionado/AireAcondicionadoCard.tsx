"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Power, Activity, Thermometer, RefreshCw, Snowflake, Flame, ArrowUp, ArrowDown } from "lucide-react"
import type { PageEntry } from "@/utils/Devices/Data/data.pages.monitoreo"

import { toast } from "sonner"
import { AireAcondicionadoDialogContent } from "./AireAcondicionadoDialogContent"
import { cn } from "@/lib/utils"
import { AireAcondicionadoFieldsType } from "@/validators/devices/schemas"

interface AireAcondicionadoCardProps {
  data: AireAcondicionadoFieldsType // El objeto de datos del aire acondicionado individual
  controller: string
  dataConfig: PageEntry
}

const getTemperatureStyle = (temp: number, status: number) => {
  if (status !== 1) {
    return {
      gradient: "from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20",
      text: "text-gray-500",
      icon: Thermometer,
      message: "Apagado",
    }
  }
  if (temp < 17) {
    return {
      gradient: "from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20",
      text: "text-purple-500",
      icon: RefreshCw,
      message: "Modo Recuperador",
    }
  } else if (temp <= 20) {
    return {
      gradient: "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      text: "text-blue-500",
      icon: Snowflake,
      message: "Modo Frío",
    }
  } else if (temp <= 24) {
    return {
      gradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      text: "text-green-500",
      icon: Thermometer,
      message: "Temperatura Ideal",
    }
  } else {
    return {
      gradient: "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
      text: "text-orange-500",
      icon: Flame,
      message: "Modo Calor",
    }
  }
}

export function AireAcondicionadoCard({ data, controller, dataConfig }: AireAcondicionadoCardProps) {
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const isRunning = data.fields.status === 1
  const temperatureDiff = Math.abs(data.fields.temperature_indoor - data.fields.temperature_setting)

  const air = {
    id: data.fields.id,
    alias: data.fields.alias,
    temperature_indoor: data.fields.temperature_indoor,
    temperature_setting: data.fields.temperature_setting,
    status: data.fields.status,
  }

  const alarmCount = data.fields.errors.length

  const temperatureStyle = getTemperatureStyle(data.fields.temperature_setting, data.fields.status)
  const TempIcon = temperatureStyle.icon

  const showErrorDetails = (e: React.MouseEvent) => {
    e.stopPropagation() // Evitar que se abra el diálogo
    if (alarmCount > 0) {
      const errorMessages = data.fields.errors.map((error) => `• ${error.label} (Código: ${error.value})`).join("\n")
      toast.error(`Errores detectados en ${data.fields.alias}:\n\n${errorMessages}`, {
        duration: 5000,
        style: {
          whiteSpace: "pre-line",
        },
      })
    } else {
      toast.success(`${data.fields.alias}: Sistema funcionando correctamente`)
    }
  }

  return (
    <>
      {/* Tarjeta original clickeable */}
      <div onClick={() => setIsDialogOpen(true)} className=" flex flex-1 w-full cursor-pointer transition-transform hover:scale-[1]">
        <Card
          className={cn(
            " w-full transition-all duration-200 hover:shadow-lg hover:scale-[1.01] border-l-4 overflow-hidden",
            "bg-gradient-to-br",
            temperatureStyle.gradient,
          )}
          style={{
            borderLeftColor: isRunning ? "#10b981" : "#ef4444",
          }}
        >
          <CardHeader className="pb-2 px-3 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1 min-w-0">
                <CardTitle className="text-base sm:text-lg font-semibold truncate">{data.fields.alias}</CardTitle>
                <p className={cn("text-xs sm:text-sm font-medium", temperatureStyle.text)}>
                  {temperatureStyle.message}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 sm:gap-2 flex-shrink-0">
                <div className="relative">
                  <TempIcon
                    className={cn(
                      "h-6 w-6 sm:h-8 sm:w-8 transition-all duration-300 opacity-40",
                      temperatureStyle.text,
                      isRunning && "animate-pulse",
                    )}
                  />
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Badge
                    variant={isRunning ? "default" : "secondary"}
                    className={`${isRunning ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"} text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1`}
                  >
                    <Power className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                    {isRunning ? "ON" : "OFF"}
                  </Badge>
                  {alarmCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-500 hover:bg-red-600 cursor-pointer transition-colors"
                      onClick={showErrorDetails}
                    >
                      {alarmCount} Error{alarmCount > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
            <div className="flex items-center justify-center space-x-8 sm:space-x-12">
              <div className="flex flex-col items-center space-y-1">
                <div className="relative">
                  <div className="flex items-center justify-center">
                    <Thermometer className="text-orange-500" size={16} />
                    <span className="text-xs bg-orange-100 text-orange-700 rounded-full px-1 dark:bg-orange-700/30 dark:text-orange-300">
                      INT
                    </span>
                  </div>
                </div>
                <span className="text-xl sm:text-2xl font-bold tracking-tighter text-orange-500">
                  {data.fields.temperature_indoor}°C
                </span>
                <span className="text-xs text-muted-foreground">Interior</span>
              </div>

              <div className="flex flex-col items-center space-y-1">
                {data.fields.temperature_setting >= 17 ? (
                  <>
                    <div className="relative">
                      <div className="flex items-center justify-center">
                        {data.fields.temperature_setting > data.fields.temperature_indoor ? (
                          <ArrowUp className="text-red-500" size={16} />
                        ) : (
                          <ArrowDown className="text-blue-500" size={16} />
                        )}
                        <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-1 dark:bg-blue-700/30 dark:text-blue-300">
                          SET
                        </span>

                      </div>

                    </div>
                    <span className="text-xl sm:text-2xl font-bold tracking-tighter text-blue-600">
                      {data.fields.temperature_setting}°C
                    </span>
                    <span className="text-xs text-muted-foreground">Configurada</span>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <div className="relative">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="text-purple-500 animate-spin" size={18} />
                        <span className="text-xs bg-purple-100 text-purple-700 rounded-full px-1 dark:bg-purple-700/30 dark:text-purple-300">
                          REC
                        </span>
                      </div>

                    </div>
                    <span className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">
                      Recuperando
                    </span>
                    <span className="text-xs text-purple-500 dark:text-purple-400">Modo Recuperador</span>
                  </div>
                )}
              </div>
            </div>

            {
              temperatureDiff < 13 && (
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-white/20">
                  <span>ID: {data.fields.id}</span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Diferencia: {temperatureDiff}°C
                  </span>
                </div>
              )
            }
          </CardContent>
        </Card>
      </div>

      {/* Dialog para vista detallada */}
      {/* Dialog para vista detallada */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full overflow-auto rounded-lg sm:rounded-xl border-0 sm:border p-3 sm:p-6">
          <DialogHeader className="pb-2 sm:pb-4">
            <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-lg sm:text-2xl">
              <Power
                className={`w-5 h-5 sm:w-7 sm:h-7 ${air.status === 1 ? "text-green-500" : "text-red-500"} flex-shrink-0`}
              />
              <div className="text-left">
                <div className="text-base sm:text-xl font-bold">{air.alias}</div>
                <div className="text-xs sm:text-sm font-normal text-muted-foreground">Controlador: {controller}</div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Solo renderizar cuando el diálogo esté abierto */}
          {isDialogOpen && (
            <AireAcondicionadoDialogContent
              data={data}
              controller={controller}
              dataConfig={dataConfig}
              onClose={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}