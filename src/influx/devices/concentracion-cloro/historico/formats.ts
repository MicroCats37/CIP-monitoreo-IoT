import { concentracionCloroHistoricalSchema, ConcentracionCloroHistoricalType } from "@/validators/devices/schemas";


function isCloroRecord(record: Record<string, unknown>): record is {
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

export const formatterConcentracionCloroHistorical = (
  rawRecords: Array<Record<string, unknown>>
): ConcentracionCloroHistoricalType => {
  const groupedBySensor: Record<string, Array<{
    data: {
      sensor: { name: string };
      fields: Record<string, number>;
    };
    time: string;
  }>> = {};

  let measurementName: string | null = null;

  for (const record of rawRecords) {
    if (!isCloroRecord(record)) continue;

    const { name, _time, _field, _value, _measurement } = record;
    const isoTime = new Date(_time).toISOString();

    if (!measurementName) measurementName = _measurement;

    if (!groupedBySensor[name]) groupedBySensor[name] = [];

    let entry = groupedBySensor[name].find(e => e.time === isoTime);
    if (!entry) {
      entry = {
        data: {
          sensor: { name },
          fields: {}
        },
        time: isoTime
      };
      groupedBySensor[name].push(entry);
    }

    entry.data.fields[_field] = _value;
  }

  const details = Object.values(groupedBySensor);

  const result: ConcentracionCloroHistoricalType = {
    device: {
      name: `${measurementName}`
    },
    details
  };

  return concentracionCloroHistoricalSchema.parse(result);
};
