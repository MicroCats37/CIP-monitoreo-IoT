"use server";
import { SCISimplifiedType } from "@/types0";
import { queryApi } from "../influxConfig";
import { ArrayHistoricalSCITypeSchema } from "@/validators0/schemas";
import { fetchDataAction } from "@/utils/ServerActions/validator";
import { getWindowPeriod } from "@/utils/contextWindow";
import { QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate";



export const getHistoricoSCI = async (time: string): Promise<SCISimplifiedType[][]> => {
  const windowPeriod = time !== "30m" 
    ? `|> aggregateWindow(every: ${getWindowPeriod(time as QueryTimeType)}, fn: mean, createEmpty: false)` 
    : "";

  const fluxQuery = `
    from(bucket: "Sistema Contra Incendios")
      |> range(start: -${time})
      |> filter(fn: (r) => r["_measurement"] == "SCI")
      |> filter(fn: (r) =>
          r["_field"] == "voltage" or
          r["_field"] == "current" or
          r["_field"] == "frequency" or
          r["_field"] == "custom_locked_rotor_current"
      )
      ${windowPeriod} 
      |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> sort(columns: ["_time"], desc: false)
  `;

  const historicalData: SCISimplifiedType[][] = []; // Array para almacenar el histórico.

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const record = tableMeta.toObject(values);

    historicalData.push([{
      data: {
        voltage: record.voltage,
        current: record.current,
        frequency: record.frequency,
        custom_locked_rotor_current: record.custom_locked_rotor_current,
      },
      time: record._time,
    }]);
  }

  return historicalData; // Devolver el histórico completo.
};

export const getHistoricoSCIAction= async (time:string): Promise<SCISimplifiedType[][]> => {
  return fetchDataAction(() => getHistoricoSCI(time), ArrayHistoricalSCITypeSchema);
};


