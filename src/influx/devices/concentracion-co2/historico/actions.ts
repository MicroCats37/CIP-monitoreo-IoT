import { GeneralService } from "@/utils/Devices/Service/serviceExecutor";
import {
  concentracionCo2HistoricalSchema,
  type ConcentracionCo2HistoricalType,
} from "@/validators/devices/schemas";
import { concentracionCo2HistoricalQuery } from "./queries";
import { formatterConcentracionCo2Historical } from "./formats";

export const ConcentracionCo2HistoricalAction = async (
  start: string,
  stop: string,
): Promise<ConcentracionCo2HistoricalType> => {
  const query = concentracionCo2HistoricalQuery(start, stop);

  const results = await GeneralService(
    start,
    stop,
    query,
    formatterConcentracionCo2Historical,
    concentracionCo2HistoricalSchema
  );

  return results;
};
