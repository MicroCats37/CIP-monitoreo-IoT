import { TablerosEnergiaHistoricalAction } from "@/influx/devices/tableros-energia/historico/actions";
import { handleHistoricalValueRequest } from "@/utils/api/actionsRoutes/handlerHistoricalValue";


export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  const unwrappedParams = await params;
  return handleHistoricalValueRequest(request, unwrappedParams, TablerosEnergiaHistoricalAction);
}
