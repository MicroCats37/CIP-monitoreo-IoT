import { GeneralService } from "@/utils/Devices/Service/serviceExecutor";
import { formatterConcentracionCloro } from "../../concentracion-cloro/last-value/format";
import { concentracionCloroSchema } from "@/validators/devices/schemas";
import { ConcentracionCloroLastValueQuery } from "./queries";


export const ConcentracionCloroLastAction = async (start:string) => {
  const query = ConcentracionCloroLastValueQuery(
    start
  );
  const stop = new Date().toISOString();
  const results = await GeneralService(start,stop,query, formatterConcentracionCloro, concentracionCloroSchema);
  return results; // Devuelve el último registro
};
