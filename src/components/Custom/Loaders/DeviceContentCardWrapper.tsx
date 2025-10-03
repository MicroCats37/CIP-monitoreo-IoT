"use client"

import { GeneralMQTTObjectType } from "@/types"
import { PageEntry } from "@/utils/Devices/Data/data.pages.monitoreo"
import LoadingSpinner from "./LoadingSpinner"
import ErrorDisplay from "./ErrorDisplay"
import DeviceContentCardRenderer from "@/components/Pages/Monitoreo/Device/DeviceContentCardRenderer"



interface DeviceContentCardWrapperProps {
  data: PageEntry
  dataMQTT: GeneralMQTTObjectType | undefined
  type: string
  isLoading: boolean
  error: Error | unknown
  onRetry: () => void
}

const DeviceContentCardWrapper = ({
  data,
  dataMQTT,
  type,
  isLoading,
  error,
  onRetry,
}: DeviceContentCardWrapperProps) => {
  // 🎯 LÓGICA SIMPLIFICADA: Datos > Error > Loading > No Data

  // Si hay datos, mostrar componente (prioridad máxima)
  if (dataMQTT) {
    return <DeviceContentCardRenderer data={data} dataMQTT={dataMQTT} type={type} />
  }

  // Si no hay datos pero está cargando, mostrar loading
  if (isLoading && !dataMQTT) {
    return (
      <div className="flex flex-1 h-full w-full border rounded-lg p-4">
        <LoadingSpinner message="Cargando datos de tarjeta..." size="sm" />
      </div>
    )
  }

  // Si hay error y no hay datos, mostrar error
  if (error && !dataMQTT) {
    return (
      <div className="flex flex-1 h-full w-full border rounded-lg p-4">
        <ErrorDisplay error={error} onRetry={onRetry} title="Error en datos de tarjeta" />
      </div>
    )
  }

  // Fallback: no hay datos
  return (
    <div className="flex flex-1 h-full w-full border rounded-lg p-4 text-center text-muted-foreground">No hay datos de tarjeta disponibles</div>
  )
}

export default DeviceContentCardWrapper

