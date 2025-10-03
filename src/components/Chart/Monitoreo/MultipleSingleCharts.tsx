
import { SingleChart } from "./SingleChart"
import { ChartConfig } from "@/components/ui/chart";
import {  type ChartStakedData, ChartStakedDataSchema, ChartStakedDataSimpleSchema, type ChartData, ChartStakedDataSimple } from "@/validators/schemas";


interface ChartProps {
    id:string
    chartData: ChartData
    chartConfig: ChartConfig
    plotType?: string
    timeRange: number
    YAxisFormatter?: ((value: any) => string)
}

export function MultipleSingleCharts({
    id,
    chartData,
    chartConfig,
    plotType,
    YAxisFormatter,
    timeRange,
}: ChartProps) {
    const isSimple = ChartStakedDataSimpleSchema.safeParse(chartData).success;
    const isStacked = ChartStakedDataSchema.safeParse(chartData).success;

    return (
        <div className="flex flex-col gap-4">
            {isSimple
                ? // 🔷 ChartStakedDataSimple: sensor -> field -> array
                Object.entries(chartData as ChartStakedDataSimple).map(([sensorKey, sensorValue], index0) =>
                    Object.entries(sensorValue as ChartStakedData).map(([fieldName, sensorData],index) => (
                        <SingleChart
                            YAxisFormatter={YAxisFormatter}
                            name={fieldName}
                            key={`${sensorKey}_${fieldName}_simple_${index}`}
                            id={id}
                            chartData={sensorData}
                            chartConfig={chartConfig}
                            plotType={plotType}
                            chartIndex={index}
                            timeRange={timeRange}
                        />
                    ))
                )
                : isStacked
                    ? // 🔹 ChartStakedData: field -> array
                    Object.entries(chartData as ChartStakedData).map(([fieldName, series], index) => (
                        <SingleChart
                            id={id}
                            YAxisFormatter={YAxisFormatter}
                            name={fieldName}
                            key={index + "_stacked"}
                            chartData={series}
                            chartConfig={chartConfig}
                            plotType={plotType}
                            chartIndex={index}
                            timeRange={timeRange}
                        />
                    ))
                    : (
                        <div className="text-sm text-red-500">
                            ⚠️ Formato de datos no válido para gráficos.
                        </div>
                    )}
        </div>
    );
}
