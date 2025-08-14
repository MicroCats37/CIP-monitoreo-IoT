import { GeneralService } from "@/utils/Devices/Service/serviceExecutor";
import { SistemaContraIncendiosLastValueQuery } from "../../sistema-contra-incendios/last-value/queries";
import { formatterSistemaContraIncendios } from "../../sistema-contra-incendios/last-value/format";
import { sistemaContraIncendiosSchema } from "@/validators/devices/schemas";

export const SistemaContraIncendiosLastAction = async (start:string) => {
  const query = SistemaContraIncendiosLastValueQuery(start);
  const stop = new Date().toISOString();
  const results = await GeneralService(start,stop,query, formatterSistemaContraIncendios, sistemaContraIncendiosSchema);
  return results;
};
