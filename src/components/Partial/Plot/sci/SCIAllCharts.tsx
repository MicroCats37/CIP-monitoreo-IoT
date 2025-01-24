import { PlotDataType } from "@/types"
import { SCISingleChart } from "./SCISingleChart"




interface MultipleSensorChartsProps {
  data: PlotDataType[][]
}

const SENSOR_CONFIG = [
  { key: "voltage", title: "Voltaje", color: "hsl(var(--chart-1))", unit: "V" },
  { key: "current", title: "Corriente", color: "hsl(var(--chart-2))", unit: "A" },
  { key: "frequency", title: "Frecuencia", color: "hsl(var(--chart-3))", unit: "Hz" },
  { key: "custom_locked_rotor_current", title: "Locked Rotor Current", color: "hsl(var(--chart-4))", unit: "A" },
]

export function SCIAllCharts({ data }: MultipleSensorChartsProps) {
  return (
    <div className="w-full flex flex-wrap gap-4">
      {SENSOR_CONFIG.map((config) => (
        <SCISingleChart
          key={config.key}
          sensorData={data}
          sensorKey={config.key}
          title={config.title}
          color={config.color}
          unit={config.unit}
        />
      ))}
    </div>
  )
}

