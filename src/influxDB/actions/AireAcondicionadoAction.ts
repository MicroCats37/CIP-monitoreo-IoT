"use server";
import { AirConditioningType } from "@/types0";
import { queryApi } from "../influxConfig";
import { AirConditioningTypeSchema } from "@/validators0/schemas";
import { fetchDataAction } from "@/utils/ServerActions/validator";

export const getAireAcondicionadoDatos = async (port: string): Promise<AirConditioningType> => {
    const fluxQuery = `
    bus1 = from(bucket: "Aire Acondicionado")
        |> range(start: -30d)
        |> filter(fn: (r) => r["_measurement"] == "INDOOR-BUS-1-${port}")
        |> last()
        |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")

    bus2 = from(bucket: "Aire Acondicionado")
        |> range(start: -30d)
        |> filter(fn: (r) => r["_measurement"] == "INDOOR-BUS-2-${port}")
        |> last()
        |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")

    bus3 = from(bucket: "Aire Acondicionado")
        |> range(start: -30d)
        |> filter(fn: (r) => r["_measurement"] == "INDOOR-BUS-3-${port}")
        |> last()
        |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")

    // Unir los resultados de los tres buses
    union(tables: [bus1, bus2, bus3])
        |> keep(columns: ["_time", "unit_name", "alias", "id", "alarm", "status", "temperature_setting", "temperature_indoor"])
`;

    const rows: AirConditioningType = {
        data: [],
        time: ""
    };

    try {
        let hasData = false;

        for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
            const record = tableMeta.toObject(values);

            // Asignar el timestamp del primer registro encontrado como `time`
            if (!rows.time) {
                rows.time = record._time;
            }

            // Validar y agregar datos al array `data`
            rows.data.push({
                unit_name: record.unit_name , // Fallback si no se encuentra el campo
                alias: record.alias ,
                id: record.id ,
                alarm: record.alarm?.toString() , // Si no hay alarm, usar "0" como valor por defecto
                status: record.status ,
                temperature_setting: record.temperature_setting,
                temperature_indoor: record.temperature_indoor,
            });

            hasData = true;
        }

        // Verificar si se obtuvieron datos; si no, lanzar error
        if (!hasData) {
            throw new Error(`No se encontraron datos en InfluxDB para el puerto ${port}.`);
        }

        return rows;
    } catch (error) {
        console.error("Error al obtener datos de InfluxDB:", error);
        throw new Error(`Error al obtener datos del aire acondicionado: ${error}`);
    }
};

export const getAireAcondicionadoAction = async (air: string): Promise<AirConditioningType> => {
    return fetchDataAction(() => getAireAcondicionadoDatos(air === '1' ? '55' : '56'), AirConditioningTypeSchema);
};