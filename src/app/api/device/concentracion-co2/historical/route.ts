import { ConcentracionCo2HistoricalAction } from "@/influx/devices/concentracion-co2/historico/actions";
import { handleHistoricalValueRequest } from "@/utils/api/actionsRoutes/handlerHistoricalValue";


export async function GET(
  request: Request,
  context: { params: { id?: string } }
) {
  return handleHistoricalValueRequest(request, context.params, ConcentracionCo2HistoricalAction);
}
