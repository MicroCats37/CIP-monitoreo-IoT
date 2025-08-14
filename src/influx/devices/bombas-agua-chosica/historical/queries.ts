import { getAggregateWindowClause } from "@/utils/influxDB/query/window";

export function BombasDeAguaChosicaHistoricalQuery(
  start: string,
  stop: string,
): string {
  const bucket = "IoT Bombas de Agua Chosica";
 const windowClause = getAggregateWindowClause(start, stop,'last');

  return `
from(bucket: "${bucket}")
  |> range(start: ${start}, stop: ${stop})
  |> filter(fn: (r) => r["_measurement"] == "Automatizacion de Bombas de Agua Chosica")
  ${windowClause}
  |> yield(name: "historical")
`;
}
