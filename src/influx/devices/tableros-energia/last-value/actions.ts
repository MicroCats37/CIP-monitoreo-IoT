import { GeneralService } from "@/utils/Devices/Service/serviceExecutor"
import { TablerosEnergiaLastValueQuery } from "../../tableros-energia/last-value/queries"

import { tablerosDeEnergiaSchema } from "@/validators/devices/schemas"
import { formatterTablerosEnergia } from "./format";

export const TablerosEnergiaLastAction = async (id: string,start:string) => {
    const query = TablerosEnergiaLastValueQuery(id, start);
    const stop = new Date().toISOString();
    const results = await GeneralService(start,stop,query, formatterTablerosEnergia, tablerosDeEnergiaSchema);
    return results; // Devuelve el último registro
};