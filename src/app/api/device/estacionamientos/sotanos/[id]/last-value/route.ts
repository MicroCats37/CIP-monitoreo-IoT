import { EstacionamientosLastAction } from "@/influx/devices/estacionamientos/last-value/actions";
import { handlerLastValueRequest } from "@/utils/api/actionsRoutes/handlerLastValue";

export async function GET(
  request: Request,
  context: { params: { id?: string } }
) {
  return handlerLastValueRequest(request, context.params, EstacionamientosLastAction);
}
