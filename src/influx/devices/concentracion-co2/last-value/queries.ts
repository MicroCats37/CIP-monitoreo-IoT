export function concentracionCo2LastValueQuery(
  start: string
): string {
  const bucket = "IoT Concentracion de CO2";
  return `
from(bucket: "${bucket}")
  |> range(start: ${start}, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "Concentracion de Co2")
  |> filter(fn: (r) => r["name"] == "C.I.P. Sotanos")
  |> last()
  |> yield(name: "last")
`;
}