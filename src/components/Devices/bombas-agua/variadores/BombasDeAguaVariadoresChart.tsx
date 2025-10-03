
import { BombasDeAguaVariadoresHistoricalType, BombasDeAguaVariadoresType } from "@/validators/devices/schemas";
import { formatChartConfigStackedDetailsArrayArray } from "@/utils/Devices/PlotFormat/general";
import { MultipleSelectorInteractiveCharts } from "@/components/Chart/Monitoreo/MultipleSelectorInteractiveCharts";
import { SelectorInteractiveStackedCharts } from "@/components/Chart/Monitoreo/SelectorInteractiveStackedCharts";
import { addIconsToChartConfig, IconMapping } from "@/utils/Devices/PlotFormat/addIconConfig";
import { Activity, CircleDot, Clock, Gauge, Navigation2, Thermometer, Waves, Zap } from "lucide-react";

interface Props {
  timeRange: number
  dataHistorical: BombasDeAguaVariadoresHistoricalType;
}

const BombasDeAguaVariadoresChart: React.FC<Props> = ({ timeRange, dataHistorical }) => {
  const { data: dato1, chartConfig: chartConfig1 } = formatChartConfigStackedDetailsArrayArray(dataHistorical.device.name,dataHistorical)
  const myIconMap: IconMapping = {
    velocidad_y_direccion: Navigation2,
    frecuencia: Waves,
    intensidad: Activity,
    potencia: Zap,
    tension_salida: Gauge,
    temperatura_unidad: Thermometer,
    tiempo_marcha: Clock,
  }
  const chartConfigWithIcons = addIconsToChartConfig(chartConfig1, myIconMap, CircleDot)
  //const { data: dato2, chartConfig: chartConfig2 } = formatChartConfigSimpleDetailsArrayArray(dataHistorical)
  return (
    <div className="flex-col w-full space-y-4">
      <SelectorInteractiveStackedCharts id={dataHistorical.device.name} title={dataHistorical.device.name} chartData={dato1} chartConfig={chartConfigWithIcons} timeRange={timeRange}></SelectorInteractiveStackedCharts>
      <MultipleSelectorInteractiveCharts chartSimpleData={dato1} chartConfig={chartConfigWithIcons} timeRange={timeRange}></MultipleSelectorInteractiveCharts>
    </div>

  )
};

export default BombasDeAguaVariadoresChart;