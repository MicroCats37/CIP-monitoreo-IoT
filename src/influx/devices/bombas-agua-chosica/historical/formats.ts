
import { bombasDeAguaChosicaHistoricalSchema, BombasDeAguaChosicaHistoricalType } from "@/validators/devices/schemas";

// Type guard
function isChosicaRecord(record: Record<string, unknown>): record is {
  name: string;
  _time: string;
  _field: string;
  _value: number;
  _measurement: string;
} {
  return (
    typeof record.name === "string" &&
    typeof record._time === "string" &&
    typeof record._field === "string" &&
    typeof record._value === "number" &&
    typeof record._measurement === "string"
  );
}

export function formatterBombasChosicaHistorical(
  rawRecords: Array<Record<string, unknown>>
): BombasDeAguaChosicaHistoricalType {
  const groupedBySensor: Record<string, Array<{
    data: {
      sensor: { name: string };
      fields: Record<string, unknown>;
    };
    time: string;
  }>> = {};

  let measurementName: string | null = null;

  for (const record of rawRecords) {
    if (!isChosicaRecord(record)) continue;

    const { name: sensor, _field: field, _value: value, _time, _measurement } = record;
    const isoTime = new Date(_time).toISOString();

    if (!measurementName) {
      measurementName = _measurement;
    }

    if (!groupedBySensor[sensor]) {
      groupedBySensor[sensor] = [];
    }

    groupedBySensor[sensor].push({
      data: {
        sensor: { name: sensor },
        fields: { [field]: value }
      },
      time: isoTime
    });
  }

  const details = Object.values(groupedBySensor);
  if (details.length === 0) {
    throw new Error("No se encontraron datos válidos para Bombas de Agua - Chosica (histórico).");
  }

  const result: BombasDeAguaChosicaHistoricalType = {
    device: {
      name: `${measurementName}`
    },
    details
  };

  return bombasDeAguaChosicaHistoricalSchema.parse(result);
}
