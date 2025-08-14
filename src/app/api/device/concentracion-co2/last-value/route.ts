// app/api/concentracion-co2/[id]/last/route.ts

import { concentracionCo2LastAction } from "@/influx/devices/concentracion-co2/last-value/actions";
import { handlerLastValueRequest } from "@/utils/api/actionsRoutes/handlerLastValue";

export async function GET(
  request: Request,
  context: { params: { id?: string } }
) {
  return handlerLastValueRequest(request, context.params, concentracionCo2LastAction);
}
