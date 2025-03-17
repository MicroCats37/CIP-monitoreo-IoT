import { queryApi } from "@/influxDB/influxConfig";
import { parse } from "json2csv";

export async function getSCIDownloadData(startTime: string, endTime: string): Promise<string> {
    const fluxQuery = `
        from(bucket: "Sistema Contra Incendios")
        |> range(start: ${startTime}, stop: ${endTime})
        |> filter(fn: (r) => r["_measurement"] == "SCI")
        |> filter(fn: (r) =>
            r["_field"] == "voltage" or
            r["_field"] == "current" or
            r["_field"] == "frequency" or
            r["_field"] == "custom_locked_rotor_current"
        )
        |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> sort(columns: ["_time"], desc: false)
    `;
    const rows: any[] = [];
    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
        const record = tableMeta.toObject(values);

        // Agregar el registro al array de filas
        rows.push({
            time: record._time,
            voltage: record.voltage,
            current: record.current,
            frequency: record.frequency,
            custom_locked_rotor_current: record.custom_locked_rotor_current,
        });
    }
    // Verificar si el array está vacío
    if (rows.length === 0) {
        throw new Error("No se encontraron datos en el rango de tiempo especificado.");
    }
    // Convertir el array de objetos a CSV usando json2csv
    return parse(rows);
}