import { DataPlotStaked, PlotDataType } from "@/types";
import { VariatorMultipleChartFormatted } from "../../Content/variadores/VariatorsFormattedDataPlot";
import { SelectorInteractiveCharts } from "./SelectorInteractiveCharts";
import { QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate";

interface ChartsData {
    chartsData: PlotDataType[][]
    dataKey:string
    timeRange: QueryTimeType
}

export function MultipleSelectorInteractiveCharts({ chartsData, dataKey,timeRange }: ChartsData) {
    return (
        <>
            {chartsData.map((chartData, indexChart) => {
                const {chartDataM, chartConfigM} = VariatorMultipleChartFormatted([chartData])
                return (
                    <div key={indexChart} className="flex">
                        <div className="flex flex-wrap flex-row w-full">
                        <SelectorInteractiveCharts chartData={chartDataM[0]} chartConfig={chartConfigM} dataKey={chartData[0].data[dataKey] ? chartData[0].data[dataKey] as string:''} timeRange={timeRange}></SelectorInteractiveCharts>
                        </div>
                    </div>
                );
            })}
        </>
    );
}