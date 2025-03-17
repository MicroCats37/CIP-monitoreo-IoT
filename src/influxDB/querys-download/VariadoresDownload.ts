import { queryApi } from "../influxConfig";
import { formatString } from "@/utils/formatStringPump";
import { parse } from "json2csv";
export const getVariadoresDownloadData = async (startTime: string, endTime: string, variador: string): Promise<string> => {
    const fluxQuery = `
        from(bucket: "Variadores")
        |> range(start: ${startTime}, stop: ${endTime})
        |> filter(fn: (r) => r["_measurement"] == "${formatString(variador)}")
        |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> sort(columns: ["_time"], desc: false)
    `;

    const rows: any[] = [];
    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
        const record = tableMeta.toObject(values);

        // Agregar el registro al array de filas
        rows.push({
            time: record._time,
            bomba: record.bomba,
            velocidad_y_direccion: record.velocidad_y_direccion,
            frecuencia: record.frecuencia,
            intensidad: record.intensidad,
            potencia: record.potencia,
            tension_salida: record.tension_salida,
            temperatura_unidad: record.temperatura_unidad,
            tiempo_marcha: record.tiempo_marcha,
        });
    }
    // Verificar si el array está vacío
    if (rows.length === 0) {
        throw new Error("No se encontraron datos en el rango de tiempo especificado.");
    }
    // Unir todas las filas en un solo string CSV
    return parse(rows);
};