import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PowerData {
  data: {
    potencia: string
    value: number
  }
  time: string
}

interface BoardChartProps {
  data: PowerData[]
  title: string
  color: string
}

export function BoardChart({ data, title, color }: BoardChartProps) {
  const formattedData = data.map((item) => ({
    ...item,
    time: new Date(item.time).toLocaleTimeString(),
    [item.data.potencia]: item.data.value,
  }))

  const dataKey = data[0]?.data.potencia || "value"

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
          className="h-[300px] w-full"
        >

          <AreaChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tickFormatter={(value) =>(value.slice(0, 5))}/>
            <YAxis domain={["auto", "auto"]} tickFormatter={(value) => `${value} ${dataKey === 'activa' ? 'KW' : (dataKey === 'reactiva' ? 'KVAR' : 'KVA')}`} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" formatter={(value) => `Potencia ${dataKey} ${value} ${dataKey === 'activa' ? 'KW' : (dataKey === 'reactiva' ? 'KVAR' : 'KVA')}`} />}
            />
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.3} />
          </AreaChart>

        </ChartContainer>
      </CardContent>
    </Card>
  )
}

