import { tablerosDeEnergiaSchema, TablerosDeEnergiaType } from "@/validators/devices/schemas";

// Type guard específico
function isTableroRecord(record: Record<string, unknown>): record is {
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

export const formatterTablerosEnergia = (
  rawRecords: Array<Record<string, unknown>>
): TablerosDeEnergiaType => {
  const grouped: Record<
    string,
    {
      name: string;
      time: string;
      fields: Record<string, number>;
    }
  > = {};

  let measurementName: string | null = null;

  for (const record of rawRecords) {
    if (!isTableroRecord(record)) continue;

    const { name, _time, _field, _value, _measurement } = record;
    const isoTime = new Date(_time).toISOString();

    if (!measurementName) measurementName = _measurement;

    if (!grouped[name]) {
      grouped[name] = {
        name,
        time: isoTime,
        fields: { [_field]: _value }
      };
    } else {
      // Si el nuevo timestamp es más reciente, reemplazamos
      if (new Date(isoTime) > new Date(grouped[name].time)) {
        grouped[name].time = isoTime;
        grouped[name].fields = { [_field]: _value };
      } else if (new Date(isoTime).getTime() === new Date(grouped[name].time).getTime()) {
        grouped[name].fields[_field] = _value;
      }
    }
  }

  const sensorNames = Object.keys(grouped);
  if (sensorNames.length === 0) {
    throw new Error("No se encontraron datos útiles de tableros.");
  }

  // Solo se permite un único sensor para este schema
  if (sensorNames.length > 1) {
    throw new Error("Se esperaba un único sensor para el valor más reciente.");
  }

  const { name, time, fields } = grouped[sensorNames[0]];

  const result: TablerosDeEnergiaType = {
    device: {
      name: measurementName ?? "Tableros de Energía"
    },
    details: {
      data: {
        sensor: { name },
        fields
      },
      time
    }
  };

  return tablerosDeEnergiaSchema.parse(result);
};
