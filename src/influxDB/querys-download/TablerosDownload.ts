import { queryApi } from "@/influxDB/influxConfig";
import { parse } from "json2csv";

export async function getTablerosDownloadData(startTime: string, endTime: string): Promise<string> {
  const fluxQuery = `
    from(bucket: "Tableros de Energia")
    |> range(start: ${startTime}, stop: ${endTime})  
    |> filter(fn: (r) => r["_measurement"] == "Potencias")
    |> filter(fn: (r) => r["_field"] == "value")
    |> group(columns: ["potencia"])  
    |> sort(columns: ["_time"], desc: false)
  `;

  const rows: any[] = [];
  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    rows.push(tableMeta.toObject(values));
  }
  // Verificar si el array está vacío
  if (rows.length === 0) {
    throw new Error("No se encontraron datos en el rango de tiempo especificado.");
}
  return parse(rows); // Devuelve los datos en formato CSV
}