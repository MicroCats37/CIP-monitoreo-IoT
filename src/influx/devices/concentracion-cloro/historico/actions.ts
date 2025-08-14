import { GeneralService } from "@/utils/Devices/Service/serviceExecutor";

import {
  concentracionCloroHistoricalSchema,
  type ConcentracionCloroHistoricalType,

} from "@/validators/devices/schemas";


import { concentracionCloroHistoricalQuery } from "./queries";
import { formatterConcentracionCloroHistorical } from "./formats";

export const ConcentracionCloroHistoricalAction = async (
  start: string,
  stop: string,
): Promise<ConcentracionCloroHistoricalType> => {
  const query = concentracionCloroHistoricalQuery(start, stop);

  const results = await GeneralService(
    start,
    stop,
    query,
    formatterConcentracionCloroHistorical,
    concentracionCloroHistoricalSchema
  );

  return results;
};
