// influxDB/querys-download/AireAcondicionadoDownload.ts
import { queryApi } from "@/influxDB/influxConfig";
import { parse } from "json2csv";

export async function getAireAcondicionadoDownloadData(startTime: string, endTime: string, port: string): Promise<string> {
    const fluxQuery = `
        bus1 = from(bucket: "Aire Acondicionado")
            |> range(start: ${startTime}, stop: ${endTime})
            |> filter(fn: (r) => r["_measurement"] == "INDOOR-BUS-1-${port}")
            |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")

        bus2 = from(bucket: "Aire Acondicionado")
            |> range(start: ${startTime}, stop: ${endTime})
            |> filter(fn: (r) => r["_measurement"] == "INDOOR-BUS-2-${port}")
            |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")

        bus3 = from(bucket: "Aire Acondicionado")
            |> range(start: ${startTime}, stop: ${endTime})
            |> filter(fn: (r) => r["_measurement"] == "INDOOR-BUS-3-${port}")
            |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")

        // Unir los resultados de los tres buses
        union(tables: [bus1, bus2, bus3])
            |> keep(columns: ["_time", "unit_name", "alias", "id", "alarm", "status", "temperature_setting", "temperature_indoor"])
            |> sort(columns: ["_time"], desc: false)
    `;

    const rows: any[] = [];
    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
        const record = tableMeta.toObject(values);

        // Agregar el registro al array de filas
        rows.push({
            time: record._time,
            unit_name: record.unit_name,
            alias: record.alias,
            id: record.id,
            alarm: record.alarm.toString(),
            status: record.status,
            temperature_setting: record.temperature_setting,
            temperature_indoor: record.temperature_indoor,
        });
    }

    // Verificar si el array está vacío
    if (rows.length === 0) {
        throw new Error("No se encontraron datos en el rango de tiempo especificado.");
    }

    // Convertir el array de objetos a CSV usando json2csv
    return parse(rows);
}