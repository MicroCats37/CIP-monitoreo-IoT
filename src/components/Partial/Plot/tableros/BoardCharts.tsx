import { BoardChart } from "./BoardChart"


interface PowerData {
  data: {
    potencia: string
    value: number
  }
  time: string
}

interface PowerChartsProps {
  powerData: PowerData[][]
}

const COLORS = {
  activa: "hsl(var(--chart-1))",
  aparente: "hsl(var(--chart-2))",
  reactiva: "hsl(var(--chart-3))",
}

export function BoardCharts({ powerData }: PowerChartsProps) {
  return (
    <div className="flex flex-col gap-4">
      {powerData.map((data, index) => (
        <BoardChart
          key={index}
          data={data}
          title={`Potencia ${data[0]?.data.potencia.charAt(0).toUpperCase() + data[0]?.data.potencia.slice(1)}`}
          color={COLORS[data[0]?.data.potencia as keyof typeof COLORS]}
        />
      ))}
    </div>
  )
}

