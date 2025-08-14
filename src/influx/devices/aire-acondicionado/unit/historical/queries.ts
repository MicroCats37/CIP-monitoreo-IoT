import { getAggregateWindowClause } from "@/utils/influxDB/query/window";


export function AireAcondicionadoUnitHistoricalQuery(
  id: string,
  unitId: string,
  start: string,
  stop: string,

): string {
  const bucket = "IoT Aire Acondicionado";
  const windowClause = getAggregateWindowClause(start, stop);
  return `
from(bucket: "${bucket}")
  |> range(start: ${start}, stop: ${stop})
  |> filter(fn: (r) => r["_measurement"] == "${id}")
  |> filter(fn: (r) => r["id"] == "${unitId}")
  ${windowClause}
  |> yield(name: "historical")
`;
}