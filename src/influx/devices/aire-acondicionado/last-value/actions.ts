import { GeneralService } from "@/utils/Devices/Service/serviceExecutor"
import { aireAcondicionadoSchema } from "@/validators/devices/schemas"
import { AireAcondicionadoLastValueQuery } from "./queries";
import { formatterAireAcondicionado } from "./format";


export const AireAcondicionadoLastAction = async (id: string,start:string) => {
    const query = AireAcondicionadoLastValueQuery(id, start);
    const stop = new Date().toISOString();
    const results = await GeneralService(start,stop,query, formatterAireAcondicionado, aireAcondicionadoSchema);
    return results; // Devuelve el último registro
};