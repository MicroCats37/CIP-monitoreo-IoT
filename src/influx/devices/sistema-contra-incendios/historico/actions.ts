import { GeneralService } from "@/utils/Devices/Service/serviceExecutor"
import { sistemaContraIncendiosHistoricalSchema, SistemaContraIncendiosHistoricalType, TablerosDeEnergiaHistoricalType } from "@/validators/devices/schemas"
import { formatterSistemaContraIncendiosHistorical } from "./formats";
import { sistemaContraIncendiosHistoricalQuery } from "./queries";



export const SistemaContraIncendiosHistoricalAction = async (
    start: string,
    stop: string,
): Promise<SistemaContraIncendiosHistoricalType> => {
    const query = sistemaContraIncendiosHistoricalQuery(start, stop);
    const results = await GeneralService(start, stop, query, formatterSistemaContraIncendiosHistorical, sistemaContraIncendiosHistoricalSchema);
    return results;
};