import { z } from "zod";
import {
  sistemaContraIncendiosSchema,
  SistemaContraIncendiosType,
} from "@/validators/devices/schemas";

// Type guard para filas SCI (usa 'name' en vez de 'sensor')
function isSCIRecord(record: Record<string, unknown>): record is {
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

export const formatterSistemaContraIncendios = (
  rawRecords: Array<Record<string, unknown>>
): SistemaContraIncendiosType => {
  const grouped: Record<
    string,
    {
      name: string;
      fields: Partial<Record<string, number>>;
      latestISOTime: string;
      measurement: string;
    }
  > = {};

  for (const record of rawRecords) {
    if (!isSCIRecord(record)) continue;

    const { name, _field, _value, _time, _measurement } = record;
    const isoTime = new Date(_time).toISOString();

    if (!grouped[name]) {
      grouped[name] = {
        name,
        fields: {},
        latestISOTime: isoTime,
        measurement: _measurement,
      };
    }

    if (isoTime > grouped[name].latestISOTime) {
      grouped[name].latestISOTime = isoTime;
    }

    grouped[name].fields[_field] = _value;
  }

  const sensors = Object.values(grouped);
  if (sensors.length === 0) {
    throw new Error("formatterSCI: no se encontraron registros válidos SCI");
  }

  const chosen = sensors.reduce((acc, cur) =>
    cur.latestISOTime > acc.latestISOTime ? cur : acc
  );

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
  ]);

  const dataFields = chosen.fields;

  // fields conocidos
  const fieldsObject: Record<string, number | unknown> = {};
  for (const k of Array.from(knownFields)) {
    if (Object.prototype.hasOwnProperty.call(dataFields, k)) {
      const v = dataFields[k];
      if (typeof v === "number") fieldsObject[k] = v;
    }
  }

  // desconocidos -> alarms (si no hay, quedará [])
  const alarms = Object.entries(dataFields)
    .filter(([k]) => !knownFields.has(k))
    .map(([label, value]) => ({
      label,
      value: typeof value === "number" ? value : 0,
    }));

  // ✅ siempre presente, aunque vacío
  (fieldsObject as any).alarms = alarms;

  const result: SistemaContraIncendiosType = {
    device: {
      name: chosen.measurement,
    },
    details: {
      data: {
        sensor: { name: chosen.name },
        fields: fieldsObject as {
          voltage?: number;
          current?: number;
          frequency?: number;
          custom_locked_rotor_current?: number;
          line_voltage_l12?: number;
          line_voltage_l23?: number;
          line_voltage_l31?: number;
          current_l1?: number;
          current_l2?: number;
          current_l3?: number;
          system_pressure?: number;
          suction_pressure?: number;
          start_count?: number;
          run_time?: number;
          hours_since_last_run?: number;
          cut_in?: number;
          cut_out?: number;
          alarms: Array<{ label: string; value: number }>; // <- no optional aquí en TS local
        },
      },
      time: chosen.latestISOTime,
    },
  };

  return sistemaContraIncendiosSchema.parse(result);
};
