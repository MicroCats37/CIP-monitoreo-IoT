"use client"

import type { MonitoreoPlotGeneralMessageType } from "@/validators/schemas"
import LoadingSpinner from "../LoaderSpiner/LoadingSpinner"
import ErrorDisplay from "./ErrorDisplay"
import DeviceContentChartRenderer from "@/components/Pages/Monitoreo/Device/DeviceContentChartRenderer"

interface DeviceContentChartWrapperProps {
  timeRange: number,
  dataHistorical: MonitoreoPlotGeneralMessageType | undefined
  type: string
  isLoading: boolean
  error: Error | unknown
  onRetry: () => void
}

const DeviceContentChartWrapper = ({
  timeRange,
  dataHistorical,
  type,
  isLoading,
  error,
  onRetry,
}: DeviceContentChartWrapperProps) => {
  if (isLoading) {
    return (
      <div className="flex h-[50%] w-full border rounded-lg p-4">
        <LoadingSpinner message="Cargando datos históricos..." size="sm" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="border rounded-lg p-4">
        <ErrorDisplay error={error} onRetry={onRetry} title="Error en datos históricos" />
      </div>
    )
  }

  if (!dataHistorical) {
    return (
      <div className="border rounded-lg p-4 text-center text-muted-foreground">No hay datos históricos disponibles</div>
    )
  }

  return (
    
      <DeviceContentChartRenderer timeRange={timeRange} dataHistorical={dataHistorical} type={type} />
    
    
  )
}

export default DeviceContentChartWrapper
