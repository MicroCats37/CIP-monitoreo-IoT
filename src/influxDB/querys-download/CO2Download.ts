// influxDB/querys-download/CO2Download.ts
import { queryApi } from "@/influxDB/influxConfig";
import { parse } from "json2csv";

export async function getCO2DownloadData(startTime: string, endTime: string): Promise<string> {
    const fluxQuery = `
        from(bucket: "Sensor CO2")
        |> range(start: ${startTime}, stop: ${endTime})
        |> filter(fn: (r) => r["_measurement"] == "Sensor CO2")
        |> filter(fn: (r) => r["_field"] == "value")
        |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> sort(columns: ["_time"], desc: false)
    `;

    const rows: any[] = [];
    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
        const record = tableMeta.toObject(values);
        // Agregar el registro al array de filas
        rows.push({
            time: record._time,
            lugar: "Sotanos", // Valor fijo para "lugar"
            co2: record.value, // Convertir a número
        });
    }

    // Verificar si el array está vacío
    if (rows.length === 0) {
        throw new Error("No se encontraron datos en el rango de tiempo especificado.");
    }

    // Convertir el array de objetos a CSV usando json2csv
    return parse(rows);
}