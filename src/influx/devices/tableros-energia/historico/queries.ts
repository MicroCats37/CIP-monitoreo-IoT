// queries.ts
import { getAggregateWindowClause } from "@/utils/influxDB/query/window";


export function TablerosEnergiaHistoricalQuery(
  tablero: string,
  start: string,
  stop: string,

): string {
  const bucket = "IoT Tableros de Energia";
  const windowClause = getAggregateWindowClause(start, stop);
  return `
from(bucket: "${bucket}")
  |> range(start: ${start}, stop: ${stop})
  |> filter(fn: (r) => r["_measurement"] == "Tableros de Energia")
  |> filter(fn: (r) =>
    r["_field"] == "activa" or
    r["_field"] == "reactiva" or
    r["_field"] == "aparente"
  )
  |> filter(fn: (r) => r["name"] == "${tablero}")
  ${windowClause}
  |> yield(name: "historical")
`;
}
