import { AireAcondicionadoLastAction } from "@/influx/devices/aire-acondicionado/last-value/actions";
import { handlerLastValueRequest } from "@/utils/api/actionsRoutes/handlerLastValue";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  const unwrappedParams = await params;
  return handlerLastValueRequest(request, unwrappedParams, AireAcondicionadoLastAction);
}