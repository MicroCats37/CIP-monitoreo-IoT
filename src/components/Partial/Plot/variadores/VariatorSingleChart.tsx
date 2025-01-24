"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { VariatorsType } from "@/types"

interface SinglePumpDataChartProps {
  pumpData: VariatorsType[]
  dataKey: keyof VariatorsType["data"]
  title: string
  color: string
  unit: string
}

export function VariatorSingleChart({ pumpData, dataKey, title, color, unit }: SinglePumpDataChartProps) {
  const formattedData = pumpData.map((reading) => ({
    time: new Date(reading.time).toLocaleTimeString(),
    [dataKey]: reading.data[dataKey],
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            [dataKey]: { label: title, color: color },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={["auto", "auto"]} tickFormatter={(value) => `${value}${unit}`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey={dataKey} stroke={color} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

