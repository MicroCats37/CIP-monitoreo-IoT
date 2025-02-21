"use server";
import { QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate";
import { queryApi } from "@/influxDB/influxConfig"; // Ajusta la ruta a tu cliente de InfluxDB
import { BoardType } from "@/types";
import { getWindowPeriod } from "@/utils/contextWindow";
import { fetchDataAction } from "@/utils/ServerActions/validator";
import { ArrayHistoricalBoardTypeSchema } from "@/validators/schemas";


export const getHistoricoTableros = async (time:string): Promise<BoardType[][]> => {
  const windowPeriod = time !== "30m" ? `|> aggregateWindow(every: ${getWindowPeriod(time as QueryTimeType)}, fn: mean, createEmpty: false)` : "";
  const fluxQuery = `
    from(bucket: "Tableros de Energia")
    |> range(start: -${time}) // Historial de la última hora
    |> filter(fn: (r) => r["_measurement"] == "Potencias")
    |> filter(fn: (r) => r["_field"] == "value")
    |> group(columns: ["potencia"])  // Agrupa por tablero
    ${windowPeriod}
    |> sort(columns: ["_time"], desc: false) // Orden cronológico ascendente
  `;

  // Objeto para agrupar los tableros por nombre
  const boards: { [key: string]: BoardType[] } = {};

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const record = tableMeta.toObject(values);
    const boardName = record.potencia; // Nombre del tablero

    // Inicializa el array del tablero si no existe
    if (!boards[boardName]) {
      boards[boardName] = [];
    }

    // Agrega el registro al historial de ese tablero
    boards[boardName].push({
      data: {
        potencia: boardName,
        value: record._value,
      },
      time: record._time, // Marca de tiempo del estado
    });
  }

  // Convierte el objeto agrupado en un array de arrays
  return Object.values(boards);
};

export const getHistoricoTablerosAction = async (time:string): Promise<BoardType[][]> => {
  return fetchDataAction(() => getHistoricoTableros(time), ArrayHistoricalBoardTypeSchema);
};
