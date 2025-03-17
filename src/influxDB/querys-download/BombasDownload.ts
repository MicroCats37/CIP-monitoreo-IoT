// influxDB/querys-download/BombasDownload.ts
import { queryApi } from "@/influxDB/influxConfig";
import { parse } from "json2csv";
import { formatString } from "@/utils/formatStringPump";

export async function getBombasDownloadData(startTime: string, endTime: string, bomba: string): Promise<string> {
    const fluxQuery = `
        from(bucket: "Bombas de Agua")
        |> range(start: ${startTime}, stop: ${endTime})
        |> filter(fn: (r) => r["_measurement"] == "${formatString(bomba)}")
        |> filter(fn: (r) => r["_field"] == "estado")
        |> sort(columns: ["_time"], desc: false)
    `;

    const rows: any[] = [];
    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
        const record = tableMeta.toObject(values);
        // Agregar el registro al array de filas
        rows.push({
            time: record._time, // Marca de tiempo
            bomba: record.bomba, // Nombre de la bomba
            estado: Boolean(record._value), // Estado de la bomba (convertido a booleano)
        });
    }
    // Verificar si el array está vacío
    if (rows.length === 0) {
        throw new Error("No se encontraron datos en el rango de tiempo especificado.");
    }

    // Convertir el array de objetos a CSV usando json2csv
    return parse(rows);
}