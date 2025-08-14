import {
  aireAcondicionadoSchema,
  AireAcondicionadoType,
} from "@/validators/devices/schemas";

// Type guard
function isAireAcondicionadoRecord(record: Record<string, unknown>): record is {
  sensor: string;
  _time: string;
  _field: string;
  _value: number;
  _measurement: string;
  id: string;
  bus: string;
  alias: string;
} {
  return (
    typeof record.sensor === "string" &&
    typeof record._time === "string" &&
    typeof record._field === "string" &&
    typeof record._value === "number" &&
    typeof record._measurement === "string" &&
    typeof record.id === "string" &&
    typeof record.bus === "string" &&
    typeof record.alias === "string"
  );
}

export const formatterAireAcondicionado = (
  rawRecords: Array<Record<string, unknown>>
): AireAcondicionadoType => {
  const grouped: Record<string, {
    sensor: string;
    id: string;
    bus: string;
    alias: string;
    fields: Partial<Record<string, number>>;
    time: string;
  }> = {};

  let globalTime = "";
  let name
  for (const record of rawRecords) {
    if (!isAireAcondicionadoRecord(record)) continue;

    const {
      sensor,
      _field,
      _value,
      _time,
      id,
      bus,
      alias,
      _measurement,
    } = record;
    name=_measurement
    const isoTime = new Date(_time).toISOString();
    if (isoTime > globalTime) {
      globalTime = isoTime;
    }

    if (!grouped[sensor]) {
      grouped[sensor] = {
        sensor,
        id,
        bus,
        alias,
        fields: {},
        time: isoTime,
      };
    }

    grouped[sensor].fields[_field] = _value;
  }

  const knownFields = new Set([
    "status",
    "alarm",
    "temperature_setting",
    "temperature_indoor",
  ]);

  const data = Object.values(grouped)
    .map(entry => {
      const { sensor, id, bus, alias, fields } = entry;

      const parsedFields = {
        id,
        bus,
        alias,
        status: fields["status"]!,
        alarm: fields["alarm"]!,
        temperature_setting: fields["temperature_setting"]!,
        temperature_indoor: fields["temperature_indoor"]!,
        errors: Object.entries(fields)
          .filter(([k]) => !knownFields.has(k))
          .map(([label, value]) => ({
            label,
            value: value ?? 0,
          })),
      };

      return {
        sensor: { name: sensor },
        fields: parsedFields,
      };
    })
    .sort((a, b) => Number(a.fields.id) - Number(b.fields.id)); // 🔷 Orden por ID

  const result: AireAcondicionadoType = {
    device: {
      name: name!,
    },
    details: {
      data,
      time: globalTime,
    },
  };

  return aireAcondicionadoSchema.parse(result);
};
