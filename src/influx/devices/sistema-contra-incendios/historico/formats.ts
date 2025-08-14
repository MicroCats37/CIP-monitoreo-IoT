import {
  sistemaContraIncendiosHistoricalSchema,
  SistemaContraIncendiosHistoricalType,
} from "@/validators/devices/schemas";

// Type guard: usa 'name' (no 'sensor')
function isSCIHistoricalRecord(record: Record<string, unknown>): record is {
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

export const formatterSistemaContraIncendiosHistorical = (
  rawRecords: Array<Record<string, unknown>>
): SistemaContraIncendiosHistoricalType => {
  // Campos permitidos por el schema
  const knownFields = new Set<string>([
    "voltage",
    "current",
    "frequency",
    "custom_locked_rotor_current",
    "line_voltage_l12",
    "line_voltage_l23",
    "line_voltage_l31",
    "current_l1",
    "current_l2",
    "current_l3",
    "system_pressure",
    "suction_pressure",
    "start_count",
    "run_time",
    "hours_since_last_run",
    "cut_in",
    "cut_out",
    "alarms_count",
  ]);

  // Agrupar por (sensor name + time) como en el formatter de aire unit
  const groupedByTimeAndSensor: Record<
    string,
    {
      data: {
        sensor: { name: string };
        fields: Record<string, number>;
      };
      time: string;
      measurement: string;
    }
  > = {};

  let measurementName: string | null = null;

  for (const record of rawRecords) {
    if (!isSCIHistoricalRecord(record)) continue;

    const { name, _field, _value, _time, _measurement } = record;
    const isoTime = new Date(_time).toISOString();
    const key = `${name}-${isoTime}`; // agrupa por sensor + tiempo

    if (!measurementName) measurementName = _measurement;

    if (!groupedByTimeAndSensor[key]) {
      groupedByTimeAndSensor[key] = {
        data: {
          sensor: { name },
          fields: {},
        },
        time: isoTime,
        measurement: _measurement,
      };
    }

    // Solo incluir campos definidos en el schema
    if (knownFields.has(_field)) {
      groupedByTimeAndSensor[key].data.fields[_field] = _value;
    }
  }

  const details = Object.values(groupedByTimeAndSensor)
    // ordena por sensor y luego por tiempo (opcional)
    .sort((a, b) =>
      a.data.sensor.name === b.data.sensor.name
        ? a.time.localeCompare(b.time)
        : a.data.sensor.name.localeCompare(b.data.sensor.name)
    )
    .map(({ data, time }) => ({ data, time }));

  const result: SistemaContraIncendiosHistoricalType = {
    device: {
      name: measurementName!
    },
    details,
  };

  return sistemaContraIncendiosHistoricalSchema.parse(result);
};
