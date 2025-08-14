import { ChartSeriesDataArray } from "@/validators/schemas";

export function getLastDefinedValueForField(
  series: ChartSeriesDataArray,
  field: string
): { value: number | string; timestamp: number } | null {
  for (let i = series.length - 1; i >= 0; i--) {
    const point = series[i];
    const value = point[field];

    if (value !== undefined) {
      return {
        value,
        timestamp: point.timestamp,
      };
    }
  }

  return null;
}