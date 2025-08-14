"use client"

import { Activity } from "lucide-react"
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useState } from "react"
import { ChartStakedData } from "@/validators/schemas"
import { formatDateTime } from "@/utils/Devices/PlotFormat/ToolTip/formatDateTime"
import { formatDateTimeByDiff } from "@/utils/Devices/PlotFormat/ToolTip/formatDateRealTime"

// 🔑 TIPOS BASADOS EN TU SCHEMA DE ZOD


interface TransformedDataPoint {
  timestamp: number
  [key: string]: number
}

// 🔑 FUNCIÓN GENÉRICA: Transformar ChartStakedData
function transformChartStakedData(originalData: ChartStakedData, selectedMetric: string): TransformedDataPoint[] {
  const allTimestamps = new Set<number>()
  Object.values(originalData).forEach((entityData) => {
    entityData.forEach((item) => allTimestamps.add(item.timestamp))
  })

  const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => a - b)

  return sortedTimestamps.map((timestamp) => {
    const dataPoint: TransformedDataPoint = { timestamp }

    Object.entries(originalData).forEach(([entityName, entityData]) => {
      const item = entityData.find((d) => d.timestamp === timestamp)
      if (item && item[selectedMetric] !== undefined) {
        const value = item[selectedMetric]
        // Solo incluir si es un número
        if (typeof value === "number") {
          dataPoint[`${entityName}_${selectedMetric}`] = value
        }
      }
    })

    return dataPoint
  })
}

// 🔑 FUNCIÓN GENÉRICA: Obtener métricas disponibles de ChartStakedData
function getAvailableMetrics(data: ChartStakedData): string[] {
  const metrics = new Set<string>()

  Object.values(data).forEach((entityData) => {
    entityData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "timestamp" && typeof item[key] === "number") {
          metrics.add(key)
        }
      })
    })
  })

  return Array.from(metrics)
}

// 🔑 FUNCIÓN CORREGIDA: Obtener último valor para una métrica específica de una entidad
function getLastDefinedValueForEntityMetric(
  data: ChartStakedData,
  entityName: string,
  metric: string,
): { value: number } | null {
  const entityData = data[entityName]
  if (!entityData) return null

  for (let i = entityData.length - 1; i >= 0; i--) {
    const value = entityData[i][metric]
    if (value !== undefined && value !== null && typeof value === "number") {
      return { value }
    }
  }
  return null
}

function getLastDefinedValueForField(data: TransformedDataPoint[], fieldKey: string): { value: number } | null {
  for (let i = data.length - 1; i >= 0; i--) {
    const value = data[i][fieldKey]
    if (value !== undefined && value !== null) {
      return { value }
    }
  }
  return null
}

// 🔑 GENERAR COLORES AUTOMÁTICAMENTE
function generateColors(entityNames: string[]): Record<string, string> {
  const colors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
    "#54a0ff",
    "#5f27cd",
    "#00d2d3",
    "#ff9f43",
    "#10ac84",
    "#ee5a24",
    "#0abde3",
    "#feca57",
    "#48dbfb",
  ]

  const colorMap: Record<string, string> = {}
  entityNames.forEach((name, index) => {
    colorMap[name] = colors[index % colors.length]
  })

  return colorMap
}

// 🔑 PROPS GENÉRICAS CON TU ChartConfig
interface GenericSelectorProps {
  chartData: ChartStakedData
  chartConfig: ChartConfig
  timeRange: number
  title?: string
}

export function SelectorInteractiveStackedCharts({
  chartData,
  chartConfig,
  timeRange,
  title,
}: GenericSelectorProps) {
  // 🔑 DETECTAR AUTOMÁTICAMENTE ENTIDADES Y MÉTRICAS
  const entityNames = Object.keys(chartData)
  const availableMetrics = getAvailableMetrics(chartData)
  // 🔑 FILTRAR SOLO MÉTRICAS QUE TIENEN CONFIGURACIÓN EN chartConfig
  const configuredMetrics = availableMetrics.filter((metric) => chartConfig[metric])
  console.log(configuredMetrics)
  const [activeMetric, setActiveMetric] = useState<string>(configuredMetrics[0])
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>(
      Object.keys(chartConfig)[0] as keyof typeof chartConfig,
    )
  // 🔑 GENERAR COLORES AUTOMÁTICAMENTE
  const entityColors = generateColors(entityNames)

  const transformedData = transformChartStakedData(chartData, activeMetric)
  const currentMetricConfig = chartConfig[activeMetric] || {
    label: activeMetric,
    unit: "",
    icon: Activity,
    chartType: "line",
  }

  // 🔑 CREAR CONFIGURACIÓN DEL GRÁFICO DINÁMICAMENTE PARA RECHARTS
  const rechartsConfig: ChartConfig = {}
  entityNames.forEach((entityName) => {
    rechartsConfig[`${entityName}_${activeMetric}`] = {
      label: entityName,
      color: entityColors[entityName],
      unit: currentMetricConfig.unit,
    }
  })

  const getLastValueForEntity = (entityName: string) => {
    const fieldKey = `${entityName}_${activeMetric}`
    return getLastDefinedValueForField(transformedData, fieldKey)
  }

  // 🔑 DETERMINAR TIPO DE GRÁFICO DESDE chartConfig
  const getChartType = (metricConfig: any): "area" | "line" => {
    if (metricConfig.chartType === "area" || metricConfig.chartType === "line") {
      return metricConfig.chartType
    }
    return "area" // default
  }

  return (
    <Card className="grid w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-center text-2xl">{title ? title : ""}</CardTitle>
          <div className="text-center text-lg font-medium">{currentMetricConfig.label}</div>
        </div>

        {/* 🔑 SELECTOR DINÁMICO BASADO EN chartConfig */}
        <div className="flex flex-wrap">
          {configuredMetrics.map((metric) => {
            const config = chartConfig[metric]
            const Icon = config.icon || Activity

            return (
              <button
                key={metric}
                data-active={activeMetric === metric}
                className="flex flex-1 flex-col items-center justify-center gap-1 border-t px-4 py-3 text-left even:border-l data-[active=true]:bg-muted/90 sm:border-l sm:border-t-0 sm:px-6 sm:py-4"
                onClick={() => setActiveMetric(metric)}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs text-muted-foreground text-center">{config.label}</span>

                {/* 🔑 CORREGIDO: Cada botón muestra los valores de SU propia métrica */}
                <div className="flex flex-col items-center gap-1">
                  {entityNames.map((entityName) => {
                    // 🔑 CLAVE: Usar la métrica del botón, no la activa
                    const value = getLastDefinedValueForEntityMetric(chartData, entityName, metric)
                    return (
                      <div key={entityName} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entityColors[entityName] }} />
                        <span className="text-xs font-bold">
                          {entityName.split(" ").pop()}: {value?.value?.toFixed(1) ?? "N/A"} {config.unit}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={rechartsConfig} className="aspect-auto h-[350px] w-full">
          {getChartType(currentMetricConfig) === "line" ? (
            <LineChart data={transformedData} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                type="number"
                scale="time"
                tickMargin={8}
                minTickGap={32}
                domain={["dataMin", "dataMax"]}
                tickFormatter={(value) => (formatDateTimeByDiff(new Date(value).toISOString(), timeRange))}
              />
              <YAxis />
              <ChartTooltip
                cursor={true}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label, payload) => {
                      // Usar el payload para acceder al timestamp real
                      if (payload && payload.length > 0 && payload[0].payload) {
                        const timestamp = payload[0].payload.timestamp

                        if (!timestamp || isNaN(Number(timestamp))) {
                          return "Tiempo no disponible"
                        }

                        const date = new Date(Number(timestamp))

                        if (isNaN(date.getTime())) {
                          return "Tiempo inválido"
                        }
                        return formatDateTime(date.toISOString())
                      }
                      return "Tiempo no disponible"
                    }}
                  />
                }
              />
              {Object.keys(rechartsConfig).map((key) => (
                <Line
                  key={key}
                  dataKey={key}
                  type="linear"
                  stroke={rechartsConfig[key].color}
                  strokeWidth={2}
                  dot={false}
                  connectNulls={true}
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          ) : (
            <AreaChart data={transformedData} margin={{ left: 12, right: 12 }}>
              <defs>
                {Object.keys(rechartsConfig).map((key, index) => (
                  <linearGradient
                    key={`gradient-${key}-${index}`}
                    id={`fill${key.replace(/\s+/g, "")}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={rechartsConfig[key].color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={rechartsConfig[key].color} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timestamp"
                type="number"
                scale="time"
                tickMargin={8}
                minTickGap={32}
                domain={["dataMin", "dataMax"]}
                tickFormatter={(value) => (formatDateTimeByDiff(new Date(value).toISOString(), timeRange))}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke={`var(--color-${activeMetric})`}
                unit={chartConfig[activeMetric].unit ? chartConfig[activeMetric].unit.toString() : undefined}
              />
              <ChartTooltip
                cursor={true}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label, payload) => {
                      // Usar el payload para acceder al timestamp real
                      if (payload && payload.length > 0 && payload[0].payload) {
                        const timestamp = payload[0].payload.timestamp

                        if (!timestamp || isNaN(Number(timestamp))) {
                          return "Tiempo no disponible"
                        }

                        const date = new Date(Number(timestamp))

                        if (isNaN(date.getTime())) {
                          return "Tiempo inválido"
                        }
                        return formatDateTime(date.toISOString())
                      }
                      return "Tiempo no disponible"
                    }}
                  />
                }
              />
              {Object.keys(rechartsConfig).map((key) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="linear"
                  stackId="stack"
                  yAxisId="left"
                  fill={`url(#fill${key.replace(/\s+/g, "")})`}
                  stroke={rechartsConfig[key].color}
                  fillOpacity={0.4}
                  connectNulls={true}
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
