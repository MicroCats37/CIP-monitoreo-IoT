// utils/api/handleHistoricalValueRequest.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import { apiToIdMap } from "@/utils/Devices/Data/data.api.monitoreo";
import { getBasePath, removeHistoricalOfUrl } from "@/utils/Devices/Format/api-url";
import { MonitoreoPlotGeneralSchema } from "@/validators/schemas";
import type { MonitoreoPlotGeneralType } from "@/types";

type HistoricalAction =
  | ((idData: string, start: string, stop: string) => Promise<MonitoreoPlotGeneralType>)
  | ((start: string, stop: string) => Promise<MonitoreoPlotGeneralType>);

/**
 * Handler genérico para GET en /historical con soporte para rutas con o sin [id].
 */
export async function handleHistoricalValueRequest(
  request: Request,
  params: { id?: string } = {},
  historicalAction: HistoricalAction
) {
  const id = params.id ?? "";
  const url = new URL(request.url);
  const pathname = url.pathname;

  const idPathname = removeHistoricalOfUrl(pathname);
  const basePath = apiToIdMap[idPathname]
    ? idPathname
    : getBasePath(idPathname);

  const config = apiToIdMap[basePath];
  if (!config) {
    return NextResponse.json({ error: `Ruta base no válida: ${basePath}` }, { status: 400 });
  }

  const { id: idConfig, error400, error404, error500 } = config;

  const expectsId = !!idConfig && Object.keys(idConfig.idKey ?? {}).length > 0;
  const isValidId = id && idConfig?.valId?.includes(id);

  if (expectsId && !isValidId) {
    return NextResponse.json({ error: error400 }, { status: 400 });
  }

  const idData = isValidId ? idConfig?.idKey?.[id] : undefined;

  // Leer los parámetros de rango desde el query string
  const start = url.searchParams.get("start");
  const stop = url.searchParams.get("stop");

  if (!start || !stop) {
    return NextResponse.json({ error: "Faltan parámetros: start, stop" }, { status: 400 });
  }
  const parsedStart = new Date(start);
  if (isNaN(parsedStart.getTime())) {
    return NextResponse.json({ error: "El parámetro 'start' no es una fecha válida" }, { status: 400 });
  }
  const parsedStop = new Date(stop);
  if (isNaN(parsedStart.getTime())) {
    return NextResponse.json({ error: "El parámetro 'start' no es una fecha válida" }, { status: 400 });
  }

  try {
    const data = expectsId
      ? await (historicalAction as (id: string, start: string, stop: string) => Promise<MonitoreoPlotGeneralType>)(idData!, start, stop)
      : await (historicalAction as (start: string, stop: string) => Promise<MonitoreoPlotGeneralType>)(start, stop);

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
