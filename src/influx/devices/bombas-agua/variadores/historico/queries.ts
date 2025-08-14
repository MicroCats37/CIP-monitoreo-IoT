// queries.ts

import { getAggregateWindowClause } from "@/utils/influxDB/query/window";


export function BombasDeAguaVariadoresHistoricalQuery(
  id: string,
  start: string,
  stop: string,
): string {
  const bucket = "IoT Bombas de Agua Variadores";
  const windowClause = getAggregateWindowClause(start, stop);

  return `
from(bucket: "${bucket}")
  |> range(start: ${start}, stop: ${stop})
  |> filter(fn: (r) => r["_measurement"] == "${id}")
  |> filter(fn: (r) =>
    r["_field"] == "frecuencia" or
    r["_field"] == "intensidad" or
    r["_field"] == "potencia" or
    r["_field"] == "tension_salida" or
    r["_field"] == "temperatura_unidad" or
    r["_field"] == "tiempo_marcha" or
    r["_field"] == "velocidad_y_direccion"
  )
  |> filter(fn: (r) =>
    r["name"] == "Bomba Q1" or r["name"] == "Bomba Q2" or r["name"] == "Bomba Q3"
  )
  ${windowClause}
  |> yield(name: "historical")
`;
}
