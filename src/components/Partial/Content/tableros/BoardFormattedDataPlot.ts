import { ChartConfig } from "@/components/ui/chart";
import { BoardType, DataPlotStaked} from "@/types";
import { Capitalize } from "@/utils/capitalizeLetter";
import { formatTime } from "@/utils/formatTime";

export function BoardDataPlotFormatted(dataSeries?: BoardType[][]) {
  if (!dataSeries || dataSeries.length === 0) {
    return { chartData: [], chartConfig: {} };
  }
  const allTimes = new Set<string>();
  const timeSeriesData: { [time: string]: { [entity: string]: number } } = {};

  dataSeries.forEach((entitySeries) => {
    const entityKey = Object.keys(entitySeries[0].data).find((key) => key === "potencia");
    if (!entityKey) return;

    entitySeries.forEach((entry) => {
      allTimes.add(entry.time);
      if (!timeSeriesData[entry.time]) {
        timeSeriesData[entry.time] = {};
      }
      timeSeriesData[entry.time][entry.data.potencia] = entry.data.value;
    });
  });

  const chartData = Array.from(allTimes)
    .sort()
    .map((time) => ({
      time:formatTime(time),
      ...timeSeriesData[time],
    }));

  const entityNames = dataSeries.map((entitySeries) => Object.values(entitySeries[0].data)[0]);

  const chartConfig:ChartConfig = Object.fromEntries(
    entityNames.map((name, index) => [
      name,
      {
        label: `Potencia ${name}`,
        color: `hsl(var(--chart-${index + 1}))`,
        unit: `${name === 'activa' ? 'KW' : (name === 'reactiva' ? 'KVAR' : 'KVA')}`
      },
    ]),
  ) satisfies ChartConfig;

  const YAxisFormatter= (value: number) => {
    return value === 0 ? "Off" : value === 1 ? "On" : "";
  };

  return { chartData, chartConfig};
}


export function BoardMultipleChartFormatted(dataSeries?: BoardType[][]) {
  if (!dataSeries || dataSeries.length === 0) {
    return { chartData: [], chartConfig: {} };
  }

  const allTimes = new Set<string>();
  const timeSeriesData: { [time: string]: { [pumpId: string]: any } } = {};

  // Procesar cada serie de datos
  dataSeries.forEach((entitySeries) => {
    const entityKey = Object.keys(entitySeries[0].data).find((key) => key === "potencia");
    if (!entityKey) return;

    // Procesar las entradas de cada bomba
    entitySeries.forEach((entry) => {
      allTimes.add(entry.time); // Añadir el tiempo único
      if (!timeSeriesData[entry.time]) {
        timeSeriesData[entry.time] = {}; // Crear un nuevo tiempo si no existe
      }

      // Asociar el estado de cada bomba con el tiempo
      timeSeriesData[entry.time][entry.data.potencia] = entry.data.value
    });
  });

  // Crear el array de arrays, donde cada array contiene datos para una bomba específica
  const chartDataM: DataPlotStaked[][] = [];
  const pumpIds = Object.keys(timeSeriesData[Array.from(allTimes)[0]]); // Obtener las bombas (q1, q2, q3, etc.)

  pumpIds.forEach((pumpId) => {
    const pumpData = Array.from(allTimes)
      .sort() // Asegurarse de que los tiempos estén ordenados
      .map((time) => ({
        time: formatTime(time), // Formatear la fecha
        [pumpId]: timeSeriesData[time][pumpId] || 0, // Obtener el valor de la bomba para ese tiempo
      }));

    chartDataM.push(pumpData); // Añadir los datos de la bomba al array
  });

  // Configuración para las bombas y sus colores
  const entityNames = dataSeries.map((entitySeries) => Object.values(entitySeries[0].data)[0]);

  const chartConfigM:ChartConfig = Object.fromEntries(
    entityNames.map((name, index) => [
      name,
      {
        label: `Potencia ${Capitalize(name.toString())}`,
        color: `hsl(var(--chart-${index + 1}))`,
        unit: `${name === 'activa' ? 'KW' : (name === 'reactiva' ? 'KVAR' : 'KVA')}`
      },
    ]),
  ) satisfies ChartConfig;
  
  const YAxisFormatterM = (value: number,index:string) => {
    return  value === 0 ? "Off" : value === 1 ? "On" : "";
  };

  return { chartDataM, chartConfigM,YAxisFormatterM };
}
