"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Wind,
  Thermometer,
  Bell,
  Power,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Snowflake,
  Flame,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useControlAirDevice } from "./useControlAirDevice"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export interface airType {
  alias: string
  status: string
  unit_name: string
  id: string
  alarm: string
  temperature_setting: number
  temperature_indoor: number
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "run":
      return "bg-green-500 hover:bg-green-600"
    case "stop":
      return "bg-red-500 hover:bg-red-600"
    default:
      return "bg-yellow-500 hover:bg-yellow-600"
  }
}

const getAlarmColor = (alarmCount: number) => {
  return alarmCount > 0 ? "text-red-500" : "text-green-500"
}

const getTemperatureStyle = (temp: number, status: string) => {
  if (status !== "run") {
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
      message: "Modo Recuperado",
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

type AirConditioningUnitCardProps = {
  air: airType
  controller: string
}

export const AirConditioningUnitCard: React.FC<AirConditioningUnitCardProps> = ({ air, controller }) => {
  // Estado para manejar la temperatura seleccionada
  const [selectedTemp, setSelectedTemp] = useState<number>(air.temperature_setting)
  const [isOn, setIsOn] = useState<boolean>(air.status === "run")
  const mutation = useControlAirDevice()

  // Mantener sincronizado el estado con las props
  useEffect(() => {
    setIsOn(air.status === "run")
  }, [air.status])

  const temperatureStyle = getTemperatureStyle(air.temperature_setting, air.status)
  const TempIcon = temperatureStyle.icon
  const alarmCount = Number.parseInt(air.alarm)

  const handleControlAir = () => {
    mutation.mutate(
      {
        controller: controller,
        devid: air.unit_name,
        temp: selectedTemp.toString(),
        run: isOn ? "1" : "0",
      },
      {
        onSuccess: (data) => {
          toast.success("Dispositivo controlado con éxito,Espere un Momento...")
        },
        onError: (error) => {
          toast.error(error.message)
        },
      },
    )
  }

  const incrementTemp = () => {
    if (selectedTemp < 30) {
      setSelectedTemp((prev) => prev + 1)
    }
  }

  const decrementTemp = () => {
    if (selectedTemp > 17) {
      setSelectedTemp((prev) => prev - 1)
    }
  }

  return (
    <>
      <Card
        className={cn(
          "flex flex-col transition-all duration-500 overflow-hidden hover:shadow-lg hover:-translate-y-0.5",
          "bg-gradient-to-br",
          temperatureStyle.gradient,
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">{air.alias}</CardTitle>
              <CardDescription className={cn("font-medium", temperatureStyle.text)}>
                {temperatureStyle.message}
              </CardDescription>
            </div>
            <div className="relative">
              <TempIcon
                className={cn(
                  "h-12 w-12 transition-all duration-300 opacity-20",
                  temperatureStyle.text,
                  isOn && "animate-pulse",
                )}
              />
              {alarmCount > 0 && <Bell className="h-6 w-6 absolute bottom-0 right-0 text-red-500 animate-pulse" />}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wind className={cn("transition-colors", temperatureStyle.text)} size={20} />
                <span className="font-light text-sm">ID: {air.id}</span>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  "flex items-center space-x-1 transition-all duration-300",
                  air.status === "run"
                    ? "bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300",
                )}
              >
                <Power size={14} />
                <span>{air.status === "run" ? "Encendido" : "Apagado"}</span>
              </Badge>
            </div>

            {/* Estado de Alarmas - Siempre visible */}
            <div
              className={cn(
                "px-3 py-2.5 border rounded-lg transition-all duration-300",
                alarmCount > 0
                  ? "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/30 animate-pulse"
                  : "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800/30",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {alarmCount > 0 ? (
                    <>
                      <AlertTriangle className="text-red-500 h-5 w-5" />
                      <span className="text-sm font-medium text-red-700 dark:text-red-300">
                        {alarmCount} {alarmCount === 1 ? "Alarma activa" : "Alarmas activas"}
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="text-green-500 h-5 w-5" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">Sin alarmas</span>
                    </>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-2 text-xs",
                    alarmCount > 0
                      ? "text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20"
                      : "text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/20",
                  )}
                  onClick={() =>
                    toast.info(`Estado de alarmas para ${air.alias}: ${alarmCount > 0 ? `Con problemas ${alarmCount} errores` : "Sin Errores"}`)
                  }
                >
                  {alarmCount > 0 ? "Ver detalles" : "Verificar"}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-8">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Thermometer className="text-orange-500 mb-1" size={24} />
                  <span className="absolute -top-1 -right-1 text-xs bg-orange-100 text-orange-700 rounded-full px-1 dark:bg-orange-700/30 dark:text-orange-300">
                    INT
                  </span>
                </div>
                <span className="text-3xl font-bold tracking-tighter">{air.temperature_indoor}°C</span>
                <span className="text-xs text-muted-foreground">Temperatura Interior</span>
              </div>
              <div className="flex flex-col items-center">
                {air.temperature_setting >= 17 ? (
                  <>
                    <div className="relative">
                      {air.temperature_setting > air.temperature_indoor ? (
                        <ArrowUp className="text-red-500 mb-1" size={24} />
                      ) : (
                        <ArrowDown className="text-blue-500 mb-1" size={24} />
                      )}
                      <span className="absolute -top-1 -right-1 text-xs bg-blue-100 text-blue-700 rounded-full px-1 dark:bg-blue-700/30 dark:text-blue-300">
                        SET
                      </span>
                    </div>
                    <span className="text-3xl font-bold tracking-tighter">{air.temperature_setting}°C</span>
                    <span className="text-xs text-muted-foreground">Temperatura Configurada</span>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative mb-1">
                      <RefreshCw className="text-purple-500 animate-spin-slow" size={28} />
                      <span className="absolute -top-1 -right-1 text-xs bg-purple-100 text-purple-700 rounded-full px-1 dark:bg-purple-700/30 dark:text-purple-300">
                        REC
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">Recuperando</span>
                      <span className="text-xs text-purple-500 dark:text-purple-400">Modo Recuperador</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Control de encendido/apagado */}
            <div className="flex items-center justify-between px-2 py-3 bg-white/50 dark:bg-black/5 rounded-lg">
              <span className="text-sm font-medium">Estado</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{isOn ? "Encendido" : "Apagado"}</span>
                <Switch
                  checked={isOn}
                  onCheckedChange={(checked) => {
                    setIsOn(checked)
                  }}
                  className={cn(isOn ? "bg-green-500" : "bg-gray-200", "transition-colors duration-300")}
                />
              </div>
            </div>

            {air.temperature_setting >= 17 && (
              <div
                className={cn(
                  "px-2 py-3 bg-white/50 dark:bg-black/5 rounded-lg transition-opacity duration-300",
                  !isOn && "opacity-50 pointer-events-none",
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Temperatura</span>
                  <div className="text-2xl font-bold tracking-tighter">{selectedTemp}°C</div>
                </div>
                <div className="flex items-center justify-between space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementTemp}
                    disabled={selectedTemp <= 17 || !isOn}
                    className={cn(
                      "h-8 w-8 rounded-full transition-all duration-300",
                      "bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800",
                    )}
                  >
                    <Minus size={16} className="text-blue-600 dark:text-blue-400" />
                  </Button>
                  <Slider
                    value={[selectedTemp]}
                    min={17}
                    max={30}
                    step={1}
                    onValueChange={(value) => setSelectedTemp(value[0])}
                    disabled={!isOn}
                    className={cn(
                      "flex-grow",
                      selectedTemp <= 20
                        ? "accent-blue-500"
                        : selectedTemp <= 24
                          ? "accent-green-500"
                          : "accent-orange-500",
                    )}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementTemp}
                    disabled={selectedTemp >= 30 || !isOn}
                    className={cn(
                      "h-8 w-8 rounded-full transition-all duration-300",
                      "bg-red-50 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800",
                    )}
                  >
                    <Plus size={16} className="text-red-600 dark:text-red-400" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t  bg-white/50 dark:bg-black/5">
          <Button
            onClick={handleControlAir}
            className={cn(
              "w-full transition-all duration-300",
              isOn
                ? air.temperature_setting < 17
                  ? "bg-purple-500 hover:bg-purple-600 text-white"
                  : selectedTemp <= 20
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : selectedTemp <= 24
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-500 hover:bg-gray-600 text-white",
            )}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Aplicando cambios..." : "Aplicar cambios"}
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}

