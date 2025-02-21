import { DataPlotStaked, PlotDataType, WaterPumpType } from "@/types";
import { SingleChart } from "./SingleChart"
import { ChartConfig } from "@/components/ui/chart";
import { QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate";

interface ChartProps {
    chartData: DataPlotStaked[][]
    chartConfig: ChartConfig
    plotType: string
    timeRange: QueryTimeType
    YAxisFormatter?: ((value: any, index: number) => string)
}

export function MultipleSingleCharts({ chartData, chartConfig, plotType, YAxisFormatter,timeRange }: ChartProps) {
    return (
        <div className="flex flex-col gap-4">
            {chartData.map((data, index) => (
                <SingleChart key={index + 's'} chartData={data} chartConfig={chartConfig} plotType={plotType} YAxisFormatter={YAxisFormatter} chartIndex={index} timeRange={timeRange}></SingleChart>
            ))}
        </div>
    )
}

