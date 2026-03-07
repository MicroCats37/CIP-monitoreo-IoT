
import { BombasDeAguaChosicaHistoricalAction } from "@/influx/devices/bombas-agua-chosica/historical/actions";
import { handleHistoricalValueRequest } from "@/utils/api/actionsRoutes/handlerHistoricalValue";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request
) {
  return handleHistoricalValueRequest(request, {}, BombasDeAguaChosicaHistoricalAction);
}