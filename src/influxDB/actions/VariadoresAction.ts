"use server";

import { VariatorsType } from "@/types";
import { queryApi } from "../influxConfig";
import { formatString } from "@/utils/formatStringPump";
import { ArrayVariatorsTypeSchema } from "@/validators/schemas";
import { fetchDataAction } from "@/utils/ServerActions/validator";


export const getVariadoresDatos = async (variador: string): Promise<VariatorsType[]> => {
    const fluxQuery = `
        from(bucket: "Variadores")
        |> range(start: -7d)  
        |> filter(fn: (r) => r["_measurement"] == "${formatString(variador)}")
        |> last() 
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> yield(name: "last")
    `;

    const rows: VariatorsType[] = [];

    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
        const record = tableMeta.toObject(values);

        // Validamos y extraemos cada campo desde los metadatos correctamente
        const bombaName = record.bomba;
        if (!bombaName) continue; // Saltamos filas sin nombre de bomba

        const variadorData: VariatorsType = {
            data: {
                bomba: bombaName,
                velocidad_y_direccion: record.velocidad_y_direccion,
                frecuencia: record.frecuencia,
                intensidad: record.intensidad,
                potencia: record.potencia,
                tension_salida: record.tension_salida,
                temperatura_unidad: record.temperatura_unidad,
                tiempo_marcha: record.tiempo_marcha,
            },
            time: record._time,
        };

        rows.push(variadorData);
    }
    return rows;
};

export const getVariadoresAction = async (variador: string): Promise<VariatorsType[]> => {
  return fetchDataAction(() => getVariadoresDatos(variador), ArrayVariatorsTypeSchema);
};
