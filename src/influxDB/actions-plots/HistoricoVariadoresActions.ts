"use server";

import { VariatorsType } from "@/types0";
import { queryApi } from "../influxConfig";
import { formatString } from "@/utils/formatStringPump";
import { ArrayHistoricalVariatorsTypeSchema } from "@/validators0/schemas";
import { fetchDataAction } from "@/utils/ServerActions/validator";
import { getWindowPeriod } from "@/utils/contextWindow";
import { QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate";

export const getVariadoresHistorico = async (variador: string,time:string): Promise<VariatorsType[][]> => {
    
    const windowPeriod = time !== "30m" ? `|> aggregateWindow(every: ${getWindowPeriod(time as QueryTimeType)}, fn: mean, createEmpty: false)` : "";
    const fluxQuery = `
        from(bucket: "Variadores")
        |> range(start: -${time})  // Historial de la última hora
        |> filter(fn: (r) => r["_measurement"] == "${formatString(variador)}")
        ${windowPeriod}
        |> sort(columns: ["_time"], desc: false) // Orden cronológico ascendente
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    `;

    // Crear un mapa para agrupar por nombre de variador
    const variadorMap: Record<string, VariatorsType[]> = {};

    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
        const record = tableMeta.toObject(values);
        const variadorName = record.bomba; // Campo `bomba` puede ser el identificador del variador
        // Crear un array para cada variador si no existe
        if (!variadorMap[variadorName]) {
            variadorMap[variadorName] = [];
        }

        // Agregar el registro al array correspondiente
        variadorMap[variadorName].push({
            data: {
                bomba: variadorName,
                velocidad_y_direccion: record.velocidad_y_direccion,
                frecuencia: record.frecuencia,
                intensidad: record.intensidad,
                potencia: record.potencia,
                tension_salida: record.tension_salida,
                temperatura_unidad: record.temperatura_unidad,
                tiempo_marcha: record.tiempo_marcha,
            },
            time: record._time, // Marca de tiempo
        });
    }
    
    // Convertir el mapa en un array de arrays
    return Object.values(variadorMap);
};

export const getVariadoresHistoricoAction = async (variador: string,time:string): Promise<VariatorsType[][]> => {
    return fetchDataAction(() => getVariadoresHistorico(variador,time), ArrayHistoricalVariatorsTypeSchema);
};