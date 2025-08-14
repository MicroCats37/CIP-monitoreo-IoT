export function getAggregateWindowClause(start: string, stop: string, fn?: string): string {
  const startTime = new Date(start).getTime();
  const stopTime = new Date(stop).getTime();

  if (Number.isNaN(startTime) || Number.isNaN(stopTime) || stopTime <= startTime) {
    return ""; // rango inválido
  }

  const diffMinutes = (stopTime - startTime) / 1000 / 60;

  // Para rangos muy cortos no agregamos (conserva tu criterio original)
  if (diffMinutes < 90) return "";

  // Elegir la granularidad
  // Referencias:
  // <= 8h      -> 5m
  // <= 24h     -> 15m
  // <= 7d      -> 1h
  // <= 30d     -> 3h
  // <= 90d     -> 6h
  // <= 180d    -> 12h   (6 meses aprox)
  //  > 180d    -> 1d    (por si acaso se excede)
  //const MIN = 1;
  const HOUR = 60;
  const DAY = 24 * HOUR;

  let windowPeriod = "1m"; // default (no se usa por <90m, pero inicializamos)

  if (diffMinutes <= 8 * HOUR)            windowPeriod = "5m";
  else if (diffMinutes <= 24 * HOUR)      windowPeriod = "15m";
  else if (diffMinutes <= 7 * DAY)        windowPeriod = "1h";
  else if (diffMinutes <= 30 * DAY)       windowPeriod = "3h";
  else if (diffMinutes <= 90 * DAY)       windowPeriod = "6h";
  else if (diffMinutes <= 180 * DAY)      windowPeriod = "12h";
  else                                     windowPeriod = "1d";

  const aggFn = fn ?? "mean";
  return `|> aggregateWindow(every: ${windowPeriod}, fn: ${aggFn}, createEmpty: false)`;
}

