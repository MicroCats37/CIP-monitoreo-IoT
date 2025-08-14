export function SistemaContraIncendiosLastValueQuery(
  start: string
): string {
  const bucket = "IoT Sistema Contra Incendios";
  return `
from(bucket: "${bucket}")
  |> range(start: ${start}, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "Sistema Contra Incendios")
  |> last()
  |> yield(name: "last")
`;
}