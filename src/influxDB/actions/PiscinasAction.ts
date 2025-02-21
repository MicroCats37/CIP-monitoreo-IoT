
"use server";
import { PoolType } from "@/types";
import { queryApi } from "../influxConfig";
import { fetchDataAction } from "@/utils/ServerActions/validator";
import { ArrayPoolTypeSchema } from "@/validators/schemas";
export const getPiscinasEstadoAction = async (): Promise<PoolType[]> => {
  const fluxQuery = `
       from(bucket: "Concentracion de Cloro")
        |> range(start: -7d)
        |> filter(fn: (r) => r["_measurement"] == "Piscina 1" or r["_measurement"] == "Piscina 2")
        |> filter(fn: (r) => r["_field"] == "value")
        |> group(columns: ["_measurement"])  // Agrupar por piscina (en lugar de "sensor")
        |> last()  // Obtener el último valor por cada grupo
        |> yield(name: "last")

      `;

  const rows: PoolType[] = [];

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const record = tableMeta.toObject(values);
    rows.push({
      data: {
        piscina: record["_measurement"], // Nombre de la piscina
        cloro: Number(record["_value"]), // Valor del cloro
      },
      time: record["_time"], // Marca de tiempo del estado
    });
  }
  return rows;
};

export const getPiscinasAction = async (): Promise<PoolType[]> => {
  return fetchDataAction(getPiscinasEstadoAction, ArrayPoolTypeSchema);
};