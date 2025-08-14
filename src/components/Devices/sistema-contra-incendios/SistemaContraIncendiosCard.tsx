"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Activity, AlertTriangle, CheckCircle, Gauge, BellElectric, Power } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SistemaContraIncendiosType } from "@/validators/devices/schemas"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SCICardProps {
  dataMQTT: SistemaContraIncendiosType
}

export default function SistemaContraIncendiosContentCard({ dataMQTT }: SCICardProps) {
  const { device, details } = dataMQTT
  const { fields } = details.data

  // Helper function to format values
  const formatValue = (value: number | undefined, unit = "") => {
    return value !== undefined ? `${value.toFixed(2)}${unit}` : "N/A"
  }

  // Helper function to get status color based on alarms
  const getSystemStatus = () => {
    if (fields.alarms && fields.alarms.length > 0) {
      const hasActiveAlarms = fields.alarms.some((alarm) => alarm.value > 0)
      return hasActiveAlarms ? "destructive" : "secondary"
    }
    return "secondary"
  }

  const systemStatus = getSystemStatus()
  const hasActiveAlarms = fields.alarms?.some((alarm) => alarm.value > 0) || false

  return (
    <div className="flex flex-col w-full">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{device.name}</CardTitle>
            <Badge variant={systemStatus} className="flex items-center gap-1">
              {hasActiveAlarms ? (
                <>
                  <AlertTriangle className="h-3 w-3" />
                  Alarma Activa
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3" />
                  Normal
                </>
              )}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Sensor: {details.data.sensor.name}</p>
          <p className="text-xs text-muted-foreground">
            Última actualización: {new Date(details.time).toLocaleString()}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Electrical Parameters */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Zap className="h-4 w-4 text-yellow-600" />
              Parámetros Eléctricos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {fields.voltage !== undefined && (
                <div className="flex flex-col space-y-1 p-3 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-lg border border-yellow-100 dark:border-yellow-900">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Voltaje</span>
                  <span className="text-lg font-medium text-yellow-700 dark:text-yellow-400">
                    {formatValue(fields.voltage, "V")}
                  </span>
                </div>
              )}
              {fields.current !== undefined && (
                <div className="flex flex-col space-y-1 p-3 bg-orange-50/50 dark:bg-orange-950/20 rounded-lg border border-orange-100 dark:border-orange-900">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Corriente</span>
                  <span className="text-lg font-medium text-orange-700 dark:text-orange-400">
                    {formatValue(fields.current, "A")}
                  </span>
                </div>
              )}
              {fields.frequency !== undefined && (
                <div className="flex flex-col space-y-1 p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-100 dark:border-amber-900">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Frecuencia</span>
                  <span className="text-lg font-medium text-amber-700 dark:text-amber-400">
                    {formatValue(fields.frequency, "Hz")}
                  </span>
                </div>
              )}
            </div>

            {/* Line Voltages */}
            {(fields.line_voltage_l12 || fields.line_voltage_l23 || fields.line_voltage_l31) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {fields.line_voltage_l12 !== undefined && (
                  <div className="flex flex-col space-y-1 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Voltaje L1-L2</span>
                    <span className="text-base font-medium text-blue-700 dark:text-blue-400">
                      {formatValue(fields.line_voltage_l12, "V")}
                    </span>
                  </div>
                )}
                {fields.line_voltage_l23 !== undefined && (
                  <div className="flex flex-col space-y-1 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Voltaje L2-L3</span>
                    <span className="text-base font-medium text-blue-700 dark:text-blue-400">
                      {formatValue(fields.line_voltage_l23, "V")}
                    </span>
                  </div>
                )}
                {fields.line_voltage_l31 !== undefined && (
                  <div className="flex flex-col space-y-1 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Voltaje L3-L1</span>
                    <span className="text-base font-medium text-blue-700 dark:text-blue-400">
                      {formatValue(fields.line_voltage_l31, "V")}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Line Currents */}
            {(fields.current_l1 || fields.current_l2 || fields.current_l3) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {fields.current_l1 !== undefined && (
                  <div className="flex flex-col space-y-1 p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg border border-purple-100 dark:border-purple-900">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Corriente L1</span>
                    <span className="text-base font-medium text-purple-700 dark:text-purple-400">
                      {formatValue(fields.current_l1, "A")}
                    </span>
                  </div>
                )}
                {fields.current_l2 !== undefined && (
                  <div className="flex flex-col space-y-1 p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg border border-purple-100 dark:border-purple-900">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Corriente L2</span>
                    <span className="text-base font-medium text-purple-700 dark:text-purple-400">
                      {formatValue(fields.current_l2, "A")}
                    </span>
                  </div>
                )}
                {fields.current_l3 !== undefined && (
                  <div className="flex flex-col space-y-1 p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg border border-purple-100 dark:border-purple-900">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Corriente L3</span>
                    <span className="text-base font-medium text-purple-700 dark:text-purple-400">
                      {formatValue(fields.current_l3, "A")}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pressure Parameters */}
          {(fields.system_pressure || fields.suction_pressure) && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Gauge className="h-4 w-4 text-blue-600" />
                Presiones del Sistema
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fields.system_pressure !== undefined && (
                  <div className="flex flex-col space-y-1 p-4 bg-cyan-50/50 dark:bg-cyan-950/20 rounded-lg border border-cyan-100 dark:border-cyan-900">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Presión del Sistema</span>
                    <span className="text-xl font-medium text-cyan-700 dark:text-cyan-400">
                      {formatValue(fields.system_pressure, " PSI")}
                    </span>
                  </div>
                )}
                {fields.suction_pressure !== undefined && (
                  <div className="flex flex-col space-y-1 p-4 bg-teal-50/50 dark:bg-teal-950/20 rounded-lg border border-teal-100 dark:border-teal-900">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Presión de Succión</span>
                    <span className="text-xl font-medium text-teal-700 dark:text-teal-400">
                      {formatValue(fields.suction_pressure, " PSI")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Operation Parameters */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Activity className="h-4 w-4 text-green-600" />
              Parámetros de Operación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {fields.start_count !== undefined && (
                <div className="flex flex-col space-y-1 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Arranques</span>
                  <span className="text-lg font-medium text-emerald-700 dark:text-emerald-400">
                    {fields.start_count}
                  </span>
                </div>
              )}
              {fields.run_time !== undefined && (
                <div className="flex flex-col space-y-1 p-3 bg-green-50/50 dark:bg-green-950/20 rounded-lg border border-green-100 dark:border-green-900">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tiempo de Funcionamiento
                  </span>
                  <span className="text-lg font-medium text-green-700 dark:text-green-400">
                    {formatValue(fields.run_time, "h")}
                  </span>
                </div>
              )}
              {fields.hours_since_last_run !== undefined && (
                <div className="flex flex-col space-y-1 p-3 bg-lime-50/50 dark:bg-lime-950/20 rounded-lg border border-lime-100 dark:border-lime-900">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Horas desde último arranque
                  </span>
                  <span className="text-lg font-medium text-lime-700 dark:text-lime-400">
                    {formatValue(fields.hours_since_last_run, "h")}
                  </span>
                </div>
              )}
              {fields.alarms_count !== undefined && (
                <div className="flex flex-col space-y-1 p-3 bg-slate-50/50 dark:bg-slate-950/20 rounded-lg border border-slate-100 dark:border-slate-900">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Alarmas</span>
                  <span className="text-lg font-medium text-slate-700 dark:text-slate-400">{fields.alarms_count}</span>
                </div>
              )}
            </div>

            {/* Cut In/Out Pressures */}
            {(fields.cut_in || fields.cut_out) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fields.cut_in !== undefined && (
                  <div className="flex flex-col space-y-1 p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-lg border border-indigo-100 dark:border-indigo-900">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Presión de Arranque</span>
                    <span className="text-xl font-medium text-indigo-700 dark:text-indigo-400">
                      {formatValue(fields.cut_in, " PSI")}
                    </span>
                  </div>
                )}
                {fields.cut_out !== undefined && (
                  <div className="flex flex-col space-y-1 p-4 bg-violet-50/50 dark:bg-violet-950/20 rounded-lg border border-violet-100 dark:border-violet-900">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Presión de Parada</span>
                    <span className="text-xl font-medium text-violet-700 dark:text-violet-400">
                      {formatValue(fields.cut_out, " PSI")}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Alarms Section - Mantiene exactamente igual */}
          {fields.alarms && fields.alarms.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <BellElectric className="h-4 w-4 text-red-600" />
                Estado de Alarmas
              </h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={hasActiveAlarms ? "destructive" : "secondary"}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {hasActiveAlarms ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      <span>Ver Alarmas</span>
                    </div>
                    <Badge variant="secondary" className="bg-white/20">
                      {fields.alarms.length}
                    </Badge>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full overflow-auto rounded-lg sm:rounded-xl border-0 sm:border p-3 sm:p-6">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <BellElectric className="h-5 w-5 text-red-600" />
                      Estado de Alarmas ({fields.alarms.length})
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-2 mt-4">
                    {[...fields.alarms]
                      .sort((a, b) => b.value - a.value)
                      .map((alarm, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border",
                            alarm.value > 0
                              ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                              : "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {alarm.value > 0 ? (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            <span className="text-sm font-medium">{alarm.label}</span>
                          </div>
                          <Badge variant={alarm.value > 0 ? "destructive" : "secondary"}>
                            {alarm.value > 0 ? "Activa" : "Normal"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Additional Parameters */}
          {fields.custom_locked_rotor_current !== undefined && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Power className="h-4 w-4 text-purple-600" />
                Parámetros Adicionales
              </h3>
              <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-lg border border-rose-100 dark:border-rose-900">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Corriente de Rotor
                </span>
                <div className="text-xl font-medium text-rose-700 dark:text-rose-400 mt-1">
                  {formatValue(fields.custom_locked_rotor_current, "A")}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
