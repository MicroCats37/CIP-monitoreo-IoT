export function EstacionamientosLastValueQuery(
  estacionamiento: string, // "Estacionamiento Sotano 1"
  start: string
): string {
  const bucket = "IoT Estacionamientos";
  return `
from(bucket: "${bucket}")
  |> range(start: ${start}, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "${estacionamiento}")
  |> last()
  |> yield(name: "last")
`;
}
