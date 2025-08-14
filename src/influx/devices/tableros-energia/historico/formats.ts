// format.ts
import {
  tablerosDeEnergiaHistoricalSchema,
  TablerosDeEnergiaHistoricalType,
} from "@/validators/devices/schemas";

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

export const formatterTablerosEnergiaHistorical = (
  rawRecords: Array<Record<string, unknown>>
): TablerosDeEnergiaHistoricalType => {
  const groupedByTimeAndSensor: Record<
    string,
    {
      data: {
        sensor: { name: string };
        fields: Record<string, number>;
      };
      time: string;
    }
  > = {};

  let measurementName: string | null = null;

  for (const record of rawRecords) {
    if (!isTableroRecord(record)) continue;

    const { name, _time, _field, _value, _measurement } = record;
    const isoTime = new Date(_time).toISOString();
    const key = `${name}-${isoTime}`; // agrupamos por sensor + tiempo

    if (!measurementName) measurementName = _measurement;

    if (!groupedByTimeAndSensor[key]) {
      groupedByTimeAndSensor[key] = {
        data: {
          sensor: { name },
          fields: {},
        },
        time: isoTime,
      };
    }

    groupedByTimeAndSensor[key].data.fields[_field] = _value;
  }

  const detailsArray = Object.values(groupedByTimeAndSensor);

  const result: TablerosDeEnergiaHistoricalType = {
    device: {
      name: `${measurementName}`,
    },
    details: detailsArray,
  };

  return tablerosDeEnergiaHistoricalSchema.parse(result);
};
