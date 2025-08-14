import { GeneralService } from "@/utils/Devices/Service/serviceExecutor";

import { bombasDeAguaVariadoresSchema } from "@/validators/devices/schemas";
import { BombasDeAguaVariadoresLastValueQuery } from "./queries";
import { formatterBombasVariadores } from "./format";

export const BombasDeAguaVariadoresLastAction = async (id: string,start:string) => {
  const query = BombasDeAguaVariadoresLastValueQuery(
    id,
    start
  );
  const stop = new Date().toISOString();
  const results = await GeneralService(start,stop,query, formatterBombasVariadores, bombasDeAguaVariadoresSchema);
  return results;
};
