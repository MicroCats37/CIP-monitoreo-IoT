import { GeneralService } from "@/utils/Devices/Service/serviceExecutor"
import { tablerosDeEnergiaHistoricalSchema, TablerosDeEnergiaHistoricalType } from "@/validators/devices/schemas"
import { formatterTablerosEnergiaHistorical } from "./formats";
import { TablerosEnergiaHistoricalQuery } from "./queries";


export const TablerosEnergiaHistoricalAction = async (
  id: string,
  start: string,
  stop: string,
): Promise<TablerosDeEnergiaHistoricalType> => {
  const query = TablerosEnergiaHistoricalQuery(id, start, stop);
    const results = await GeneralService(start,stop,query, formatterTablerosEnergiaHistorical, tablerosDeEnergiaHistoricalSchema);
    return results; // Devuelve el último registro
};