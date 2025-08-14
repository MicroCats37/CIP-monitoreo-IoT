import {
  concentracionCo2HistoricalSchema,
  type ConcentracionCo2HistoricalType,
} from "@/validators/devices/schemas";

// Validador básico por registro
function isCo2Record(record: Record<string, unknown>): record is {
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

export const formatterConcentracionCo2Historical = (
  rawRecords: Array<Record<string, unknown>>
): ConcentracionCo2HistoricalType => {
  const groupedBySensor: Record<
    string,
    Array<{
      data: {
        sensor: { name: string };
        fields: Record<string, number>;
      };
      time: string;
    }>
  > = {};

  let measurementName: string | null = null;

  for (const record of rawRecords) {
    if (!isCo2Record(record)) continue;

    const { name, _time, _field, _value, _measurement } = record;
    const isoTime = new Date(_time).toISOString();

    if (!measurementName) measurementName = _measurement;

    if (!groupedBySensor[name]) {
      groupedBySensor[name] = [];
    }

    // Buscar si ya hay un bloque en ese timestamp
    let entry = groupedBySensor[name].find((e) => e.time === isoTime);
    if (!entry) {
      entry = {
        data: {
          sensor: { name },
          fields: {},
        },
        time: isoTime,
      };
      groupedBySensor[name].push(entry);
    }

    // Asignar el campo dinámicamente
    entry.data.fields[_field] = _value;
  }

  const details = Object.values(groupedBySensor);

  const result: ConcentracionCo2HistoricalType = {
    device: {
      name: measurementName!,
    },
    details,
  };

  return concentracionCo2HistoricalSchema.parse(result);
};
