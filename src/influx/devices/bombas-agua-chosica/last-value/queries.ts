export function BombasDeAguaChosicaLastValueQuery(
  start: string
): string {
  const bucket = "IoT Bombas de Agua Chosica";
  return `
from(bucket: "${bucket}")
  |> range(start: ${start}, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "Automatizacion de Bombas de Agua Chosica")
  |> last()
  |> yield(name: "last")
`;
}
