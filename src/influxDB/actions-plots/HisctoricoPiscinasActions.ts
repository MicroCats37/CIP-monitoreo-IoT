"use server";
import { PoolType } from "@/types0";
import { queryApi } from "../influxConfig";
import { fetchDataAction } from "@/utils/ServerActions/validator";
import { ArrayHistoricalPoolTypeSchema } from "@/validators0/schemas";
import { getWindowPeriod } from "@/utils/contextWindow";
import { QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate";


export const getPiscinasHistorico = async (time: string): Promise<PoolType[][]> => {
  const windowPeriod = time !== "30m" ? `|> aggregateWindow(every: ${getWindowPeriod(time as QueryTimeType)}, fn: mean, createEmpty: false)` : "";
  const fluxQuery = `
      from(bucket: "Concentracion de Cloro")
      |> range(start: -${time})  
      |> filter(fn: (r) => r["_measurement"] == "Piscina 1" or r["_measurement"] == "Piscina 2")
      |> filter(fn: (r) => r["_field"] == "value")
      ${windowPeriod}
      |> sort(columns: ["_time"], desc: false) // Orden cronológico ascendente
    `;
  //|> aggregateWindow(every: ${getWindowPeriod(time as QueryTimeType)}, fn: mean, createEmpty: false)
  // Crear un mapa para agrupar por nombre de piscina
  const piscinaMap: Record<string, PoolType[]> = {};

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const record = tableMeta.toObject(values);
    const piscinaName = record._measurement; // "Piscina 1" o "Piscina 2"

    // Crear un array para cada piscina si no existe
    if (!piscinaMap[piscinaName]) {
      piscinaMap[piscinaName] = [];
    }

    // Agregar el registro al array correspondiente
    piscinaMap[piscinaName].push({
      data: {
        piscina: piscinaName,
        cloro: record._value, // Concentración de cloro
      },
      time: record._time, // Marca de tiempo del estado
    });
  }

  // Convertir el mapa en un array de arrays
  return Object.values(piscinaMap);
};

export const getPiscinasHistoricoAction = async (time: string): Promise<PoolType[][]> => {
  return fetchDataAction(() => getPiscinasHistorico(time), ArrayHistoricalPoolTypeSchema);
};
