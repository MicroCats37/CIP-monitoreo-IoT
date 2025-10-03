import { ZodSchema } from "zod";

//import { NotFoundError } from "@/utils/errors";
import { influxQueryApi } from "@/influx/influxConfig";

/**
 * Servicio general para ejecutar una consulta Flux, formatear y validar el resultado completo.
 *
 * @template T - Tipo del resultado tras validación.
 * @param query              Consulta Flux a ejecutar.
 * @param formatter          Función que transforma los registros brutos en un objeto compatible con el schema.
 * @param schema             ZodSchema para validar el resultado formateado.
 * @returns Array con el resultado validado de tipo T.
 * @throws Error si falla la validación de Zod.
 * 
 * 
 */


function formatFechaLegible(fechaISO: string): string {
  return new Date(fechaISO).toLocaleString("es-ES", {
    dateStyle: "short",
    timeStyle: "medium",
  });
}
export async function GeneralService<T>(
  start: string,
  stop: string,
  query: string,
  formatter: (rawRecords: Array<Record<string, unknown>>) => T,
  schema: ZodSchema<T>,
): Promise<T> {
  const fluxQuery = query;
  const rawRecords: Array<Record<string, unknown>> = [];
  // 1. Primero recolectamos TODOS los registros
  for await (const { values, tableMeta } of influxQueryApi.iterateRows(fluxQuery)) {
    rawRecords.push(tableMeta.toObject(values));
  }

  if (rawRecords.length === 0) {
    throw new Error(
      `No se encontraron registros entre ${formatFechaLegible(start)} y ${formatFechaLegible(stop)}`
    );
  }

  // 2. Enviamos TODOS los registros al formateador
  const formattedRecord = formatter(rawRecords);

  // 3. Validamos el resultado
  const validation = schema.safeParse(formattedRecord);
  if (!validation.success) {
    console.error("Zod validation error:", validation.error.format());
    throw new Error(
      `Error de validación: ${JSON.stringify(validation.error.errors)}`
    );
  }

  return validation.data; // Retornamos como array de un elemento
}

/*
import { ZodSchema } from "zod";
// import { HttpError } from "@influxdata/influxdb-client"; // opcional si quieres instanceof
import { influxQueryApi } from "@/influx/influxConfig";

function formatFechaLegible(fechaISO: string): string {
  return new Date(fechaISO).toLocaleString("es-ES", {
    dateStyle: "short",
    timeStyle: "medium",
  });
}

function extractInfluxError(e: any): string {
  // Ejemplos de formas comunes del error del cliente de Influx
  const status = e?.statusCode ?? e?.status ?? "";
  // body puede ser string o json
  let bodyMsg = "";
  const body = e?.body;
  if (typeof body === "string") {
    try {
      const parsed = JSON.parse(body);
      bodyMsg = parsed?.message ?? body;
    } catch {
      bodyMsg = body;
    }
  } else if (body && typeof body === "object") {
    bodyMsg = body?.message ?? JSON.stringify(body);
  }

  const msg = e?.message ?? "";
  const parts = [
    status && `status=${status}`,
    bodyMsg && `body="${bodyMsg}"`,
    msg && `msg="${msg}"`,
  ].filter(Boolean);

  return parts.length ? `Influx error: ${parts.join(" | ")}` : "Influx error desconocido";
}

export async function GeneralService<T>(
  start: string,
  stop: string,
  query: string,
  formatter: (rawRecords: Array<Record<string, unknown>>) => T,
  schema: ZodSchema<T>,
): Promise<T> {
  // Validaciones rápidas de rango
  if (!start || !stop) {
    throw new Error("Parámetros inválidos: 'start' y 'stop' son requeridos.");
  }
  if (new Date(start).getTime() >= new Date(stop).getTime()) {
    throw new Error(`Rango de tiempo inválido: start (${start}) debe ser < stop (${stop}).`);
  }

  const rawRecords: Array<Record<string, unknown>> = [];

  // Capturamos errores del iterador (parse Flux, bucket inexistente, auth, etc.)
  try {
    for await (const { values, tableMeta } of influxQueryApi.iterateRows(query)) {
      rawRecords.push(tableMeta.toObject(values));
    }
  } catch (e: any) {
    // Aquí tienes el error “real” de Influx
    const detalle = extractInfluxError(e);
    // Log técnico (server)
    console.error("GeneralService iterateRows error:", e);
    // Mensaje claro hacia arriba
    throw new Error(detalle);
  }

  // Caso “no hay filas” (no es error de Influx, solo sin datos para ese rango/filtros)
  if (rawRecords.length === 0) {
    // Si quieres distinguir “no hay datos” de “measurement inexistente”, Influx
    // no lanza error por measurement desconocida: simplemente retorna 0 filas.
    // El mensaje que das aquí debe reflejar eso.
    throw new Error(
      `Sin resultados en el rango ${formatFechaLegible(start)} – ${formatFechaLegible(stop)} (puede ser que no haya puntos para los filtros/measurement seleccionados).`
    );
  }

  // Formatear + validar
  const formatted = formatter(rawRecords);
  const validation = schema.safeParse(formatted);
  if (!validation.success) {
    console.error("Zod validation error:", validation.error.format());
    throw new Error(`Error de validación: ${JSON.stringify(validation.error.errors)}`);
  }

  return validation.data;
}
*/