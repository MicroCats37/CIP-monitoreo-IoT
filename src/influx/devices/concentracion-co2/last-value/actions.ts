import { GeneralService } from "@/utils/Devices/Service/serviceExecutor";
import { concentracionCo2LastValueQuery } from "../../concentracion-co2/last-value/queries";

import { concentracionCo2Schema } from "@/validators/devices/schemas";
import { formatterConcentracionCo2 } from "./format";

export const concentracionCo2LastAction = async (start:string) => {
  const query = concentracionCo2LastValueQuery(
    start
  );
  const stop = new Date().toISOString();
  const results = await GeneralService(start,stop,query, formatterConcentracionCo2, concentracionCo2Schema);
  return results; // Devuelve el último registro
};
