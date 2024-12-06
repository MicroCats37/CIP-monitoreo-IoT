import { queryApi } from "../influxConfig";

interface Alarm {
  voltage: number;
  current: number;
  frequency: number;
  custom_locked_rotor_current: number;
  normal_phase_reserval: boolean;
  phase_loss_l1: boolean;
  phase_loss_l2: boolean;
  phase_loss_l3: boolean;
  lock_rotor_current: boolean;
  fail_to_start: boolean;
  transfer_switch_trouble: boolean;
  power_loss: boolean;
  service_required: boolean;
  undercurrent: boolean;
  overcurrent: boolean;
  undervoltage: boolean;
  overvoltage: boolean;
  phase_unbalanced: boolean;
  weekly_test_cut_in_not_reached: boolean;
  weekly_test_check_solenoid_valve: boolean;
  faulty_pressure_transducer: boolean;
  overpressure: boolean;
  underpressure: boolean;
  low_suction_pressure: boolean;
  flow_start: boolean;
  alternate_phase_reversal: boolean;
  alternate_isolating_switch_open: boolean;
  alternate_circuit_breaker_tripped: boolean;
  io_electric_board_communication_loss: boolean;
  io_transfer_switch_board_comm_loss: boolean;
  weekly_test_required: boolean;
  alternate_lock_rotor_current: boolean;
  low_ambient_temperature_internal_sensor: boolean;
  high_ambient_temperature_internal_sensor: boolean;
  control_voltage_not_healthy: boolean;
  soft_starter_fault: boolean;
}

export interface AlarmData {
  data: Alarm; // Ahora data es un único objeto, no un array.
  time: string; // Tiempo global de la última consulta.
}

export const getAlarmsData = async (): Promise<AlarmData> => {
  const fluxQuery = `
    from(bucket: "Sistema Contra Incendios")
    |> range(start: -30m)
    |> filter(fn: (r) => r["_measurement"] == "SCI")
    |> filter(fn: (r) =>
      r["_field"] == "voltage" or
      r["_field"] == "current" or
      r["_field"] == "frequency" or
      r["_field"] == "custom_locked_rotor_current" or
      r["_field"] == "normal_phase_reserval" or
      r["_field"] == "phase_loss_l1" or
      r["_field"] == "phase_loss_l2" or
      r["_field"] == "phase_loss_l3" or
      r["_field"] == "lock_rotor_current" or
      r["_field"] == "fail_to_start" or
      r["_field"] == "transfer_switch_trouble" or
      r["_field"] == "power_loss" or
      r["_field"] == "service_required" or
      r["_field"] == "undercurrent" or
      r["_field"] == "overcurrent" or
      r["_field"] == "undervoltage" or
      r["_field"] == "overvoltage" or
      r["_field"] == "phase_unbalanced" or
      r["_field"] == "weekly_test_cut_in_not_reached" or
      r["_field"] == "weekly_test_check_solenoid_valve" or
      r["_field"] == "faulty_pressure_transducer" or
      r["_field"] == "overpressure" or
      r["_field"] == "underpressure" or
      r["_field"] == "low_suction_pressure" or
      r["_field"] == "flow_start" or
      r["_field"] == "alternate_phase_reversal" or
      r["_field"] == "alternate_isolating_switch_open" or
      r["_field"] == "alternate_circuit_breaker_tripped" or
      r["_field"] == "io_electric_board_communication_loss" or
      r["_field"] == "io_transfer_switch_board_comm_loss" or
      r["_field"] == "weekly_test_required" or
      r["_field"] == "alternate_lock_rotor_current" or
      r["_field"] == "low_ambient_temperature_internal_sensor" or
      r["_field"] == "high_ambient_temperature_internal_sensor" or
      r["_field"] == "control_voltage_not_healthy" or
      r["_field"] == "soft_starter_fault"
    )
    |> last()
    |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> yield(name: "last")
  `;

  const rows: AlarmData = {
    data: {} as Alarm, // Se inicializa como un objeto vacío con el tipo `Alarm`.
    time: "",
  };

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const record = tableMeta.toObject(values);

    if (!rows.time) {
      rows.time = record._time; // Asigna el timestamp global.
    }

    rows.data = {
      voltage: record.voltage,
      current: record.current,
      frequency: record.frequency,
      custom_locked_rotor_current: record.custom_locked_rotor_current,
      normal_phase_reserval: (record.normal_phase_reserval),
      phase_loss_l1: (record.phase_loss_l1),
      phase_loss_l2: (record.phase_loss_l2),
      phase_loss_l3: (record.phase_loss_l3),
      lock_rotor_current: (record.lock_rotor_current),
      fail_to_start: (record.fail_to_start),
      transfer_switch_trouble: (record.transfer_switch_trouble),
      power_loss: (record.power_loss),
      service_required: (record.service_required),
      undercurrent: (record.undercurrent),
      overcurrent: (record.overcurrent),
      undervoltage: (record.undervoltage),
      overvoltage: (record.overvoltage),
      phase_unbalanced: (record.phase_unbalanced),
      weekly_test_cut_in_not_reached: (record.weekly_test_cut_in_not_reached),
      weekly_test_check_solenoid_valve: (record.weekly_test_check_solenoid_valve),
      faulty_pressure_transducer: (record.faulty_pressure_transducer),
      overpressure: (record.overpressure),
      underpressure: (record.underpressure),
      low_suction_pressure: (record.low_suction_pressure),
      flow_start: (record.flow_start),
      alternate_phase_reversal: (record.alternate_phase_reversal),
      alternate_isolating_switch_open: (record.alternate_isolating_switch_open),
      alternate_circuit_breaker_tripped: (record.alternate_circuit_breaker_tripped),
      io_electric_board_communication_loss: (record.io_electric_board_communication_loss),
      io_transfer_switch_board_comm_loss: (record.io_transfer_switch_board_comm_loss),
      weekly_test_required: (record.weekly_test_required),
      alternate_lock_rotor_current: (record.alternate_lock_rotor_current),
      low_ambient_temperature_internal_sensor: (record.low_ambient_temperature_internal_sensor),
      high_ambient_temperature_internal_sensor: (record.high_ambient_temperature_internal_sensor),
      control_voltage_not_healthy: (record.control_voltage_not_healthy),
      soft_starter_fault: (record.soft_starter_fault),
    };
  }

  return rows; // Devuelve los datos procesados.
};
