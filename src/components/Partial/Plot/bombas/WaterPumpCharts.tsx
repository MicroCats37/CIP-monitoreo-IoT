import { WaterPumpChart } from "./WaterPumpChart"


interface PumpStatus {
  data: {
    bomba: string
    estado: boolean
  }
  time: string
}

interface MultiplePumpStatusChartsProps {
  pumpData: PumpStatus[][]
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export function WaterPumpCharts({ pumpData }: MultiplePumpStatusChartsProps) {
  return (
    <div className="flex flex-col gap-4">
      {pumpData.map((pumpStatuses, index) => (
        <WaterPumpChart
          key={pumpStatuses[0].data.bomba}
          pumpData={pumpStatuses}
          color={COLORS[index]}
        />
      ))}
    </div>
  )
}

