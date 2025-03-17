"use server";
import { CO2Type } from "@/types";
import { queryApi } from "../influxConfig";
import { ArrayHistoricalCO2TypeSchema } from "@/validators/schemas";
import { fetchDataAction } from "@/utils/ServerActions/validator";
import { getWindowPeriod } from "@/utils/contextWindow";
import { QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate";

export const getHistoricoCO2 = async (time: string): Promise<CO2Type[][]> => {
  const windowPeriod = time !== "30m" ? `|> aggregateWindow(every: ${getWindowPeriod(time as QueryTimeType)}, fn: mean, createEmpty: false)` : "";
  const fluxQuery = `
  from(bucket: "Sensor CO2")
  |> range(start: -${time})
  |> filter(fn: (r) => r["_measurement"] == "Sensor CO2")
  |> filter(fn: (r) => r["_field"] == "value")
  ${windowPeriod}
  |> sort(columns: ["_time"], desc: false) 
  `;

  const historicalData: CO2Type[][] = []; // Array para almacenar el histórico.

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const record = tableMeta.toObject(values);

    historicalData.push([{
      data: {
        lugar: "Sotanos", // Se usa el measurement como "lugar".
        co2: Number(record["_value"]), // Convertir a número.
      },
      time: record["_time"], // Timestamp del registro.
    }]);
  }
  return historicalData; // Devolver el histórico como un array de arrays.
};

export const getHistoricoCO2Action = async (time: string): Promise<CO2Type[][]> => {
  return fetchDataAction(() => getHistoricoCO2(time), ArrayHistoricalCO2TypeSchema);
};
