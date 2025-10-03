import { getAggregateWindowClause } from "@/utils/influxDB/query/window";

export function AireAcondicionadoUnitHistoricalQuery(
  id: string,
  unitId: string,
  start: string,
  stop: string,
): string {
  const bucket = "IoT Aire Acondicionado";

  // Para numéricos (temperatura, setpoint)
  const windowNumeric = getAggregateWindowClause(start, stop, "mean");

  // Para estados/alarma
  const windowStates = getAggregateWindowClause(start, stop, "last");

  return `

  from(bucket: "${bucket}")
    |> range(start: ${start}, stop: ${stop})
    |> filter(fn: (r) => r["_measurement"] == "${id}")
    |> filter(fn: (r) => r["id"] == "${unitId}")
    |> filter(fn: (r) => r["_field"] == "temperature_indoor" or r["_field"] == "temperature_setting")
    ${windowNumeric}
    |> yield(name: "historical_numeric")


  from(bucket: "${bucket}")
    |> range(start: ${start}, stop: ${stop})
    |> filter(fn: (r) => r["_measurement"] == "${id}")
    |> filter(fn: (r) => r["id"] == "${unitId}")
    |> filter(fn: (r) => r["_field"] == "status" or r["_field"] == "alarm")
    ${windowStates}
    |> yield(name: "historical_states")
  `;
}
