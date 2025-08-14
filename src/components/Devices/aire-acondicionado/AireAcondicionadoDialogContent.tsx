"use client"

import { useMemo,useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Power, AlertTriangle, CheckCircle2, Minus, Plus, Thermometer, Wind, Settings, Activity, CircleDot, BellRing } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

import type { AireAcondicionadoFieldsType } from "@/validators/devices/schemas"
import type { PageEntry } from "@/utils/Devices/Data/data.pages.monitoreo"
import {  MonitoreoPlotGeneralMessageDetailsArrayType, MonitoreoPlotGeneralMessageType, MonitoreoPlotGeneralSchema } from "@/validators/schemas"
import { useGenericFetchApi } from "@/hooks/fetchApiQuery/useGenericFetchApi"
import { useInitialMonitoreoHistoricalData } from "@/hooks/monitoreoHistorical/useInitialMonitoreoHistoricalData"
import { useMonitoreoHistoricalStore } from "@/store/storages/monitoreoPlots.store"
import { useShallow } from "zustand/react/shallow"
import { MultipleSelectorInteractiveCharts } from "@/components/Chart/Monitoreo/MultipleSelectorInteractiveCharts"
import { formatChartConfigStackedDetailsArrayArray } from "@/utils/Devices/PlotFormat/general"
import { useControlAirDevice } from "@/hooks/devices/aire-acondiconado/useMutation"
import LoadingSpinner from "@/components/Custom/LoaderSpiner/LoadingSpinner"
import ErrorDisplay from "@/components/Custom/Loaders/ErrorDisplay"
import { diffTimeMs } from "@/utils/Devices/PlotFormat/ToolTip/diffTime"
import { ButtonFechingDate, QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate"
import { addIconsToChartConfig, IconMapping } from "@/utils/Devices/PlotFormat/addIconConfig"

interface TimeRange {
  start: string
  stop: string
}
interface AireAcondicionadoDialogContentProps {
  data: AireAcondicionadoFieldsType
  controller: string
  dataConfig: PageEntry
  onClose: () => void
}
interface DeviceContentChartWrapperProps {
  timeRange: number,
  name: string,
  dataHistorical?: MonitoreoPlotGeneralMessageType
  isLoading: boolean
  error: Error | unknown
  onRetry: () => void
}

const AireDevice = ({
  timeRange,
  name,
  dataHistorical,
  isLoading,
  error,
  onRetry,
}: DeviceContentChartWrapperProps) => {
  if (isLoading) {
    return (
      <div className="border rounded-lg p-4">
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
  if (dataHistorical) {
    const dataFormatted = {
      ...dataHistorical,
      details: [dataHistorical.details],

    };
    const { data, chartConfig } = formatChartConfigStackedDetailsArrayArray(dataFormatted as MonitoreoPlotGeneralMessageDetailsArrayType)
    const myIconMap: IconMapping = {
      status: CircleDot,
      alarm: BellRing,
      temperature_setting: Thermometer,
      temperature_indoor: Thermometer,
    }
    const chartConfigWithIcons = addIconsToChartConfig(chartConfig, myIconMap, CircleDot)
    return (
      <div>
        <MultipleSelectorInteractiveCharts name={name} chartSimpleData={data} chartConfig={chartConfigWithIcons} timeRange={timeRange}></MultipleSelectorInteractiveCharts>
      </div>
    )

  }
  if (!dataHistorical) {
    return (
      <div className="border rounded-lg p-4 text-center text-muted-foreground">No hay datos históricos disponibles</div>
    )
  }


}
export function AireAcondicionadoDialogContent({
  data,
  controller,
  dataConfig,
  onClose,
}: AireAcondicionadoDialogContentProps) {
  const topic = dataConfig.mqttTopic;
  const type = dataConfig.generalName
  const name = dataConfig.name;
  const genneralName = dataConfig.generalName;
  const deviceId = data.fields.id.toString()
  const url = dataConfig.generalEndpoint + '/unit/' + deviceId + '/historical'






  const air = data.fields
  const [selectedTemp, setSelectedTemp] = useState<number>(air.temperature_setting)
  const [isOn, setIsOn] = useState<boolean>(air.status === 1)
  const mutation = useControlAirDevice()


  const DateTime = (new Date());
  const [timeRange, setTimeRange] = useState<TimeRange>(() => ({
    start: new Date(DateTime.getTime() - 60 * 60 * 1000).toISOString(), // 1h atrás
    stop: new Date().toISOString(), // ahora
  }));

  const [currentInterval, setCurrentInterval] = useState<QueryTimeType>("1h");

  // Calcular diffTime sólo cuando cambie el rango
  const diffTime = diffTimeMs(timeRange.start, timeRange.stop);
  const queryParamsH = { start: timeRange.start, stop: timeRange.stop };

  // ✅ queryKey FIJO
  const queryKey = useMemo(
    () => ["historical", topic, queryParamsH.start, queryParamsH.stop],
    [topic, queryParamsH.start, queryParamsH.stop]
  );
  const {
    data: data_h,
    error,
    isLoading,
    refetch,
  } = useGenericFetchApi<MonitoreoPlotGeneralMessageType>({
    url: url,
    queryParams: queryParamsH,
    queryKey,
    schema: MonitoreoPlotGeneralSchema,
    apiOptions: {
      staleTime: Infinity,
      refetchOnMount: false,
    },
  });

  useInitialMonitoreoHistoricalData(topic + deviceId, data_h);

  const dataHistorical: MonitoreoPlotGeneralMessageType = useMonitoreoHistoricalStore(useShallow(s => s.historicalData[topic + deviceId]))

  const alarmCount = data.fields.errors.length

  const handleControlAir = () => {
    mutation.mutate(
      {
        controller: controller,
        devid: data.sensor.name,
        temp: selectedTemp.toString(),
        run: isOn ? "1" : "0",
      },
      {
        onSuccess: (data) => {
          toast.success("Dispositivo controlado con éxito, Espere un Momento...")
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
    <div className="flex-col space-y-4 sm:space-y-6 py-2 sm:py-4 px-2 sm:px-0">
      {/* Información principal */}
      <div className="flex w-full gap-4">

        <Card className="w-full border-l-4 border-l-orange-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Thermometer className="w-4 h-4" />
              Temperatura Interior
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{air.temperature_indoor}°C</div>
            <p className="text-xs text-muted-foreground mt-1">Sensor ambiente</p>
          </CardContent>
        </Card>

        {air.temperature_setting >= 17 &&
          <Card className="w-full border-l-4 border-l-blue-400">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Temperatura Configurada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{air.temperature_setting}°C</div>
              <p className="text-xs text-muted-foreground mt-1">Setpoint objetivo</p>
            </CardContent>
          </Card>}

        <Card className="w-full border-l-4 border-l-green-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Power className="w-4 h-4" />
              Estado Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={cn(air.status === 1 ? "bg-green-500" : "bg-red-500", "text-white text-lg px-3 py-1")}>
              <Power size={14} className="mr-1" />
              {air.status === 1 ? "ENCENDIDO" : "APAGADO"}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Última actualización: {new Date().toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Información del dispositivo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="w-5 h-5" />
            Información del Dispositivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">ID del Dispositivo</p>
              <p className="text-lg sm:text-xl font-bold">{air.id}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">Controlador</p>
              <p className="text-lg sm:text-xl font-semibold">{controller}</p>
            </div>
            <div className="text-center sm:text-left sm:col-span-2 lg:col-span-1">
              <p className="text-sm text-muted-foreground">Device Name</p>
              <p className="text-lg sm:text-xl font-semibold">{data.sensor.name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado de Alarmas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {alarmCount > 0 ? (
              <AlertTriangle className="text-red-500 h-5 w-5" />
            ) : (
              <CheckCircle2 className="text-green-500 h-5 w-5" />
            )}
            Estado de Alarmas ({alarmCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "px-3 py-2.5 border rounded-lg transition-all duration-300",
              alarmCount > 0
                ? "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/30"
                : "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800/30",
            )}
          >
            {alarmCount > 0 ? (
              <div className="space-y-2">
                <span className="text-sm font-medium text-red-700 dark:text-red-300">
                  {alarmCount} {alarmCount === 1 ? "Error detectado" : "Errores detectados"}:
                </span>
                <div className="space-y-1">
                  {data.fields.errors.map((error, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded text-sm"
                    >
                      <span className="text-red-800 dark:text-red-200">{error.label}</span>
                      <Badge variant="destructive" className="text-xs">
                        Código: {error.value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Sistema funcionando correctamente - Sin errores detectados
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controles del dispositivo */}
      {Math.abs(air.temperature_indoor - air.temperature_setting) <= 13 && (<>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Controles del Dispositivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Control de encendido/apagado */}
            <div className="flex items-center justify-between px-2 py-3 bg-white/50 dark:bg-black/5 rounded-lg">
              <span className="text-sm font-medium">Estado del Dispositivo</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{isOn ? "Encendido" : "Apagado"}</span>
                <Switch
                  checked={isOn}
                  onCheckedChange={(checked) => setIsOn(checked)}
                  className={cn(isOn ? "bg-green-500" : "bg-gray-200", "transition-colors duration-300")}
                />
              </div>
            </div>

            {/* Control de temperatura */}
            {air.temperature_setting >= 17 && (
              <div
                className={cn(
                  "px-2 py-3 bg-white/50 dark:bg-black/5 rounded-lg transition-opacity duration-300",
                  !isOn && "opacity-50 pointer-events-none",
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Control de Temperatura</span>
                  <div className="text-2xl font-bold tracking-tighter">{selectedTemp}°C</div>
                </div>
                <div className="flex items-center justify-between space-x-2 sm:space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementTemp}
                    disabled={selectedTemp <= 17 || !isOn}
                    className={cn(
                      "h-10 w-10 sm:h-8 sm:w-8 rounded-full transition-all duration-300 flex-shrink-0",
                      "bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800",
                    )}
                  >
                    <Minus size={18} className="text-blue-600 dark:text-blue-400 sm:w-4 sm:h-4" />
                  </Button>
                  <Slider
                    value={[selectedTemp]}
                    min={17}
                    max={30}
                    step={1}
                    onValueChange={(value) => setSelectedTemp(value[0])}
                    disabled={!isOn}
                    className={cn(
                      "flex-grow mx-2",
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
                      "h-10 w-10 sm:h-8 sm:w-8 rounded-full transition-all duration-300 flex-shrink-0",
                      "bg-red-50 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800",
                    )}
                  >
                    <Plus size={18} className="text-red-600 dark:text-red-400 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>


        <div className='w-full flex gap-4 justify-end flex-wrap'>
          <ButtonFechingDate
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            currentInterval={currentInterval}
            setCurrentInterval={setCurrentInterval}
          />
        </div>
        <AireDevice timeRange={diffTime} name={air.alias} error={error} isLoading={isLoading} dataHistorical={dataHistorical} onRetry={refetch} />
      </>)

      }





      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t space-y-3 sm:space-y-0">
        <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
          Alias: {air.alias} | Última sincronización: {new Date().toLocaleString()}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
            Cerrar
          </Button>
          {Math.abs(air.temperature_indoor - air.temperature_setting) <= 13 && <Button
            onClick={handleControlAir}
            className={cn(
              "w-full sm:w-auto transition-all duration-300",
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
          </Button>}

        </div>
      </div>
    </div>
  )
}
