// app/api/bombas-agua/estado/[id]/historical/route.ts

import { BombasDeAguaEstadoHistoricalAction } from "@/influx/devices/bombas-agua/estado/historico/actions";
import { handleHistoricalValueRequest } from "@/utils/api/actionsRoutes/handlerHistoricalValue";


export async function GET(
  request: Request,
  context: { params: { id?: string } }
) {
  return handleHistoricalValueRequest(request, context.params, BombasDeAguaEstadoHistoricalAction);
}
