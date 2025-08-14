

import { ConcentracionCo2HistoricalType} from "@/validators/devices/schemas";

import { MultipleSingleCharts } from "@/components/Chart/Monitoreo/MultipleSingleCharts";
import { formatChartConfigStackedDetailsArrayArray } from "@/utils/Devices/PlotFormat/general";







interface Props {
  timeRange: number,
  dataHistorical: ConcentracionCo2HistoricalType; // Adjust type as necessary
}

const ConcentracionCo2Chart: React.FC<Props> = ({ timeRange, dataHistorical }) => {
  const { data: dato1, chartConfig: chartConfig1 } = formatChartConfigStackedDetailsArrayArray(dataHistorical)
  return (
    <div className="flex-col w-full gap-4">
      <MultipleSingleCharts chartData={dato1} chartConfig={chartConfig1} timeRange={timeRange}></MultipleSingleCharts>
    </div>

  )
};

export default ConcentracionCo2Chart;