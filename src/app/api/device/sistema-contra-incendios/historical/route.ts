import { } from "@/influx/devices/concentracion-cloro/historico/actions";
import { SistemaContraIncendiosHistoricalAction } from "@/influx/devices/sistema-contra-incendios/historico/actions";
import { handleHistoricalValueRequest } from "@/utils/api/actionsRoutes/handlerHistoricalValue";


export async function GET(
  request: Request,
  context: { params: { id?: string } }
) {
  return handleHistoricalValueRequest(request, context.params, SistemaContraIncendiosHistoricalAction);
}
