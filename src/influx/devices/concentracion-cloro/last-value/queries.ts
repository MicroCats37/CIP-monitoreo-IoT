export function ConcentracionCloroLastValueQuery(
  start: string
): string {
  const bucket = "IoT Concentracion de Cloro";
  return `
from(bucket: "${bucket}")
  |> range(start: ${start}, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "Concentracion de Cloro")
  |> filter(fn: (r) => r["_field"] == "cloro")
  |> filter(fn: (r) => r["name"] == "Piscina 1" or r["name"] == "Piscina 2")
  |> last()
  |> yield(name: "last")
`;
}