"use server";
import { WaterPumpType } from "@/types";
import { queryApi } from "../influxConfig";
import { formatString } from "@/utils/formatStringPump";
import { fetchDataAction } from "@/utils/ServerActions/validator";
import { ArrayHistoricalWaterPumpTypeSchema } from "@/validators/schemas";
import { getWindowPeriod } from "@/utils/contextWindow";
import { QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate";



export const getBombasHistorico = async (bomba: string,time:string): Promise<WaterPumpType[][]> => {
    const windowPeriod = time !== "30m" ? `|> aggregateWindow(every: ${getWindowPeriod(time as QueryTimeType)}, fn: mean, createEmpty: false)` : "";
    const fluxQuery = `
        from(bucket: "Bombas de Agua")
        |> range(start: -${time})  // Historial de la última hora
        |> filter(fn: (r) => r["_measurement"] == "${formatString(bomba)}")
        |> filter(fn: (r) => r["_field"] == "estado")
        ${windowPeriod}
        |> sort(columns: ["_time"], desc: false)
      `;
  
    // Crear un mapa para agrupar por nombre de bomba
    const bombaMap: Record<string, WaterPumpType[]> = {};

    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
      const record = tableMeta.toObject(values);
      const bombaName = record.bomba;
  
      // Crear un array para cada bomba si no existe
      if (!bombaMap[bombaName]) {
        bombaMap[bombaName] = [];
      }
  
      // Agregar el registro al array correspondiente
      bombaMap[bombaName].push({
        data: {
          bomba: bombaName,
          estado: Boolean(record._value),
        },
        time: record._time, // Marca de tiempo del estado
      });
    }

    // Convertir el mapa en un array de arrays
    return Object.values(bombaMap);
  };
  
  export const getBombasHistoricoAction = async (bomba: string,time:string): Promise<WaterPumpType[][]> => {
    return fetchDataAction(() => getBombasHistorico(bomba,time), ArrayHistoricalWaterPumpTypeSchema);
  };