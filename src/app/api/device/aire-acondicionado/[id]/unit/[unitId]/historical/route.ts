import { NextResponse } from "next/server";
import { z } from "zod";
import { AireAcondicionadoUnitHistoricalAction } from "@/influx/devices/aire-acondicionado/unit/historical/actions";
import { MonitoreoPlotGeneralSchema } from "@/validators/schemas";
import { apiToIdMap } from "@/utils/Devices/Data/data.api.monitoreo";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ unitId: string; id: string }> }
) {
  const { unitId, id } = await params;
  const url = new URL(request.url);
  const config = apiToIdMap["/api/device/aire-acondicionado/"];

  if (!config) {
    return NextResponse.json(
      { error: `Ruta base no válida:` },
      { status: 400 }
    );
  }

  const { id: idConfig, error400, error404, error500 } = config;

  const expectsId = !!idConfig && Object.keys(idConfig.idKey ?? {}).length > 0;
  const isValidId = id && idConfig?.valId?.includes(id);

  if (expectsId && !isValidId) {
    return NextResponse.json({ error: error400 }, { status: 400 });
  }

  const idData = idConfig?.idKey?.[id];

  // 🛑 Si se espera ID válido y no existe el dato asociado, devolvemos 404
  if (expectsId && !idData) {
    return NextResponse.json({ error: error404 }, { status: 404 });
  }

  const start = url.searchParams.get("start");
  const stop = url.searchParams.get("stop");

  if (!start || !stop) {
    return NextResponse.json(
      { error: "Faltan parámetros: start y stop" },
      { status: 400 }
    );
  }

  try {
    const data = await AireAcondicionadoUnitHistoricalAction(idData!, unitId, start, stop);

    MonitoreoPlotGeneralSchema.parse(data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error en GET /historical:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error400 }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: error500,
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
