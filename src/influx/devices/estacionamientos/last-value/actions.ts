import { GeneralService } from "@/utils/Devices/Service/serviceExecutor"
import { EstacionamientosLastValueQuery } from "./queries";
import { formatterEstacionamientos } from "./format";
import { estacionamientoSchema } from "@/validators/devices/schemas";



export const EstacionamientosLastAction = async (id: string,start:string) => {
    const query = EstacionamientosLastValueQuery(id, start);
    const stop = new Date().toISOString();
    const results = await GeneralService(start,stop,query, formatterEstacionamientos, estacionamientoSchema);
    return results; // Devuelve el último registro
};