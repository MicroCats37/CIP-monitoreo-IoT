import { concentracionCo2Schema, ConcentracionCo2Type } from "@/validators/devices/schemas";

// Type guard
function isCO2Record(record: Record<string, unknown>): record is {
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

export const formatterConcentracionCo2 = (
  rawRecords: Array<Record<string, unknown>>
): ConcentracionCo2Type => {
  const groupedBySensor: Record<
    string,
    {
      name: string;
      time: string;                         // último time por sensor
      fields: Record<string, number>;       // todos los _field vistos (p. ej. "co2")
    }
  > = {};

  let measurementName: string | undefined;

  for (const record of rawRecords) {
    if (!isCO2Record(record)) continue;

    const { _measurement, name: sensor, _field: field, _value: value, _time } = record;
    const isoTime = new Date(_time).toISOString();

    if (!groupedBySensor[sensor]) {
      groupedBySensor[sensor] = {
        name: sensor,
        time: isoTime,
        fields: {},
      };
    }

    // guardar measurement (el primero vale; suelen ser todos iguales)
    if (!measurementName) measurementName = _measurement;

    // setear field/value
    groupedBySensor[sensor].fields[field] = value;

    // mantener el último time
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
        fields,
      },
      time,
    };
  });

  if (details.length === 0) {
    throw new Error("No se encontraron datos útiles para concentración de CO2.");
  }

  const result: ConcentracionCo2Type = {
    device: {
      name: measurementName!
    },
    details,
  };

  return concentracionCo2Schema.parse(result);
};
