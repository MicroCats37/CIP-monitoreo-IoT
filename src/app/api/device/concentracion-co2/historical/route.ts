import { ConcentracionCo2HistoricalAction } from "@/influx/devices/concentracion-co2/historico/actions";
import { handleHistoricalValueRequest } from "@/utils/api/actionsRoutes/handlerHistoricalValue";


export const dynamic = 'force-dynamic';

export async function GET(
  request: Request
) {
  return handleHistoricalValueRequest(request, {}, ConcentracionCo2HistoricalAction);
}
