// influx/devices/bombas-agua/Chosica/historical-value/actions.ts

import { GeneralService } from "@/utils/Devices/Service/serviceExecutor";


import { bombasDeAguaChosicaHistoricalSchema, BombasDeAguaChosicaHistoricalType } from "@/validators/devices/schemas";
import { formatterBombasChosicaHistorical } from "./formats";
import { BombasDeAguaChosicaHistoricalQuery } from "./queries";



export const BombasDeAguaChosicaHistoricalAction = async (
  start: string,
  stop: string,
): Promise<BombasDeAguaChosicaHistoricalType> => {
  const query = BombasDeAguaChosicaHistoricalQuery(start, stop);

  const results = await GeneralService(
    start,
    stop,
    query,
    formatterBombasChosicaHistorical,
    bombasDeAguaChosicaHistoricalSchema
  );

  return results;
};
