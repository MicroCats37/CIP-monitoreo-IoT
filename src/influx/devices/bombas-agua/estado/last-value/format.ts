import { bombasDeAguaEstadoSchema, BombasDeAguaEstadoType } from "@/validators/devices/schemas";

// Type guard genérico
function isEstadoRecord(record: Record<string, unknown>): record is {
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

export const formatterBombasEstado = (
  rawRecords: Array<Record<string, unknown>>
): BombasDeAguaEstadoType => {
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
    if (!isEstadoRecord(record)) continue;

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

    // Actualizar tiempo si es más reciente
    if (new Date(isoTime) > new Date(groupedBySensor[sensor].time)) {
      groupedBySensor[sensor].time = isoTime;
    }
  }

  const details = Object.values(groupedBySensor).map(({ name, time, fields }) => {
    if (Object.keys(fields).length === 0) {
      throw new Error(`Sensor "${name}" no contiene ningún campo válido.`);
    }

    return {
      data: {
        sensor: { name },
        fields
      },
      time
    };
  });

  if (details.length === 0) {
    throw new Error("No se encontraron datos útiles en los registros.");
  }

  const result: BombasDeAguaEstadoType = {
    device: {
      name: `${measurementName}`
    },
    details
  };

  return bombasDeAguaEstadoSchema.parse(result);
};
