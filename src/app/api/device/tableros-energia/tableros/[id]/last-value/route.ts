// app/api/tableros-energia/[id]/last/route.ts


import { TablerosEnergiaLastAction } from "@/influx/devices/tableros-energia/last-value/actions";
import { handlerLastValueRequest } from "@/utils/api/actionsRoutes/handlerLastValue";

export async function GET(
  request: Request,
  context: { params: { id?: string } }
) {
  return handlerLastValueRequest(request, context.params, TablerosEnergiaLastAction);
}