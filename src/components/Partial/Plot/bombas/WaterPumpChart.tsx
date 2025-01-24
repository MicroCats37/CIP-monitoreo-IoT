"use client"

import { XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { formatTime } from "@/utils/formatTime"


interface PumpStatus {
  data: {
    bomba: string
    estado: boolean
  }
  time: string
}

interface SinglePumpChartProps {
  pumpData: PumpStatus[]
  color: string
}

export function WaterPumpChart({ pumpData, color }: SinglePumpChartProps) {
  const formattedData = pumpData.map((status) => ({
    time: formatTime(status.time),
    estado: status.data.estado ? 1 : 0,
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bomba {pumpData[0].data.bomba} Estado</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            estado: { label: "Status", color: color },
          }}
          className="h-[200px] w-full"
        >


          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id={`fill${color}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={`var(--color-${color})`} stopOpacity={0.8} />
                <stop offset="95%" stopColor={`var(--color-${color})`} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tickFormatter={(value) =>(value.slice(0, 5))}/>
            <YAxis domain={[0, 1]} ticks={[0, 1]} tickFormatter={(value) => (value === 1 ? "On" : "Off")} />
            <ChartTooltip content={<ChartTooltipContent
              labelFormatter={(value) => {
                return value
              }}
              formatter={(value) => [`Bomba ${pumpData[0].data.bomba} `, value === 1 ? "Encendida" : "Apagada"]}
              indicator="dot"
            />} />
            <Area type="stepAfter" dataKey="estado" stroke={color} dot={false} fill={`${color}`}

              fillOpacity={0.3} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

