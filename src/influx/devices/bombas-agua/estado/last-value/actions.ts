import { GeneralService } from "@/utils/Devices/Service/serviceExecutor";

import { bombasDeAguaEstadoSchema } from "@/validators/devices/schemas";
import { BombasDeAguaEstadoLastValueQuery } from "./queries";
import { formatterBombasEstado } from "./format";

export const BombasDeAguaEstadoLastAction = async (id: string,start:string) => {
  const query = BombasDeAguaEstadoLastValueQuery(
    id,
    start
  );
 const stop = new Date().toISOString();
  const results = await GeneralService(start,stop,query, formatterBombasEstado, bombasDeAguaEstadoSchema);
  return results;
};
