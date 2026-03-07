import { ConcentracionCloroHistoricalAction } from "@/influx/devices/concentracion-cloro/historico/actions";
import { handleHistoricalValueRequest } from "@/utils/api/actionsRoutes/handlerHistoricalValue";


export const dynamic = 'force-dynamic';

export async function GET(
  request: Request
) {
  return handleHistoricalValueRequest(request, {}, ConcentracionCloroHistoricalAction);
}
