import {
  estacionamientoSchema,
  EstacionamientoType,
} from "@/validators/devices/schemas";

// Type guard
function isEstacionamientoRecord(record: Record<string, unknown>): record is {
  name: string;
  _time: string;
  _field: string;
  _value: string;
  _measurement: string;
} {
  return (
    typeof record.name === "string" &&
    typeof record._time === "string" &&
    typeof record._field === "string" &&
    typeof record._value === "string" &&
    typeof record._measurement === "string"
  );
}

export const formatterEstacionamientos = (
  rawRecords: Array<Record<string, unknown>>
): EstacionamientoType => {
  const groupedBySensor: Record<
    string,
    { fields: Record<string, string>; time: string }
  > = {};

  let measurementName = "";

  for (const record of rawRecords) {
    if (!isEstacionamientoRecord(record)) continue;

    const { name, _field, _value, _time, _measurement } = record;
    const isoTime = new Date(_time).toISOString();

    if (!groupedBySensor[name]) {
      groupedBySensor[name] = {
        fields: {},
        time: isoTime,
      };
    }

    groupedBySensor[name].fields[_field] = _value;

    if (isoTime > groupedBySensor[name].time) {
      groupedBySensor[name].time = isoTime;
    }

    measurementName = _measurement;
  }

  const details = Object.entries(groupedBySensor).map(([sensorName, { fields, time }]) => {
    const sortedFields = Object.keys(fields)
      .sort((a, b) => {
        const numA = parseInt(a.replace("E", ""), 10);
        const numB = parseInt(b.replace("E", ""), 10);
        return numA - numB;
      })
      .reduce((acc, key) => {
        acc[key] = fields[key];
        return acc;
      }, {} as Record<string, string>);

    return {
      data: {
        sensor: { name: sensorName },
        fields: sortedFields,
      },
      time,
    };
  });

  const result: EstacionamientoType = {
    device: {
      name: measurementName,
    },
    details,
  };

  return estacionamientoSchema.parse(result);
};
