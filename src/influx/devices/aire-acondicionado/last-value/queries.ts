export function AireAcondicionadoLastValueQuery(
  id: string,
  start: string
): string {
  const bucket = "IoT Aire Acondicionado";
  return `
from(bucket: "${bucket}")
  |> range(start: ${start}, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "${id}")
  |> filter(fn: (r) => r["centralita"] == "Centralita")
  |> last()
  |> yield(name: "last")
`;
}
