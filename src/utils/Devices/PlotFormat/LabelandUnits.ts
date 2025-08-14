const SCILabel: Record<string, string> = {
  voltage: "Voltaje",
  current: "Corriente",
  frequency: "Frecuencia",
  custom_locked_rotor_current: "Corriente rotor bloqueado (custom)",
  normal_phase_reserval: "Inversión de fase normal",
  phase_loss_l1: "Pérdida de fase L1",
  phase_loss_l2: "Pérdida de fase L2",
  phase_loss_l3: "Pérdida de fase L3",
  lock_rotor_current: "Rotor bloqueado",
  fail_to_start: "Falla al arrancar",
  transfer_switch_trouble: "Falla en conmutador de transferencia",
  power_loss: "Pérdida de energía",
  service_required: "Servicio requerido",
  undercurrent: "Subcorriente",
  overcurrent: "Sobrecorriente",
  undervoltage: "Subvoltaje",
  overvoltage: "Sobrevoltaje",
  phase_unbalanced: "Fase desequilibrada",
  weekly_test_cut_in_not_reached: "No se alcanzó presión en prueba semanal",
  weekly_test_check_solenoid_valve: "Revisar válvula solenoide (prueba semanal)",
  faulty_pressure_transducer: "Transductor de presión defectuoso",
  overpressure: "Sobrepresión",
  underpressure: "Baja presión",
  low_suction_pressure: "Presión baja de succión",
  flow_start: "Inicio de flujo",
  alternate_phase_reversal: "Inversión de fase alterna",
  alternate_isolating_switch_open: "Interruptor aislante alterno abierto",
  alternate_circuit_breaker_tripped: "Disyuntor alterno disparado",
  io_electric_board_communication_loss: "Pérdida de comunicación - tablero eléctrico",
  io_transfer_switch_board_comm_loss: "Pérdida de comunicación - tablero de transferencia",
  weekly_test_required: "Prueba semanal requerida",
  alternate_lock_rotor_current: "Rotor bloqueado (alterno)",
  low_ambient_temperature_internal_sensor: "Temperatura ambiente baja (sensor interno)",
  high_ambient_temperature_internal_sensor: "Temperatura ambiente alta (sensor interno)",
  control_voltage_not_healthy: "Voltaje de control inestable",
  soft_starter_fault: "Falla en arrancador suave",
  motor_trouble: "Falla de motor",
  pump_room_alarm: "Alarma en sala de bombas",
  motor_run: "Motor en marcha",
  canbus_communication_system_failure: "Falla de comunicación CANBUS",
  pump_on_demand: "Bomba por demanda",
  invalid_cut_in: "Cut-in inválido",
  test_mode: "Modo prueba",
  low_zone_not_running: "Zona baja no en marcha",
  io_expansion_1_communication_loss: "Pérdida de comunicación expansión 1",
  io_expansion_2_communication_loss: "Pérdida de comunicación expansión 2",
  io_expansion_3_communication_loss: "Pérdida de comunicación expansión 3",
  io_expansion_4_communication_loss: "Pérdida de comunicación expansión 4",
  ground_fault: "Falla a tierra",
  low_water_level: "Nivel de agua bajo",
  low_spare_temperature: "Temperatura de reserva baja",
  water_reservoir_empty: "Depósito de agua vacío",
  high_water_level: "Nivel de agua alto",
  main_relief_valve_open: "Válvula principal de alivio abierta",
  high_motor_temperature: "Temperatura alta de motor",
  high_motor_vibration: "Vibración alta de motor",
  flow_meter_on: "Medidor de flujo activo",
  user_alarm_1: "Alarma de usuario 1",
  user_alarm_2: "Alarma de usuario 2",
  user_alarm_3: "Alarma de usuario 3",
  user_alarm_4: "Alarma de usuario 4",
  user_alarm_5: "Alarma de usuario 5",
  user_alarm_6: "Alarma de usuario 6",
  user_alarm_7: "Alarma de usuario 7",
  user_alarm_8: "Alarma de usuario 8",
  user_alarm_9: "Alarma de usuario 9",
  user_alarm_10: "Alarma de usuario 10",
  user_alarm_11: "Alarma de usuario 11",
  user_alarm_12: "Alarma de usuario 12",
  user_alarm_13: "Alarma de usuario 13",
  user_alarm_14: "Alarma de usuario 14",
  user_alarm_15: "Alarma de usuario 15",
  user_alarm_16: "Alarma de usuario 16",
  user_alarm_17: "Alarma de usuario 17",
  user_alarm_18: "Alarma de usuario 18",
  user_alarm_19: "Alarma de usuario 19",
  user_alarm_20: "Alarma de usuario 20",
  bell_silenced: "Campana silenciada",
  na_1: "Reservado 1",
  na_2: "Reservado 2",
  na_3: "Reservado 3",
  na_4: "Reservado 4",
  na_5: "Reservado 5",
  main_contactor_module_failure: "Falla en módulo contactor principal",
  bypass_contactor_module_failure: "Falla en módulo contactor bypass",
  io_expansion_5_communication_loss: "Pérdida de comunicación expansión 5",
  io_expansion_6_communication_loss: "Pérdida de comunicación expansión 6",
  io_expansion_7_communication_loss: "Pérdida de comunicación expansión 7",
  io_expansion_8_communication_loss: "Pérdida de comunicación expansión 8",
  low_foam_level: "Nivel de espuma bajo",
  low_foam_pressure: "Presión de espuma baja",
  na_6: "Reservado 6",
  na_7: "Reservado 7",
  na_8: "Reservado 8",
  na_9: "Reservado 9",
  na_10: "Reservado 10",
  na_11: "Reservado 11",
  na_12: "Reservado 12",
  na_13: "Reservado 13",
  na_14: "Reservado 14",
  line_voltage_l12: "Voltaje L1-L2",
  line_voltage_l23: "Voltaje L2-L3",
  line_voltage_l31: "Voltaje L3-L1",
  current_l1: "Corriente L1",
  current_l2: "Corriente L2",
  current_l3: "Corriente L3",
  system_pressure: "Presión del sistema",
  suction_pressure: "Presión de succión",
  na_15: "Reservado 15",
  na_16: "Reservado 16",
  na_17: "Reservado 17",
  start_count: "Cantidad de arranques",
  run_time: "Horas de operación",
  hours_since_last_run: "Horas desde el último arranque",
  na_18: "Reservado 18",
  cut_in: "Corte de arranque (cut-in)",
  cut_out: "Corte de paro (cut-out)",
  minimum_run_delay_timing_high: "Retardo mínimo de marcha alto",
  na_19: "Reservado 19",
  high_zone_delay_timing_high: "Retardo zona alta alto",
  sequence_delay_timing_high: "Retardo de secuencia alto",
  load_shed_active_high: "Alivio de carga activo alto",
  na_20: "Reservado 20",
  low_suction_alarm_high: "Alarma de baja succión alto",
  low_suction_shutdown_active_high: "Paro por baja succión activo alto",
  system_over_pressure_alarm_high: "Alarma de sobrepresión alto",
  restart_delay_timing_high: "Retardo de reinicio alto",
  weekly_test_demand_active_high: "Demanda prueba semanal activo alto",
  failure_to_start_alarm_high: "Alarma de falla al arrancar alto",
  lockout_active_high: "Bloqueo activo alto",
  na_21: "Reservado 21",
  na_22: "Reservado 22",
  pressure_start_demand_high: "Demanda de arranque por presión alto",
  remote_start_demand_high: "Demanda de arranque remoto alto",
  deluge_start_demand_high: "Demanda de arranque diluvio alto",
  weekly_test_start_demand_high: "Demanda de arranque prueba semanal alto",
  local_start_pb_demand_high: "Demanda arranque botón local alto",
  manual_operator_start_demand_high: "Demanda arranque operador manual alto",
  audible_alarm_high: "Alarma audible alto",
  na_23: "Reservado 23",
  na_24: "Reservado 24",
  load_shedding_delay_timing_high: "Retardo alivio de carga alto",
  na_25: "Reservado 25",
  na_26: "Reservado 26",
  pressure_transducer_fault_high: "Falla transductor de presión alto",
  na_27: "Reservado 27",
  na_28: "Reservado 28",
  controller_in_bypass_mode_soft_start_vfd_only_high: "Controlador en modo bypass (solo VFD/arranque suave) alto",
  timed_trip_timing_high: "Tiempo de disparo alto",
  motor_running_high: "Motor en marcha alto",
  motor_overload_alarm_high: "Alarma sobrecarga motor alto",
  lose_value: "Pérdida de valor",
  phase_reversal_alarm_high: "Alarma inversión de fase alto",
  ac_voltage_low_alarm_high: "Alarma voltaje AC bajo alto",
  na_29: "Reservado 29",
  na_30: "Reservado 30",
  na_31: "Reservado 31",
  ac_power_available_high: "Energía AC disponible alto",
  na_32: "Reservado 32",
  na_33: "Reservado 33",
  na_34: "Reservado 34",
  na_35: "Reservado 35",
  na_36: "Reservado 36",
  na_37: "Reservado 37",
  pump_trouble_1_input_high: "Falla bomba 1 alto",
  pump_trouble_2_input_high: "Falla bomba 2 alto",
  pump_trouble_3_input_high: "Falla bomba 3 alto",
  pump_trouble_4_input_high: "Falla bomba 4 alto",
  pump_trouble_5_input_high: "Falla bomba 5 alto",
  na_38: "Reservado 38",
  na_39: "Reservado 39",
  na_40: "Reservado 40",
  na_41: "Reservado 41",
  na_42: "Reservado 42",
  na_43: "Reservado 43",
  na_44: "Reservado 44",
  na_45: "Reservado 45",
  na_46: "Reservado 46",
  na_47: "Reservado 47",
  na_48: "Reservado 48",
  alarms_count:"Contador de Alarmas"
};

const SCIUnit = {
  voltage: "V",
  current: "A",
  frequency: "Hz",
  custom_locked_rotor_current: "A",
  line_voltage_l12: "V",
  line_voltage_l23: "V",
  line_voltage_l31: "V",
  current_l1: "A",
  current_l2: "A",
  current_l3: "A",
  system_pressure: "psi", // cámbialo a bar/kPa si quieres
  suction_pressure: "psi",
  start_count: "",
  run_time: "h",
  hours_since_last_run: "h",
  cut_in: "psi",
  cut_out: "psi",
} as const;


// Aire Acondicionado
export const AireUnit = {
  id: "", bus: "", alias: "", status: "", alarm: "",
  temperature_setting: "°C", temperature_indoor: "°C",
  e0: "", e1: "", e2: "", e3: "", e4: "", e5: "", e6: "", e7: "",
  e8: "", e9: "", ea: "", eb: "", ec: "", ed: "", ee: "", ef: "",
} as const;

export const AireLabel = {
  id: "ID del equipo", bus: "Bus de comunicación", alias: "Nombre",
  status: "Estado", alarm: "Numero Alarmas",
  temperature_setting: "Temperatura configurada",
  temperature_indoor: "Temperatura ambiente",
  e0: "Error 0", e1: "Error 1", e2: "Error 2", e3: "Error 3",
  e4: "Error 4", e5: "Error 5", e6: "Error 6", e7: "Error 7",
  e8: "Error 8", e9: "Error 9", ea: "Error A", eb: "Error B",
  ec: "Error C", ed: "Error D", ee: "Error E", ef: "Error F",
} as const;

// Estado Bombas de Agua / Estacionamientos (comparten "estado")
export const EstadoUnit = { estado: "" } as const;
export const EstadoLabel = { estado: "Estado" } as const;

// Variadores Bombas de Agua
export const VariadoresUnit = {
  velocidad_y_direccion: "rpm",
  frecuencia: "Hz",
  intensidad: "A",
  potencia: "W",
  tension_salida: "V",
  temperatura_unidad: "°C",
  tiempo_marcha: "h",
} as const;

export const VariadoresLabel = {
  velocidad_y_direccion: "Velocidad y dirección",
  frecuencia: "Frecuencia de salida",
  intensidad: "Corriente",
  potencia: "Potencia",
  tension_salida: "Tensión de salida",
  temperatura_unidad: "Temperatura del equipo",
  tiempo_marcha: "Tiempo de marcha",
} as const;

// Tableros de Energía
export const TablerosUnit = { activa: "KW", reactiva: "KVAR", aparente: "KVA" } as const;
export const TablerosLabel = { activa: "Potencia Activa", reactiva: "Potencia Reactiva", aparente: "Potencia Aparente" } as const;

// Otras fuentes
export const PiscinasUnit = { cloro: "ppm" } as const;
export const PiscinasLabel = { cloro: "Cloro" } as const;

export const CO2Unit = { co2: "ppm" } as const;
export const CO2Label = { co2: "Concentración de CO2" } as const;

type Dict = Record<string, string>;

function mergeWithConflictCheck(...parts: ReadonlyArray<Dict>): Dict {
  const out: Dict = {};
  for (const part of parts) {
    for (const [k, v] of Object.entries(part)) {
      if (k in out && out[k] !== v) {
        throw new Error(`Clave duplicada con valores distintos: "${k}" -> "${out[k]}" vs "${v}"`);
      }
      out[k] = v;
    }
  }
  return out;
}

export const Unit = Object.freeze(
  mergeWithConflictCheck(
    AireUnit,
    EstadoUnit,
    VariadoresUnit,
    SCIUnit,
    TablerosUnit,
    PiscinasUnit,
    CO2Unit,
  )
);

export const Label = Object.freeze(
  mergeWithConflictCheck(
    AireLabel,
    EstadoLabel,
    VariadoresLabel,
    SCILabel,
    TablerosLabel,
    PiscinasLabel,
    CO2Label,
  )
);
export const getLabel = (key: string): string =>
  (Label as Record<string, string>)[key] ?? key;

export const getUnit = (key: string): string =>
  (Unit as Record<string, string>)[key] ?? "";