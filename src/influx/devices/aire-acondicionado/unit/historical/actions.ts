import { GeneralService } from "@/utils/Devices/Service/serviceExecutor"
import { aireAcondicionadoUnitHistoricalSchema, AireAcondicionadoUnitHistoricalType } from "@/validators/devices/schemas"
import { AireAcondicionadoUnitHistoricalQuery } from "./queries";
import { formatterAireAcondicionadoUnitHistorical } from "./formats";



export const AireAcondicionadoUnitHistoricalAction = async (
  id: string,
  unitId: string,
  start: string,
  stop: string,
): Promise<AireAcondicionadoUnitHistoricalType> => {
  const query = AireAcondicionadoUnitHistoricalQuery(id, unitId, start, stop);

    const results = await GeneralService(start,stop,query, formatterAireAcondicionadoUnitHistorical, aireAcondicionadoUnitHistoricalSchema);
    return results; // Devuelve el último registro
};