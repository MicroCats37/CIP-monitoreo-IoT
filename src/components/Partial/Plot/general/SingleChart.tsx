"use client"

import { XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CurveType } from "recharts/types/shape/Curve"
import { DataPlotStaked } from "@/types"
import { QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate"
import { format} from "date-fns"
import { formatTime } from "@/utils/formatTime"
import { formatTimeByRange } from "@/utils/formatRangeTime"
interface ChartProps {
  chartData: DataPlotStaked[]
  chartConfig: ChartConfig
  plotType: string
  timeRange: QueryTimeType
  chartIndex?: number
  YAxisFormatter?: ((value: any, index: number) => string)
}

export function SingleChart({ chartData, chartConfig, plotType, chartIndex, YAxisFormatter, timeRange }: ChartProps) {
  /*const chartDataT = chartData.map(z => ({
    ...z,
    time: new Date(z.time) // Convertir string a Date
}));*/
  const keyColor = Object.keys(chartConfig)[chartIndex ?? 0]?.replace(/\s+/g, '') || '';
  const key = Object.keys(chartConfig)[chartIndex ?? 0];
  //console.log(chartDataT)
  return (

    <Card className="w-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 lg:flex-row">
        <div className="grid gap-1 text-center sm:text-left">
          <CardTitle>{chartConfig[key].label}</CardTitle>
          <CardDescription>Mostrando el estado en tiempo real</CardDescription>
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
              <linearGradient key={'gradientes' + chartIndex + key} id={`sfill${keyColor}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig[key].color} stopOpacity={0.8} />
                <stop offset="80%" stopColor={chartConfig[key].color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>(formatTimeByRange(value,timeRange))}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              domain={["auto", "auto"]}
              tickLine={false}
              axisLine={false}
              allowDataOverflow={false}
              tickFormatter={(YAxisFormatter) || undefined || (value => `${value} ${chartConfig[key].unit ? chartConfig[key].unit : ''}`)}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent
              labelFormatter={(label) => formatTime(label)}
              
            />}

            />
            <Area
              key={key + chartIndex + 's'}
              yAxisId="left"
              type={plotType as CurveType}
              dataKey={key}
              stroke={chartConfig[key].color}
              dot={false}
              strokeWidth={1}
              fill={`url(#sfill${keyColor})`}
              fillOpacity={0.4} />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}