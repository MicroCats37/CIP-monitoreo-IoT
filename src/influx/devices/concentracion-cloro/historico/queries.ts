import { getAggregateWindowClause } from "@/utils/influxDB/query/window";


export function concentracionCloroHistoricalQuery(
  start: string,
  stop: string,
): string {
  const bucket = "IoT Concentracion de Cloro";
  const windowClause = getAggregateWindowClause(start, stop);

  return `
from(bucket: "${bucket}")
  |> range(start: ${start}, stop: ${stop})
  |> filter(fn: (r) => r["_measurement"] == "Concentracion de Cloro")
  |> filter(fn: (r) => r["_field"] == "cloro")
  |> filter(fn: (r) => r["name"] == "Piscina 1" or r["name"] == "Piscina 2")
  ${windowClause}
  |> yield(name: "mean")
`;
}
