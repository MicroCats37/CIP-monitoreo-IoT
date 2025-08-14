import { bombasDeAguaVariadoresSchema, BombasDeAguaVariadoresType } from "@/validators/devices/schemas";

// Type guard básico
function isVariadorRecord(record: Record<string, unknown>): record is {
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

export const formatterBombasVariadores = (
  rawRecords: Array<Record<string, unknown>>
): BombasDeAguaVariadoresType => {
  const groupedBySensor: Record<
    string,
    {
      name: string;
      time: string;
      fields: Record<string, unknown>;
    }
  > = {};

  let measurementName: string | null = null;

  for (const record of rawRecords) {
    if (!isVariadorRecord(record)) continue;

    const { name: sensor, _field: field, _value: value, _time, _measurement } = record;
    const isoTime = new Date(_time).toISOString();

    if (!measurementName) {
      measurementName = _measurement;
    }

    if (!groupedBySensor[sensor]) {
      groupedBySensor[sensor] = {
        name: sensor,
        time: isoTime,
        fields: {}
      };
    }

    groupedBySensor[sensor].fields[field] = value;

    // Si es más reciente, actualiza el tiempo
    if (new Date(isoTime) > new Date(groupedBySensor[sensor].time)) {
      groupedBySensor[sensor].time = isoTime;
    }
  }

  // Generar details sin validar los campos internos
  const details = Object.values(groupedBySensor).map(({ name, time, fields }) => ({
    data: {
      sensor: { name },
      fields
    },
    time
  }));

  if (details.length === 0) {
    throw new Error("No se encontraron datos útiles de variadores.");
  }

  const result: BombasDeAguaVariadoresType = {
    device: {
      name: `${measurementName}`
    },
    details
  };

  return bombasDeAguaVariadoresSchema.parse(result);
};
