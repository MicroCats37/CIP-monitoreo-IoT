// app/api/tableros-energia/[id]/last/route.ts
import { BombasDeAguaVariadoresLastAction } from "@/influx/devices/bombas-agua/variadores/last-value/actions";
import { handlerLastValueRequest } from "@/utils/api/actionsRoutes/handlerLastValue";

export async function GET(
  request: Request,
  context: { params: { id?: string } }
) {
  return handlerLastValueRequest(request, context.params, BombasDeAguaVariadoresLastAction);
}
