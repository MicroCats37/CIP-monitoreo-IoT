import { ChartConfig } from "@/components/ui/chart";
import { PlotDataType } from "@/types";

export function CSIMultipleChartFormatted<T extends PlotDataType>(dataSeries?: T[][]) {
    if (!dataSeries || dataSeries.length === 0) {
      return { chartDataM: [], chartConfigM: {}, YAxisFormatterM: (v: number) => v.toString() };
    }
  
    const allTimes = new Set<string>();
    const timeSeriesData: { [time: string]: { [key: string]: any } } = {};
  
    // Obtener todas las claves dinámicas (excluyendo "time")
    const entityKeys = Object.keys(dataSeries[0][0].data); 
  
    // Procesar cada serie de datos
    dataSeries.forEach((entitySeries) => {
      entitySeries.forEach((entry) => {
        allTimes.add(entry.time);
  
        if (!timeSeriesData[entry.time]) {
          timeSeriesData[entry.time] = {};
        }
  
        // Asignar valores de cada campo dinámico
        entityKeys.forEach((key) => {
          timeSeriesData[entry.time][key] = entry.data[key];
        });
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
  
    const labelMap: Record<string, string> = {
      voltage: "Voltaje",
      current: "Corriente",
      frequency: "Frecuencia",
      custom_locked_rotor_current: "Corriente de Rotor",
    };
    
    const unitMap: Record<string, string> = {
      voltage: "V",
      current: "A",
      frequency: "Hz",
      custom_locked_rotor_current: "A",
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
  