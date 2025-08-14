// app/api/bombas-agua/Variadores/[id]/historical/route.ts

import { BombasDeAguaVariadoresHistoricalAction } from "@/influx/devices/bombas-agua/variadores/historico/actions";
import { handleHistoricalValueRequest } from "@/utils/api/actionsRoutes/handlerHistoricalValue";


export async function GET(
  request: Request,
  context: { params: { id?: string } }
) {
  return handleHistoricalValueRequest(request, context.params, BombasDeAguaVariadoresHistoricalAction);
}
