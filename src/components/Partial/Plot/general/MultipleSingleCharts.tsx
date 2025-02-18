import { DataPlotStaked, PlotDataType, WaterPumpType } from "@/types";
import { SingleChart } from "./SingleChart"
import { ChartConfig } from "@/components/ui/chart";

interface ChartProps {
    chartData: DataPlotStaked[][]
    chartConfig: ChartConfig
    plotType: string
    YAxisFormatter?: ((value: any, index: number) => string)
}

export function MultipleSingleCharts({ chartData, chartConfig, plotType, YAxisFormatter }: ChartProps) {
    return (
        <div className="flex flex-col gap-4">
            {chartData.map((data, index) => (
                <SingleChart key={index + 's'} chartData={data} chartConfig={chartConfig} plotType={plotType} YAxisFormatter={YAxisFormatter} chartIndex={index}></SingleChart>
            ))}
        </div>
    )
}

