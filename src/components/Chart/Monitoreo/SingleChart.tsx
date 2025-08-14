"use client"

import { XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CurveType } from "recharts/types/shape/Curve"
import { formatDateTime } from "@/utils/Devices/PlotFormat/ToolTip/formatDateTime"
import { ChartSeriesDataArray } from "@/validators/schemas"
import { formatDateTimeByDiff } from "@/utils/Devices/PlotFormat/ToolTip/formatDateRealTime"
import { getLabel } from "@/utils/Devices/PlotFormat/LabelandUnits"

interface ChartProps {
  name:string,
  chartData: ChartSeriesDataArray,
  chartConfig: ChartConfig
  plotType?: string
  timeRange: number
  chartIndex?: number
  YAxisFormatter?: (value: number) => string
}
export function SingleChart({ name,chartData, chartConfig, plotType, chartIndex, timeRange,YAxisFormatter }: ChartProps) {
  /*const chartDataT = chartData.map(z => ({
    ...z,
    time: new Date(z.time) // Convertir string a Date
}));*/
  const keyColor = Object.keys(chartConfig)[chartIndex ?? 0]?.replace(/\s+/g, '') || '';
  const key = Object.keys(chartConfig)[chartIndex ?? 0];
  const fieldsKeys = Object.keys(chartData[0]).filter(
    (field) => field !== 'timestamp'
  );

  const ss =(Object.keys(chartConfig)
              .filter((key) => fieldsKeys.includes(key))
              .map((key, index) =>(key)))
  console.log(ss)
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 lg:flex-row">
        <div className="grid gap-1 text-center sm:text-left">
          <CardTitle>{getLabel(name)}</CardTitle>
          <CardDescription>Mostrando el monitoreo en las últimas horas</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex w-full px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="h-[250px] w-full"
        >
          <AreaChart
            className="overflow-hidden"
            data={chartData}
          >

            <defs>
              {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map((key, index) => (
                <linearGradient key={'gradiente' + key + index} id={`fill${key.replace(/\s+/g, '') || ''}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig[key].color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartConfig[key].color} stopOpacity={0.1} />
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
              domain={["auto", "auto"]}
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickFormatter={(YAxisFormatter) ||(value => `${value} ${chartConfig[key] && chartConfig[key].unit ? chartConfig[key].unit : ''}`)}

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
            {(Object.keys(chartConfig)
              .filter((key) => fieldsKeys.includes(key))
              .map((key, index) => (
                <Area
                  key={key + index}
                  yAxisId="left"
                  type={plotType as CurveType}
                  dataKey={key}
                  connectNulls={true}
                  stroke={chartConfig[key].color}
                  dot={false}
                  strokeWidth={1}
                  fill={`url(#fill${key.replace(/\s+/g, '') || ''})`}
                  fillOpacity={0.4}
                />
              ))
            )}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>

        </ChartContainer>
      </CardContent>
    </Card>
  )
}
