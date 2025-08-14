import { concentracionCloroSchema, ConcentracionCloroType } from "@/validators/devices/schemas";

// Type guard genérico
function isCloroRecord(record: Record<string, unknown>): record is {
  name: string;
  _time: string;
  _field: string;
  _value: number;
  _measurement : string
} {
  return (
    typeof record.name === "string" &&
    typeof record._time === "string" &&
    typeof record._field === "string" &&
    typeof record._value === "number" &&
    typeof record._measurement === "string"
  );
}

export const formatterConcentracionCloro = (
  rawRecords: Array<Record<string, unknown>>
): ConcentracionCloroType => {
  const groupedBySensor: Record<
    string,
    {
      name: string;
      time: string;
      fields: Record<string, unknown>;
    }
  > = {};
  let name 
  for (const record of rawRecords) {
    if (!isCloroRecord(record)) continue;
    const { _measurement,name: sensor, _field: field, _value: value, _time } = record;
    const isoTime = new Date(_time).toISOString();

    if (!groupedBySensor[sensor]) {
      groupedBySensor[sensor] = {
        name: sensor,
        time: isoTime,
        fields: {}
      };
    }
    name=_measurement
    groupedBySensor[sensor].fields[field] = value;

    if (new Date(isoTime) > new Date(groupedBySensor[sensor].time)) {
      groupedBySensor[sensor].time = isoTime;
    }
  }

  const details = Object.values(groupedBySensor).map(({ name, time, fields }) => {
    if (Object.keys(fields).length === 0) {
      throw new Error(`Sensor "${name}" no contiene campos válidos.`);
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
    throw new Error("No se encontraron datos útiles para concentración de cloro.");
  }

  const result: ConcentracionCloroType = {
    device: {
      name: name!
    },
    details
  };

  return concentracionCloroSchema.parse(result);
};
