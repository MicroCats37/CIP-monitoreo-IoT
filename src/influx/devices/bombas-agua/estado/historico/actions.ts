// influx/devices/bombas-agua/estado/historical-value/actions.ts

import { GeneralService } from "@/utils/Devices/Service/serviceExecutor";


import { bombasDeAguaEstadoHistoricalSchema, BombasDeAguaEstadoHistoricalType } from "@/validators/devices/schemas";
import { BombasDeAguaEstadoHistoricalQuery } from "../historico/queries";
import { formatterBombasEstadoHistorical } from "../historico/formats";


export const BombasDeAguaEstadoHistoricalAction = async (
  id: string,
  start: string,
  stop: string,
): Promise<BombasDeAguaEstadoHistoricalType> => {
  const query = BombasDeAguaEstadoHistoricalQuery(id, start, stop);

  const results = await GeneralService(
    start,
    stop,
    query,
    formatterBombasEstadoHistorical,
    bombasDeAguaEstadoHistoricalSchema
  );

  return results;
};
