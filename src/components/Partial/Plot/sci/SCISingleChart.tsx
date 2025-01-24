"use client"

import { XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { formatTime } from "@/utils/formatTime"
import { PlotDataType } from "@/types"


interface SingleSensorChartProps {
  sensorData: PlotDataType[][]
  sensorKey: string
  title: string
  color: string
  unit: string
}

export function SCISingleChart({ sensorData, sensorKey, title, color, unit }: SingleSensorChartProps) {

  const formattedData = sensorData
    .map((s) =>
      s.map((reading) => ({
        time: formatTime(reading.time),
        value: reading.data[sensorKey],
      }))
    )
    .flat();
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full">
        <ChartContainer
          config={{
            [sensorKey]: { label: title, color: color },
          }}
          className="h-[200px] w-full"
        >

          <AreaChart
            accessibilityLayer
            data={formattedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tickFormatter={(value) =>(value.slice(0, 5))}/>
            <YAxis domain={["auto", "auto"]} tickFormatter={(value) => `${value}${unit}`} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" formatter={(value)=>`${title}: ${value}${unit}`}/>}
            />
            <Area type="monotone" dataKey="value" stroke={color} dot={false} strokeWidth={2} fill={color}
                                        fillOpacity={0.4} />
          </AreaChart>

        </ChartContainer>
      </CardContent>
    </Card>
  )
}

