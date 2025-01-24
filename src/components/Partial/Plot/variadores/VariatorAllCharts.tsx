import { VariatorsType } from "@/types"
import { VariatorsCharts } from "./VariatorsCharts"


interface PumpDataChartsProps {
  data: VariatorsType[][]
}
/*
const DATA_CONFIG = [
  { key: "velocidad_y_direccion", title: "Velocidad y Dirección", color: "hsl(var(--chart-1))", unit: " m/s" },
  { key: "frecuencia", title: "Frecuencia", color: "hsl(var(--chart-2))", unit: " Hz" },
  { key: "intensidad", title: "Intensidad", color: "hsl(var(--chart-3))", unit: " A" },
  { key: "potencia", title: "Potencia", color: "hsl(var(--chart-4))", unit: " W" },
  { key: "tension_salida", title: "Tensión de Salida", color: "hsl(var(--chart-5))", unit: " V" },
  { key: "temperatura_unidad", title: "Temperatura de la Unidad", color: "hsl(var(--chart-2))", unit: " °C" },
  { key: "tiempo_marcha", title: "Tiempo de Marcha", color: "hsl(var(--chart-2))", unit: " s" },
]
*/
export function VariatorAllCharts({ data }: PumpDataChartsProps) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((variator, pumpIndex) => (
        <div key={pumpIndex} className="flex">
          <div className="flex flex-wrap flex-row w-full">
          <VariatorsCharts data={variator}></VariatorsCharts>
          </div>
        </div>
      ))}
    </div>
  )
}

/*
{DATA_CONFIG.map((config) => (
              <VariatorSingleChart
                key={config.key}
                pumpData={pumpReadings}
                dataKey={config.key as keyof VariatorsType["data"]}
                title={config.title}
                color={config.color}
                unit={config.unit}
              />
            ))} */