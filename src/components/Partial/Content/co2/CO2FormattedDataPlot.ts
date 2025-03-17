import { ChartConfig } from "@/components/ui/chart";
import { CO2Type } from "@/types";

export function CO2ChartFormatted(dataSeries?: CO2Type[][]) {
  if (!dataSeries || dataSeries.length === 0) {
    return { chartDataM: [], chartConfigM: {}, YAxisFormatterM: (v: number) => v.toString() };
  }

  const allTimes = new Set<string>();
  const timeSeriesData: { [time: string]: { [key: string]: any } } = {};

  // Solo hay dos claves relevantes: "lugar" y "co2"
  const entityKeys = ["co2"];

  // Procesar cada serie de datos
  dataSeries.forEach((entitySeries) => {
    entitySeries.forEach((entry) => {
      allTimes.add(entry.time);

      if (!timeSeriesData[entry.time]) {
        timeSeriesData[entry.time] = {};
      }

      // Asignar valores al campo CO₂
      timeSeriesData[entry.time]["co2"] = entry.data.co2;
    });
  });

  // Construcción de `chartDataM`
  const chartDataM: { time: string; [key: string]: any }[][] = [];

  entityKeys.forEach((key) => {
    const keyData = Array.from(allTimes)
      .sort()
      .map((time) => ({
        time: time,
        [key]: timeSeriesData[time][key] ?? 0,
      }));

    chartDataM.push(keyData);
  });

  // Mapeo de etiquetas y unidades para CO₂
  const labelMap: Record<string, string> = {
    co2: "Concentración de CO₂",
  };

  const unitMap: Record<string, string> = {
    co2: "PPM",
  };

  const chartConfigM: ChartConfig = Object.fromEntries(
    entityKeys.map((name, index) => [
      name,
      {
        label: labelMap[name] || "",
        color: `hsl(var(--chart-${index + 1}))`,
        unit: unitMap[name] || "",
      },
    ])
  ) satisfies ChartConfig;

  return { chartDataM, chartConfigM };
}
