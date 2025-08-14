
/**
 * Formatea `value` con base en la diferencia real entre `start` y `stop`,
 * manteniendo TUS formatos originales y extendiendo hasta 6 meses.
 *
 * - <= 8h:     dd/MM HH:mm
 * - <= 24h:    weekday dd/MM HH:mm
 * - <= 7d:     dd/MM/yy
 * - <= 30d:    dd/MM/yy
 * - <= 90d:    dd/MM/yy   (nuevo)
 * - <= 180d:   dd/MM/yy   (nuevo)
 * -  > 180d:   dd/MM/yy (puedes cambiar a dd/MM/yyyy si prefieres)
 */
export function formatDateTimeByRealRange(
  value: string | number | Date,
  start: string | number | Date,
  stop: string | number | Date,
  locale: string = "es-ES",
  // Sugerido para Perú:
  // timeZone = "America/Lima"
  timeZone?: string
): string {
  const t0 = new Date(start).getTime();
  const t1 = new Date(stop).getTime();
  if (Number.isNaN(t0) || Number.isNaN(t1) || t1 < t0) return "Rango inválido";

  return formatDateTimeByDiff(value, t1 - t0, locale, timeZone);
}

/**
 * Variante si ya tienes la diferencia en ms.
 * Mantiene exactamente los mismos formatos por umbral.
 */
export function formatDateTimeByDiff(
  value: string | number | Date,
  diffMs: number,
  locale: string = "es-ES",
  timeZone?: string
): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha inválida";
  if (!Number.isFinite(diffMs) || diffMs < 0) return "Rango inválido";

  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;

  const FMT = getFormatters(locale, timeZone);

  if (diffMs <= 8 * HOUR) {
    // dd/MM HH:mm
    return FMT.ddMM_HHmm.format(date);
  }

  if (diffMs <= 1 * DAY) {
    // weekday dd/MM HH:mm
    const weekday = FMT.weekday.format(date);
    const dayMonth = FMT.ddMM.format(date);
    const time = FMT.HHmm.format(date);
    return `${weekday} ${dayMonth} ${time}`;
  }

  if (diffMs <= 7 * DAY) return FMT.ddMMYY.format(date);
  if (diffMs <= 30 * DAY) return FMT.ddMMYY.format(date);
  if (diffMs <= 90 * DAY) return FMT.ddMMYY.format(date);   // nuevo rango
  if (diffMs <= 180 * DAY) return FMT.ddMMYY.format(date);  // nuevo rango

  // > 6 meses — mantengo tu formato corto por coherencia:
  return FMT.ddMMYY.format(date);
  // Si prefieres año completo para > 6m, usa:
  // return FMT.ddMMYYYY.format(date);
}

/* ====================== Helpers ====================== */

type FormatterBag = {
  ddMM: Intl.DateTimeFormat;
  HHmm: Intl.DateTimeFormat;
  ddMM_HHmm: Intl.DateTimeFormat;
  ddMMYY: Intl.DateTimeFormat;
  ddMMYYYY: Intl.DateTimeFormat;
  weekday: Intl.DateTimeFormat;
};

const _cache = new Map<string, FormatterBag>(); // clave: `${locale}|${timeZone ?? ""}`

function getFormatters(locale: string, timeZone?: string): FormatterBag {
  const key = `${locale}|${timeZone ?? ""}`;
  const cached = _cache.get(key);
  if (cached) return cached;

  const base = (opt: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, timeZone ? { timeZone, ...opt } : opt);

  const ddMM = base({ day: "2-digit", month: "2-digit" });
  const HHmm = base({ hour: "2-digit", minute: "2-digit", hour12: false });
  const ddMM_HHmm = base({
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const ddMMYY = base({ day: "2-digit", month: "2-digit", year: "2-digit" });
  const ddMMYYYY = base({ day: "2-digit", month: "2-digit", year: "numeric" });
  const weekday = base({ weekday: "long" });

  const bag = { ddMM, HHmm, ddMM_HHmm, ddMMYY, ddMMYYYY, weekday };
  _cache.set(key, bag);
  return bag;
}