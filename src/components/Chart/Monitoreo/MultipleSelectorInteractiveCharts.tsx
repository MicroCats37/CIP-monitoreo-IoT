import { SelectorInteractiveCharts } from "./SelectorInteractiveCharts";
import { ChartConfig } from "@/components/ui/chart";
import { ChartStakedData} from "@/validators/schemas";


interface ChartsData {
    name?:string,
    chartSimpleData: ChartStakedData
    chartConfig: ChartConfig
    timeRange: number
}

export function MultipleSelectorInteractiveCharts({ name,chartSimpleData,chartConfig ,timeRange }: ChartsData) {
    
    return (
        <div className="flex-col w-full gap-4 space-y-4">
            {Object.entries(chartSimpleData).map(([fieldName, value], indexChart) => (
                    <div key={indexChart} className="flex">
                        <div className="flex flex-wrap flex-row w-full">
                        <SelectorInteractiveCharts name={name? name:fieldName} key={`${fieldName}-selectived`} chartData={value} chartConfig={chartConfig} timeRange={timeRange}></SelectorInteractiveCharts>
                        </div>
                    </div>
            ))}
        </div>
    );
}

/*
return (
                    
                );
*/