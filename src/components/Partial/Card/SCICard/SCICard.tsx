import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SCIType } from "@/types"
import { Zap, Activity, AlertTriangle, CheckCircle, Thermometer, Gauge, Wind, BellElectric } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function SCICard({ data }: { data: SCIType }) {
  const getStatusColor = (value: boolean) => value ? "text-red-500" : "text-green-500"
  
  const renderStatusItem = (label: string, value: boolean, icon: React.ReactNode) => (
    <div className={cn("flex items-center justify-between p-2 rounded transition-colors", 
      value ? "bg-red-100 dark:bg-red-900/20" : "bg-green-100 dark:bg-green-900/20")}>
      <span className="text-sm font-medium">{label}</span>
      <Badge
        variant={value ? "destructive" : "secondary"}
        className="flex items-center space-x-1"
      >
        {icon}
        <span className="hidden sm:inline">{value ? 'Activo' : 'Inactivo'}</span>
      </Badge>
    </div>
  )

  return (
    <Card className="flex-col h-full w-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <CardHeader className="w-full ">
        <CardTitle className="flex items-center justify-between text-xl sm:text-2xl">
          <span className="mr-2">Sistema Contra Incendios</span>
          <BellElectric className={cn("w-6 h-6 sm:w-8 sm:h-8", getStatusColor(!data.data.power_loss))} />
        </CardTitle>
        <CardDescription className="text-sm">
          Última actualización: {new Date(data.time!).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <div className="flex-col gap-4 sm:gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <div className="flex flex-col items-center justify-center p-2 sm:p-3 bg-yellow-100 rounded-lg dark:bg-yellow-900/20">
              <Zap className="text-yellow-500 w-4 h-4 sm:w-6 sm:h-6 mb-1 sm:mb-2" />
              <span className="text-base sm:text-lg font-bold">{data.data.voltage}V</span>
              <span className="text-xs">Voltaje</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 sm:p-3 bg-blue-100 rounded-lg dark:bg-blue-900/20">
              <Activity className="text-blue-500 w-4 h-4 sm:w-6 sm:h-6 mb-1 sm:mb-2" />
              <span className="text-base sm:text-lg font-bold">{data.data.current}A</span>
              <span className="text-xs">Corriente</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 sm:p-3 bg-purple-100 rounded-lg dark:bg-purple-900/20">
              <Gauge className="text-purple-500 w-4 h-4 sm:w-6 sm:h-6 mb-1 sm:mb-2" />
              <span className="text-base sm:text-lg font-bold">{data.data.frequency}Hz</span>
              <span className="text-xs">Frecuencia</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 sm:p-3 bg-orange-100 rounded-lg dark:bg-orange-900/20">
              <Wind className="text-orange-500 w-4 h-4 sm:w-6 sm:h-6 mb-1 sm:mb-2" />
              <span className="text-base sm:text-lg font-bold">{data.data.custom_locked_rotor_current}A</span>
              <span className="text-xs">LRC</span>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6">
            <h4 className="font-semibold mb-2 text-base sm:text-lg">Estado del Sistema</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {renderStatusItem('Pérdida de Fase L1', data.data.phase_loss_l1, <AlertTriangle size={14} />)}
              {renderStatusItem('Pérdida de Fase L2', data.data.phase_loss_l2, <AlertTriangle size={14} />)}
              {renderStatusItem('Pérdida de Fase L3', data.data.phase_loss_l3, <AlertTriangle size={14} />)}
              {renderStatusItem('Corriente de Rotor Bloqueado', data.data.lock_rotor_current, <AlertTriangle size={14} />)}
              {renderStatusItem('Fallo de Arranque', data.data.fail_to_start, <AlertTriangle size={14} />)}
              {renderStatusItem('Problema de Interruptor de Transferencia', data.data.transfer_switch_trouble, <AlertTriangle size={14} />)}
              {renderStatusItem('Pérdida de Energía', data.data.power_loss, <Zap size={14} />)}
              {renderStatusItem('Mantenimiento Requerido', data.data.service_required, <AlertTriangle size={14} />)}
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6">
            <h4 className="font-semibold mb-2 text-base sm:text-lg">Alarmas Adicionales</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {renderStatusItem('Subcorriente', data.data.undercurrent, <Activity size={14} />)}
              {renderStatusItem('Sobrecorriente', data.data.overcurrent, <Activity size={14} />)}
              {renderStatusItem('Bajo Voltaje', data.data.undervoltage, <Zap size={14} />)}
              {renderStatusItem('Sobrevoltaje', data.data.overvoltage, <Zap size={14} />)}
              {renderStatusItem('Desequilibrio de Fase', data.data.phase_unbalanced, <AlertTriangle size={14} />)}
              {renderStatusItem('Prueba Semanal Requerida', data.data.weekly_test_required, <CheckCircle size={14} />)}
              {renderStatusItem('Baja Temperatura Ambiente', data.data.low_ambient_temperature_internal_sensor, <Thermometer size={14} />)}
              {renderStatusItem('Alta Temperatura Ambiente', data.data.high_ambient_temperature_internal_sensor, <Thermometer size={14} />)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

