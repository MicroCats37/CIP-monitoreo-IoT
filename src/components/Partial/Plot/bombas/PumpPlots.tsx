"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

type PumpData = {
  data: { bomba: string; estado: boolean }
  time: string
}[]

interface PumpStateChartProps {
  pumpData: PumpData[]
}

export default function PumpPlots({ pumpData }: PumpStateChartProps) {
  const allTimes = new Set<string>()
  const pumpStates: { [key: string]: { [key: string]: number } } = {}

  pumpData.forEach((pumpSeries) => {
    const pumpName = pumpSeries[0].data.bomba
    pumpSeries.forEach((entry) => {
      allTimes.add(entry.time)
      if (!pumpStates[entry.time]) {
        pumpStates[entry.time] = {}
      }
      pumpStates[entry.time][pumpName] = entry.data.estado ? 1 : 0
    })
  })

  const chartData = Array.from(allTimes)
    .sort()
    .map((time) => ({
      time,
      ...pumpStates[time],
    }))

  const pumpNames = pumpData.map((pumpSeries) => pumpSeries[0].data.bomba)

  const filteredData = chartData

  const chartConfig = {
    ...Object.fromEntries(
      pumpNames.map((name, index) => [
        name,
        {
          label: `Bomba ${name}`,
          color: `hsl(var(--chart-${index + 1}))`,
        },
      ]),
    ),
  }
  return (
    <div className="flex w-full">
      <Card className="w-full">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 lg:flex-row">
          <div className="grid gap-1 text-center sm:text-left">
            <CardTitle>Estado de las Bombas</CardTitle>
            <CardDescription>Mostrando el estado de las bombas en las últimas horas</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex w-full px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer config={chartConfig} className="h-[250px] w-full">

            <AreaChart data={filteredData} className="overflow-hidden">
              <defs>
                {pumpNames.map((name, index) => (
                  <linearGradient key={name+index} id={`fill${name}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={`var(--color-${name})`} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={`var(--color-${name})`} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                tickLine={false}
                axisLine={false}
                domain={[0,1]}
                ticks={[0, 1]}
                tickFormatter={(value) => (value === 0 ? "Off" : (value === 1 ? "On" : ""))}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleTimeString()
                    }}
                    formatter={(value, name) => [`Bomba ${name} `, value === 1 ? "Encendida" : "Apagada"]}
                    indicator="dot"
                  />
                }
              />
              {pumpNames.map((name, index) => (
                <Area
                  yAxisId="left"
                  key={name+index+index}
                  dataKey={name}
                  type="linear"
                  fill={`url(#fill${name})`}
                  stroke={`var(--color-${name})`}
                  fillOpacity={0.3}
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>

          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

