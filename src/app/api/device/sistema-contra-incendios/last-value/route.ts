
import { SistemaContraIncendiosLastAction } from "@/influx/devices/sistema-contra-incendios/last-value/actions";
import { handlerLastValueRequest } from "@/utils/api/actionsRoutes/handlerLastValue";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request
) {
  return handlerLastValueRequest(request, {}, SistemaContraIncendiosLastAction);
}
