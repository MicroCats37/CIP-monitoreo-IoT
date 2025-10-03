
import { BombasDeAguaEstadoHistoricalType} from "@/validators/devices/schemas";
import { MultipleSingleCharts } from "@/components/Chart/Monitoreo/MultipleSingleCharts";
import formatStackedDataArray, { formatChartConfigStackedDetailsArrayArray } from "@/utils/Devices/PlotFormat/general";
import { SingleChart } from "@/components/Chart/Monitoreo/SingleChart";




interface Props {
  timeRange:number,
  dataHistorical: BombasDeAguaEstadoHistoricalType;
}

const BombasDeAguaEstadoChart: React.FC<Props> = ({ timeRange,dataHistorical }) => {

  const { data: dato1, chartConfig: chartConfig1 } = formatChartConfigStackedDetailsArrayArray(dataHistorical.device.name,dataHistorical)
  const { flatData, chartConfig: chartConfig2 } = formatStackedDataArray(dataHistorical.device.name,dato1)
  const YAxisFormatter= (value: number) => {
    return value === 0 ? "Off" : value === 1 ? "On" : "";
  };
  return (

    <div className="flex-col w-full gap-4 space-y-4">
      <SingleChart
        id={dataHistorical.device.name}
        YAxisFormatter={YAxisFormatter}
        name={dataHistorical.device.name}
        key={`${dataHistorical.device.name}-chart`}
        chartData={flatData}
        chartConfig={chartConfig2}
        timeRange={timeRange}
      />
      <MultipleSingleCharts id={dataHistorical.device.name} YAxisFormatter={YAxisFormatter} chartData={dato1} chartConfig={chartConfig1} timeRange={timeRange}></MultipleSingleCharts>
    </div>
  )
};

export default BombasDeAguaEstadoChart;