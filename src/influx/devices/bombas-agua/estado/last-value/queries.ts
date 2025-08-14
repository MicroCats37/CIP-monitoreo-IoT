export function BombasDeAguaEstadoLastValueQuery(
  id: string,
  start: string
): string {
  const bucket = "IoT Bombas de Agua Estado";
  return `
from(bucket: "${bucket}")
  |> range(start: ${start}, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "${id}")
  |> filter(fn: (r) => r["_field"] == "estado")
  |> last()
  |> yield(name: "last")
`;
}
