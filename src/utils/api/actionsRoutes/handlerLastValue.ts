// utils/api/handlerLastValueRequest.ts

import { NextResponse } from "next/server";
import { z } from "zod";
import { apiToIdMap } from "@/utils/Devices/Data/data.api.monitoreo";
import { getBasePath, removeLastValueOfUrl } from "@/utils/Devices/Format/api-url";
import type { GeneralMQTTObjectType } from "@/types";

/**
 * Handler genérico para GET en /last con soporte para rutas con o sin [id].
 *
 * @param request - Objeto Request de Next.js
 * @param params - Objeto que puede contener `id` como string o estar indefinido
 * @param lastAction - Acción a ejecutar que devuelve un GeneralMQTTObjectType. Puede ser:
 *                     - una función sin argumentos: () => Promise<GeneralMQTTObjectType>
 *                     - o una función con id: (idData: string) => Promise<GeneralMQTTObjectType>
 */

type LastValueAction =
  | ((start: string) => Promise<GeneralMQTTObjectType>)
  | ((idData: string, start: string) => Promise<GeneralMQTTObjectType>);

export async function handlerLastValueRequest(
  request: Request,
  params: { id?: string } = {},
  lastAction: LastValueAction
) {
  const id = params.id ?? "";
  const url = new URL(request.url);
  const pathname = url.pathname;

  const start = url.searchParams.get("start");

  if (!start) {
    return NextResponse.json({ error: "Falta el parámetro obligatorio: start" }, { status: 400 });
  }
  const parsedStart = new Date(start);
  if (isNaN(parsedStart.getTime())) {
    return NextResponse.json({ error: "El parámetro 'start' no es una fecha válida" }, { status: 400 });
  }

  const idPathname = removeLastValueOfUrl(pathname);
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

  try {
    const lastValue = expectsId
      ? await (lastAction as (id: string, start: string) => Promise<GeneralMQTTObjectType>)(idData!, start)
      : await (lastAction as (start: string) => Promise<GeneralMQTTObjectType>)(start);

    if (!lastValue) {
      return NextResponse.json({ error: error404 }, { status: 404 });
    }

    return NextResponse.json({ ...lastValue }, { status: 200 });
  } catch (error) {
    console.error("Error en GET:", error);

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
