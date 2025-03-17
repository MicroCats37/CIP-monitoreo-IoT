// influxDB/querys-download/PiscinasDownload.ts
import { queryApi } from "@/influxDB/influxConfig";
import { parse } from "json2csv";

export async function getPiscinasDownloadData(startTime: string, endTime: string): Promise<string> {
    const fluxQuery = `
        from(bucket: "Concentracion de Cloro")
        |> range(start: ${startTime}, stop: ${endTime})
        |> filter(fn: (r) => r["_measurement"] == "Piscina 1" or r["_measurement"] == "Piscina 2")
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
            piscina: record._measurement, // Nombre de la piscina
            cloro: record.value, // Valor del cloro
        });
    }
    // Verificar si el array está vacío
    if (rows.length === 0) {
        throw new Error("No se encontraron datos en el rango de tiempo especificado.");
    }

    // Convertir el array de objetos a CSV usando json2csv
    return parse(rows);
}