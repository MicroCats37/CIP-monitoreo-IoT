// influx/devices/bombas-agua/Variadores/historical-value/actions.ts

import { GeneralService } from "@/utils/Devices/Service/serviceExecutor";


import { bombasDeAguaVariadoresHistoricalSchema, BombasDeAguaVariadoresHistoricalType } from "@/validators/devices/schemas";
import { BombasDeAguaVariadoresHistoricalQuery } from "../historico/queries";
import { formatterBombasVariadoresHistorical } from "../historico/formats";


export const BombasDeAguaVariadoresHistoricalAction = async (
  id: string,
  start: string,
  stop: string,
): Promise<BombasDeAguaVariadoresHistoricalType> => {
  const query = BombasDeAguaVariadoresHistoricalQuery(id, start, stop);

  const results = await GeneralService(
    start,
    stop,
    query,
    formatterBombasVariadoresHistorical,
    bombasDeAguaVariadoresHistoricalSchema
  );

  return results;
};
