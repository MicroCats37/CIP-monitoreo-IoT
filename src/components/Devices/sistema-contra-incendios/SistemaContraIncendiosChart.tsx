

import { SistemaContraIncendiosHistoricalType } from "@/validators/devices/schemas";
import { MultipleSingleCharts } from "@/components/Chart/Monitoreo/MultipleSingleCharts";
import { formatChartConfigStackedDetailsArray } from "@/utils/Devices/PlotFormat/general";

interface Props {

  timeRange:number,
  dataHistorical: SistemaContraIncendiosHistoricalType // Adjust type as necessary
}
const SistemaContraIncendiosChart: React.FC<Props> = ({timeRange, dataHistorical }) => {
  const { data: dato1, chartConfig: chartConfig1 } = formatChartConfigStackedDetailsArray(dataHistorical.device.name,dataHistorical)
  return (
    <div className="flex-col w-full gap-4">
      <MultipleSingleCharts id={dataHistorical.device.name} chartData={dato1} chartConfig={chartConfig1} timeRange={timeRange}></MultipleSingleCharts>
    </div>
  )
};

export default SistemaContraIncendiosChart;