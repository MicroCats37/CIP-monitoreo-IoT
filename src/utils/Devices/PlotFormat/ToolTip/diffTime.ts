type DateInput = string | number | Date;

/**
 * Retorna la resta entre dos fechas: stop - start (en milisegundos).
 * @param start  Fecha inicial (string ISO, timestamp o Date)
 * @param stop   Fecha final   (string ISO, timestamp o Date)
 * @param abs    true => valor absoluto | false => con signo (default: true)
 * @returns número en milisegundos, o NaN si alguna fecha es inválida
 */
export function diffTimeMs(
  start: DateInput,
  stop: DateInput,
): number {
  const t0 = new Date(start).getTime();
  const t1 = new Date(stop).getTime();
  if (Number.isNaN(t0) || Number.isNaN(t1)) return NaN;

  const diff = t1 - t0;
  return  Math.abs(diff);
}