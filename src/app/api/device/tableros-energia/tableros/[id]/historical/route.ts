import { TablerosEnergiaHistoricalAction } from "@/influx/devices/tableros-energia/historico/actions";
import { handleHistoricalValueRequest } from "@/utils/api/actionsRoutes/handlerHistoricalValue";


export async function GET(
  request: Request,
  context: { params: { id?: string } }
) {
  return handleHistoricalValueRequest(request, context.params, TablerosEnergiaHistoricalAction);
}
