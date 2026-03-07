// app/api/tableros-energia/[id]/last/route.ts

import { BombasDeAguaEstadoLastAction } from "@/influx/devices/bombas-agua/estado/last-value/actions";
import { handlerLastValueRequest } from "@/utils/api/actionsRoutes/handlerLastValue";


export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  const unwrappedParams = await params;
  return handlerLastValueRequest(request, unwrappedParams, BombasDeAguaEstadoLastAction);
}