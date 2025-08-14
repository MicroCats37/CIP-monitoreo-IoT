
import { BombasDeAguaChosicaHistoricalAction } from "@/influx/devices/bombas-agua-chosica/historical/actions";
import { handleHistoricalValueRequest } from "@/utils/api/actionsRoutes/handlerHistoricalValue";

export async function GET(
  request: Request,
  context: { params: { id?: string } }
) {
  return handleHistoricalValueRequest(request, context.params, BombasDeAguaChosicaHistoricalAction);
}