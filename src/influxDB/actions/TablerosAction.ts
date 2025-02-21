"use server";
import { queryApi } from "@/influxDB/influxConfig";// Ajusta la ruta a tu cliente de InfluxDB
import { BoardType } from "@/types";
import { fetchDataAction } from "@/utils/ServerActions/validator";
import { ArrayBoardTypeSchema } from "@/validators/schemas";



export const getTableroEstados = async (): Promise<BoardType[]> => {
  const fluxQuery = `
    from(bucket: "Tableros de Energia")
    |> range(start: -7d)  // Últimos 30 minutos
    |> filter(fn: (r) => r["_measurement"] == "Potencias")
    |> filter(fn: (r) => r["_field"] == "value")
    |> group(columns: ["potencia"])  // Agrupa por tablero
    |> last()  // Obtiene el último valor por tablero
    |> yield(name: "last")
  `;

  const rows: BoardType[] = [];

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const record = tableMeta.toObject(values);
    rows.push({
      data: {
        potencia: record.potencia, // Nombre del tablero
        value: record._value, // Valor de potencia
      },
      time: record._time, // Marca de tiempo del último estado
    });
  }

  return rows;
};
export const getTableroAction = async (): Promise<BoardType[]> => {
  return fetchDataAction(() => getTableroEstados(), ArrayBoardTypeSchema);
};