"use client"
import { CircleHelp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useState } from "react"
import { DataPlotStaked } from "@/types"
import { QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate";
import { formatTimeByRange } from "@/utils/formatRangeTime";
import { formatTime } from "@/utils/formatTime";

interface GeneralChartProps {
  chartData: DataPlotStaked[]
  chartConfig: ChartConfig
  dataKey: string
  timeRange: QueryTimeType
  YAxisFormatter?: ((value: any, index: number) => string)
}

export function SelectorInteractiveCharts({ chartData, chartConfig, dataKey, YAxisFormatter, timeRange }: GeneralChartProps) {
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>(
    Object.keys(chartConfig)[0] as keyof typeof chartConfig,
  )
  const getStatusColor = (key: string): string => {
    const color = chartConfig[key as keyof typeof chartConfig]?.color || "#000000"
    return color
  }

  return (
    <Card className="grid w-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle className="text-center text-2xl">{dataKey}</CardTitle>
          <CardDescription className="text-center text-xl">{chartConfig[activeChart].label}</CardDescription>
        </div>
        <div className="flex flex-wrap">
          {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map((key) => {
            const chart = key as keyof typeof chartConfig
            const Icon = chartConfig[chart].icon || CircleHelp;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col items-center justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/90 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <Icon className={`h-8 w-8 mb-1 ${getStatusColor(key)}`} style={{ color: `${getStatusColor(key)}` }} />
                <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                <div className="flex flex-wrap justify-center">
                  <span className="text-lg font-bold leading-none">
                    {chartData[chartData.length - 1][key]}
                  </span>
                  <span className="text-lg font-bold leading-none">{chartConfig[chart].unit}</span>
                </div>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          {chartConfig[activeChart].label === "Velocidad y Dirección" ? (
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => (formatTimeByRange(value, timeRange))} />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke={`var(--color-${activeChart})`}
                unit={chartConfig[activeChart].unit ? chartConfig[activeChart].unit.toString() : undefined}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent
                  labelFormatter={(label) => formatTime(label)}

                />}

              />
              <Line
                yAxisId="left"
                dataKey={activeChart}
                type="linear"
                stroke={`var(--color-${activeChart})`}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          ) : (
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <defs>
                <linearGradient key={'gradientes' + activeChart} id={`sfill${activeChart}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig[activeChart].color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartConfig[activeChart].color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => (formatTimeByRange(value, timeRange))} />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke={`var(--color-${activeChart})`}
                unit={chartConfig[activeChart].unit ? chartConfig[activeChart].unit.toString() : undefined}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent
                  labelFormatter={(label) => formatTime(label)}
                />}
              />
              <Area
                yAxisId="left"
                dataKey={activeChart}
                type="linear"
                fillOpacity={0.4}
                fill={`url(#sfill${activeChart})`}
                stroke={`var(--color-${activeChart})`}
                stackId="a"
              />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}