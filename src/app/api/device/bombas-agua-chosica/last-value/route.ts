// app/api/tableros-energia/[id]/last/route.ts

import { BombasDeAguaChosicaLastAction } from "@/influx/devices/bombas-agua-chosica/last-value/actions";
import { handlerLastValueRequest } from "@/utils/api/actionsRoutes/handlerLastValue";


export const dynamic = 'force-dynamic';

export async function GET(
  request: Request
) {
  return handlerLastValueRequest(request, {}, BombasDeAguaChosicaLastAction);
}