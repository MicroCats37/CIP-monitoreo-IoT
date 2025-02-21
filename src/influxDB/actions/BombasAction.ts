"use server";
import { WaterPumpType } from "@/types";
import { queryApi } from "../influxConfig";
import { formatString } from "@/utils/formatStringPump";
import { fetchDataAction } from "@/utils/ServerActions/validator";
import { ArrayWaterPumpTypeSchema} from "@/validators/schemas";



export const getBombasEstadoAction = async (bomba: string): Promise<WaterPumpType[]> => {
  const fluxQuery = `
      from(bucket: "Bombas de Agua")
      |> range(start: -7d)  
      |> filter(fn: (r) => r["_measurement"] == "${formatString(bomba)}")
      |> filter(fn: (r) => r["_field"] == "estado")
      |> group(columns: ["bomba"])  // Agrupa por nombre de bomba
      |> last()  // Obtiene el último estado
      |> yield(name: "last")
    `;

  const rows: WaterPumpType[] = [];

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const record = tableMeta.toObject(values);
    rows.push({
      data: {
        bomba: record.bomba,
        estado: Boolean(record._value),
      },
      // Convertido directamente a 1 o 0 desde InfluxDB
      time: record._time, // Marca de tiempo del estado
    });
  }
  return rows;
};

export const getBombasAction = async (bomba: string): Promise<WaterPumpType[]> => {
  return fetchDataAction(() => getBombasEstadoAction(bomba), ArrayWaterPumpTypeSchema);
};