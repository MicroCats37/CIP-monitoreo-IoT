import { queryApi } from "@/influxDB/influxConfig";// Ajusta la ruta a tu cliente de InfluxDB

export interface TableroEstado {
  potencia: string; // Nombre del tablero (Q01, Q02, etc.)
  value: number; // Valor de potencia
  time: string; // Timestamp del estado
}

export const getTableroEstados = async (): Promise<TableroEstado[]> => {
  const fluxQuery = `
    from(bucket: "Tableros de Energia")
    |> range(start: -30m)  // Últimos 30 minutos
    |> filter(fn: (r) => r["_measurement"] == "Potencias")
    |> filter(fn: (r) => r["_field"] == "value")
    |> group(columns: ["potencia"])  // Agrupa por tablero
    |> last()  // Obtiene el último valor por tablero
    |> yield(name: "last")
  `;

  const rows: TableroEstado[] = [];

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const record = tableMeta.toObject(values);
    rows.push({
      potencia: record.potencia, // Nombre del tablero
      value: record._value, // Valor de potencia
      time: record._time, // Marca de tiempo del último estado
    });
  }

  return rows;
};
