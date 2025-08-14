import { MultipleSingleCharts } from "@/components/Chart/Monitoreo/MultipleSingleCharts";
import { formatChartConfigStackedDetailsArrayArray } from "@/utils/Devices/PlotFormat/general";
import { BombasDeAguaChosicaHistoricalType } from "@/validators/devices/schemas";


interface Props {
    timeRange: number,
    dataHistorical: BombasDeAguaChosicaHistoricalType
}

const BombasDeAguaChosicaChart: React.FC<Props> = ({ timeRange, dataHistorical }) => {

    const { data: dato1, chartConfig: chartConfig1 } = formatChartConfigStackedDetailsArrayArray(dataHistorical)

    const YAxisFormatter = (value: number) => {
        return value === 0 ? "Off" : value === 1 ? "On" : "";
    };
    return (

        <div className="flex-col w-full gap-4 space-y-4">
            <MultipleSingleCharts chartData={dato1} chartConfig={chartConfig1} timeRange={timeRange}></MultipleSingleCharts>
        </div>
    )
};

export default BombasDeAguaChosicaChart;