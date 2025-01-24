"use client"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { WaterPumpType } from "@/types"
import { useState } from "react"

interface DataChartProps {
    data: WaterPumpType[][]
}

export function WaterPumpsAllChart({data}:DataChartProps) {
    const [timeRange, setTimeRange] = useState('3h')

  // Procesamos los datos para el formato que espera el gráfico
  const allTimes = new Set<string>()
  const pumpStates: { [key: string]: { [key: string]: number } } = {}

  data.forEach(pumpSeries => {
    const pumpName = pumpSeries[0].data.bomba
    pumpSeries.forEach(entry => {
      allTimes.add(entry.time)
      if (!pumpStates[entry.time]) {
        pumpStates[entry.time] = {}
      }
      pumpStates[entry.time][pumpName] = entry.data.estado ? 1 : 0
    })
  })

  const chartData = Array.from(allTimes).sort().map(time => ({
    time,
    ...pumpStates[time],
  }))

  const pumpNames = data.map(pumpSeries => pumpSeries[0].data.bomba)

  const now = new Date()
  const timeRangeInHours = parseInt(timeRange.slice(0, -1))
  const cutoffTime = new Date(now.getTime() - timeRangeInHours * 60 * 60 * 1000)

  const filteredData = chartData.filter(entry => new Date(entry.time) >= cutoffTime)

  const chartConfig = {
    ...Object.fromEntries(
      pumpNames.map((name, index) => [
        name,
        {
          label: `Bomba ${name}`,
          color: `hsl(var(--chart-${index + 1}))`,
        },
      ])
    ),
  }
    
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
