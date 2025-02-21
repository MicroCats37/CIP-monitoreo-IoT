import { ChartConfig } from "@/components/ui/chart";
import { DataPlotStaked, PoolType } from "@/types";

export function PoolDataPlotFormatted(dataSeries?: PoolType[][]) {
  if (!dataSeries || dataSeries.length === 0) {
    return { chartData: [], chartConfig: {} };
  }

  const allTimes = new Set<string>();
  const timeSeriesData: { [time: string]: { [entity: string]: number } } = {};

  dataSeries.forEach((entitySeries) => {
    const entityKey = Object.keys(entitySeries[0].data).find((key) => key === "piscina");
    if (!entityKey) return;

    entitySeries.forEach((entry) => {
      allTimes.add(entry.time);
      if (!timeSeriesData[entry.time]) {
        timeSeriesData[entry.time] = {};
      }
      timeSeriesData[entry.time][entry.data.piscina] = entry.data.cloro; // Concentración de cloro
    });
  });

  const chartData = Array.from(allTimes)
    .sort()
    .map((time) => ({
      time: time,
      ...timeSeriesData[time],
    }));

  const entityNames = dataSeries.map((entitySeries) => entitySeries[0].data.piscina);

  const chartConfig: ChartConfig = Object.fromEntries(
    entityNames.map((name, index) => [
      name,
      {
        label: `Piscina ${name}`,
        color: `hsl(var(--chart-${index + 1}))`,
      },
    ])
  ) satisfies ChartConfig;

  const YAxisFormatter = (value: number) => `${value} ppm`; // Formateo del eje Y

  return { chartData, chartConfig, YAxisFormatter };
}

export function PoolMultipleChartFormatted(dataSeries?: PoolType[][]) {
  if (!dataSeries || dataSeries.length === 0) {
    return { chartDataM: [], chartConfigM: {} };
  }

  // Estructura para almacenar los datos de cada piscina de forma independiente
  const poolDataMap: { [poolName: string]: DataPlotStaked[] } = {};

  // Recorrer cada serie de datos (cada piscina)
  dataSeries.forEach((poolSeries) => {
    const poolName = poolSeries[0].data.piscina;

    // Si no existe en el mapa, inicializar el array
    if (!poolDataMap[poolName]) {
      poolDataMap[poolName] = [];
    }

    // Agregar los datos sin modificar el tiempo ni insertar valores innecesarios
    poolSeries.forEach((entry) => {
      poolDataMap[poolName].push({
        time: entry.time,
        [poolName]: entry.data.cloro, // Asociar el valor de cloro con la piscina
      });
    });

    // Ordenar los datos en orden cronológico por tiempo
    poolDataMap[poolName].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  });

  // Convertir el objeto en array de arrays, cada uno con los datos de una piscina
  const chartDataM: DataPlotStaked[][] = Object.values(poolDataMap);

  // Configuración de colores y etiquetas para cada piscina
  const entityNames = Object.keys(poolDataMap);
  const chartConfigM: ChartConfig = Object.fromEntries(
    entityNames.map((name, index) => [
      name,
      {
        label: `${name}`,
        color: `hsl(var(--chart-${index+1}))`,
        unit:'ppm'
      },
    ])
  ) satisfies ChartConfig;

  // Formato del eje Y
  const YAxisFormatterM = (value: number) => `${value} ppm`;

  return { chartDataM, chartConfigM, YAxisFormatterM };
}
