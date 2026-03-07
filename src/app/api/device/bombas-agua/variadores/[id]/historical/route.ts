// app/api/bombas-agua/Variadores/[id]/historical/route.ts

import { BombasDeAguaVariadoresHistoricalAction } from "@/influx/devices/bombas-agua/variadores/historico/actions";
import { handleHistoricalValueRequest } from "@/utils/api/actionsRoutes/handlerHistoricalValue";


export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  const unwrappedParams = await params;
  return handleHistoricalValueRequest(request, unwrappedParams, BombasDeAguaVariadoresHistoricalAction);
}
