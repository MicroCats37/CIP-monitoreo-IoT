import { GeneralService } from "@/utils/Devices/Service/serviceExecutor";

import { bombasDeAguaChosicaSchema } from "@/validators/devices/schemas";
import { BombasDeAguaChosicaLastValueQuery } from "./queries";
import { formatterBombasChosica } from "./format";

export const BombasDeAguaChosicaLastAction = async (start:string) => {
  const query = BombasDeAguaChosicaLastValueQuery(
    start
  );
 const stop = new Date().toISOString();
  const results = await GeneralService(start,stop,query, formatterBombasChosica, bombasDeAguaChosicaSchema);
  return results;
};
