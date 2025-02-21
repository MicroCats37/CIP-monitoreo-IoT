"use client"

import { XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CurveType } from "recharts/types/shape/Curve"
import { DataPlotStaked } from "@/types"
import { QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate"
import { formatTimeByRange } from "@/utils/formatRangeTime"
import { formatTime } from "@/utils/formatTime"


interface ChartProps {
  chartData: DataPlotStaked[]
  chartConfig: ChartConfig
  plotType: string
  YAxisFormatter?: ((value: any, index: number) => string)
  timeRange: QueryTimeType
}



export function StakedSingleChart({ chartData, chartConfig, plotType, YAxisFormatter, timeRange }: ChartProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 lg:flex-row">
        <div className="grid gap-1 text-center sm:text-left">
          <CardTitle>Estado de las Bombas</CardTitle>
          <CardDescription>Mostrando el estado de las bombas en las últimas horas</CardDescription>
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
                <linearGradient key={'gradiente' + key + index} id={`fill${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig[key].color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartConfig[key].color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => (formatTimeByRange(value, timeRange))}
            />
            <YAxis
              yAxisId="left"
              domain={["auto", "auto"]}
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickFormatter={(YAxisFormatter) || undefined}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent
                labelFormatter={(label) => formatTime(label)}

              />}

            />
            {
              (Object.keys(chartConfig) as Array<keyof typeof chartConfig>)
                .map((key, index) => (
                  <Area
                    key={key + index}
                    yAxisId="left"
                    type={plotType as CurveType}
                    dataKey={key}
                    stroke={chartConfig[key].color}
                    dot={false}
                    strokeWidth={1}
                    fill={`url(#fill${key})`}
                    fillOpacity={0.4} />
                ))
            }
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>

        </ChartContainer>
      </CardContent>
    </Card>
  )
}

