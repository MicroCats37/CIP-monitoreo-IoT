import {
  aireAcondicionadoUnitHistoricalSchema,
  AireAcondicionadoUnitHistoricalType,
} from "@/validators/devices/schemas";

function isAireRecord(record: Record<string, unknown>): record is {
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

export const formatterAireAcondicionadoUnitHistorical = (
  rawRecords: Array<Record<string, unknown>>
): AireAcondicionadoUnitHistoricalType => {
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
    if (!isAireRecord(record)) continue;

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
    const isoTime = new Date(_time).toISOString();
    const key = `${sensor}-${isoTime}`; // agrupamos por sensor + tiempo

    if (!measurementName) measurementName = _measurement;

    if (!groupedByTimeAndSensor[key]) {
      groupedByTimeAndSensor[key] = {
        data: {
          sensor: { name: sensor },
          fields: {},
        },
        time: isoTime,
      };
    }

    groupedByTimeAndSensor[key].data.fields[_field] = _value;
  }

  const detailsArray = Object.values(groupedByTimeAndSensor);

  const result: AireAcondicionadoUnitHistoricalType = {
    device: {
      name: `${measurementName}`,
    },
    details: detailsArray,
  };

  return aireAcondicionadoUnitHistoricalSchema.parse(result);
};
