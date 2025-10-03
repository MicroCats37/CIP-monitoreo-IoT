import { MultipleSingleCharts } from "@/components/Chart/Monitoreo/MultipleSingleCharts";
import { formatChartConfigStackedDetailsArray } from "@/utils/Devices/PlotFormat/general";
import { TablerosDeEnergiaHistoricalType } from "@/validators/devices/schemas";



interface Props {
  timeRange:number
  dataHistorical: TablerosDeEnergiaHistoricalType;
}

const TablerosDeEnergiaChart: React.FC<Props> = ({ dataHistorical,timeRange }) => {

  const {data:dato1,chartConfig:chartConfig1}=formatChartConfigStackedDetailsArray(dataHistorical.device.name,dataHistorical)


  return (
    <div className="flex-col w-full gap-4 space-y-4">
      <div><MultipleSingleCharts id={dataHistorical.device.name} chartData={dato1} chartConfig={chartConfig1} timeRange={timeRange}></MultipleSingleCharts></div>
    </div>
    
  )
};

export default TablerosDeEnergiaChart;