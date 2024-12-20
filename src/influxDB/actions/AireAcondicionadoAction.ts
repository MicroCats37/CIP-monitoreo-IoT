"use server";
import { AirConditioningType } from "@/types";
import { queryApi } from "../influxConfig";
import { AirConditioningTypeSchema } from "@/validators/schemas";
import { fetchDataAction } from "@/utils/ServerActions.ts/validator";

export const getAireAcondicionadoDatosAction = async (port: string): Promise<AirConditioningType> => {
    const fluxQuery = `
    from(bucket: "Aire Acondicionado")
    |> range(start: -30m)
    |> filter(fn: (r) => 
        r["_measurement"] == "INDOOR-BUS-1-${port}" or 
        r["_measurement"] == "INDOOR-BUS-2-${port}" or 
        r["_measurement"] == "INDOOR-BUS-3-${port}"
    )
    |> filter(fn: (r) => r["_field"] == "alarm" or r["_field"] == "status" or r["_field"] == "temperature_setting" or r["_field"] == "temperature_indoor")
    |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> group(columns: ["_measurement", "unit_name", "alias", "id"])
    |> unique(column: "_time")
    |> keep(columns: ["_time", "unit_name", "alias", "id", "alarm", "status","temperature_setting","temperature_indoor"])
    |> sort(columns: ["_time"], desc: true)
    |> limit(n: 1)
`;


    const rows: AirConditioningType = {
        data: [],
        time: ""
    };

    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
        const record = tableMeta.toObject(values);
        // Asignar el timestamp del primer registro encontrado como `time`
        if (!rows.time) {
            rows.time = record._time;
        }

        // Validar y agregar datos al array `data`
        rows.data.push({
            unit_name: record.unit_name, // Fallback si no se encuentra el campo
            alias: record.alias,
            id: record.id,
            alarm: record.alarm.toString(), // Si no hay alarm, usar 0 como valor por defecto
            status: record.status,
            temperature_setting:  record.temperature_setting,
            temperature_indoor:  record.temperature_indoor ,
        });
    }

    // Verificar si se obtuvieron datos; si no, lanzar error
    if (rows.data.length === 0) {
        throw new Error(`No se encontraron datos en InfluxDB para el puerto ${port}.`);
    }

    return rows;
};

//mejorar el mensaje de error para este query ya qeu no te devuelve el array inicail cuando no hay nada solo te da un un erro al ingresar a la base ed datos

export const getAireAcondicionadoAction = async (air: string): Promise<AirConditioningType> => {
  return fetchDataAction(() => getAireAcondicionadoAction(air), AirConditioningTypeSchema);
};