
import { getAggregateWindowClause } from "@/utils/influxDB/query/window";


export function BombasDeAguaEstadoHistoricalQuery(
  id: string,
  start: string,
  stop: string,
): string {
  const bucket = "IoT Bombas de Agua Estado";
 const windowClause = getAggregateWindowClause(start, stop,'last');

  return `
from(bucket: "${bucket}")
  |> range(start: ${start}, stop: ${stop})
  |> filter(fn: (r) => r["_measurement"] == "${id}")
  |> filter(fn: (r) => r["_field"] == "estado")
  ${windowClause}
  |> yield(name: "historical")
`;
}
