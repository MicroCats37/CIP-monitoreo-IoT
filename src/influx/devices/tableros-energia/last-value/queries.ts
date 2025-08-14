export function TablerosEnergiaLastValueQuery(
    tablero: string,
    start: string,
): string {
    const bucket = "IoT Tableros de Energia";
    return `
from(bucket: "${bucket}")
  |> range(start: ${start}, stop: now())
  |> filter(fn: (r) => r["_measurement"] == "Tableros de Energia")
  |> filter(fn: (r) => r["_field"] == "activa" or r["_field"] == "aparente" or r["_field"] == "reactiva")
  |> filter(fn: (r) => r["name"] == "${tablero}")
  |> last()
  |> yield(name: "last")
`;
}
