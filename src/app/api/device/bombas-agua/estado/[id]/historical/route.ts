// app/api/bombas-agua/estado/[id]/historical/route.ts

import { BombasDeAguaEstadoHistoricalAction } from "@/influx/devices/bombas-agua/estado/historico/actions";
import { handleHistoricalValueRequest } from "@/utils/api/actionsRoutes/handlerHistoricalValue";


export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  const unwrappedParams = await params;
  return handleHistoricalValueRequest(request, unwrappedParams, BombasDeAguaEstadoHistoricalAction);
}
