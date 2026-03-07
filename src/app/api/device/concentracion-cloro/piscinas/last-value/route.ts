// app/api/tableros-energia/[id]/last/route.ts
import { ConcentracionCloroLastAction } from "@/influx/devices/concentracion-cloro/last-value/actions";
import { handlerLastValueRequest } from "@/utils/api/actionsRoutes/handlerLastValue";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request
) {
  return handlerLastValueRequest(request, {}, ConcentracionCloroLastAction);
}
