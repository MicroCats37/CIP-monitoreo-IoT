import { ChartConfig } from "@/components/ui/chart";
import { PlotDataType } from "@/types";

import { Activity, Battery, Clock, Gauge, Thermometer, Wind, Zap } from "lucide-react";

export function VariatorMultipleChartFormatted<T extends PlotDataType>(dataSeries?: T[][]) {
    if (!dataSeries || dataSeries.length === 0) {
        return { chartDataM: [], chartConfigM: {}, YAxisFormatterM: (v: number) => v.toString() };
    }

    // Array para almacenar los datos de cada bomba
    const chartDataM: { time: string; [key: string]: any }[][] = [];

    // Procesar cada serie de datos (cada bomba)
    dataSeries.forEach((entitySeries) => {
        const bombaData: { time: string; [key: string]: any }[] = [];

        // Procesar cada entrada de la serie
        entitySeries.forEach((entry) => {
            const time = entry.time; // Formatear el tiempo

            // Crear un objeto para el tiempo actual
            const timeData: { time: string; [key: string]: any } = { time };

            // Agregar los datos de la entrada al objeto
            Object.entries(entry.data).forEach(([key, value]) => {
                if (key !== "bomba") { // Excluir la propiedad "bomba"
                    timeData[key] = value;
                }
            });

            // Agregar los datos al array de la bomba actual
            bombaData.push(timeData);
        });

        // Agregar los datos de la bomba al array principal
        chartDataM.push(bombaData);
    });

    // Configuración del gráfico
    const chartProperties: Record<string, { label: string; color: string; icon: any; unit: string }> = {
        velocidad_y_direccion: { label: "Velocidad y Dirección", color: "#3498db", icon: Wind, unit: "rpm" },
        frecuencia: { label: "Frecuencia", color: "#eab308", icon: Activity, unit: "Hz" },
        intensidad: { label: "Intensidad", color: "#8e44ad", icon: Zap, unit: "A" },
        potencia: { label: "Potencia", color: "#e67e22", icon: Gauge, unit: "kW" },
        tension_salida: { label: "Tensión de Salida", color: "#20b2aa", icon: Battery, unit: "V" },
        temperatura_unidad: { label: "Temperatura de Unidad", color: "#e74c3c", icon: Thermometer, unit: "°C" },
        tiempo_marcha: { label: "Tiempo de Marcha", color: "#6b7280", icon: Clock, unit: "h" },
    };

    const chartConfigM: ChartConfig = Object.fromEntries(
        Object.entries(chartProperties).map(([key, value]) => [key, value])
    ) satisfies ChartConfig;



    return { chartDataM, chartConfigM };
}