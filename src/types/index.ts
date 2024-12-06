
import { z } from 'zod';

export interface SotanosStateDataType {
  id: string
  quantity: number
  order: {
    position: number,
    tag: string
    orientation:boolean
  }[]
}

export const ParkingTypeSchema = z.object({
  data: z.array(
    z.object({
      estacionamiento: z.string(), // Ejemplo: "E1"
      estado: z.string(),          // Ejemplo: "ocupado", "libre", etc.
    })
  ), // Lista de estacionamientos y sus estados
  time: z.string().optional(),                // Timestamp del estado
});

export type ParkingType = z.infer<typeof ParkingTypeSchema>;
// Esquema para WaterPumpType
export const WaterPumpTypeSchema = z.object({
  bomba: z.string(),
  estado: z.boolean(),
  time: z.string().optional(), // Descomentar si decides usar el campo 'time'
});

export const ArrayWaterPumpTypeSchema = z.array(z.object({
  bomba: z.string(),
  estado: z.boolean(),
  time: z.string().optional(), // Descomentar si decides usar el campo 'time'
}));

export type WaterPumpType = z.infer<typeof WaterPumpTypeSchema>;

// Esquema para BoardType
export const BoardTypeSchema = z.object({
  potencia: z.string(),
  value: z.number(),
  time: z.string().optional(), // Descomentar si decides usar el campo 'time'
});
export const ArrayBoardTypeSchema = z.array(z.object({
  potencia: z.string(),
  value: z.number(),
  time: z.string().optional(), // Descomentar si decides usar el campo 'time'
}));
export type BoardType = z.infer<typeof BoardTypeSchema>;

export const VariatorsTypeSchema = z.object({
  bomba: z.string(),  // Nombre de la bomba (Q01, Q02, etc.)
  velocidad_y_direccion: z.number(),  // Opcional, ya que puede estar ausente en algunos casos
  frecuencia: z.number(),
  intensidad: z.number(),
  potencia: z.number(),
  tension_salida: z.number(),
  temperatura_unidad: z.number(),
  tiempo_marcha: z.number(),
  time: z.string().optional(),
});

export const ArrayVariatorsTypeSchema = z.array(z.object({
  bomba: z.string(),  // Nombre de la bomba (Q01, Q02, etc.)
  velocidad_y_direccion: z.number(),  // Opcional, ya que puede estar ausente en algunos casos
  frecuencia: z.number(),
  intensidad: z.number(),
  potencia: z.number(),
  tension_salida: z.number(),
  temperatura_unidad: z.number(),
  tiempo_marcha: z.number(),
  time: z.string().optional(),
}));

export type VariatorsType = z.infer<typeof VariatorsTypeSchema>;




export const SCITypeSchema = z.object({
  data: z.object({
    voltage: z.number(),
    current: z.number(),
    frequency: z.number(),
    custom_locked_rotor_current: z.number(),
    normal_phase_reserval: z.boolean(),
    phase_loss_l1: z.boolean(),
    phase_loss_l2: z.boolean(),
    phase_loss_l3: z.boolean(),
    lock_rotor_current: z.boolean(),
    fail_to_start: z.boolean(),
    transfer_switch_trouble: z.boolean(),
    power_loss: z.boolean(),
    service_required: z.boolean(),
    undercurrent: z.boolean(),
    overcurrent: z.boolean(),
    undervoltage: z.boolean(),
    overvoltage: z.boolean(),
    phase_unbalanced: z.boolean(),
    weekly_test_cut_in_not_reached: z.boolean(),
    weekly_test_check_solenoid_valve: z.boolean(),
    faulty_pressure_transducer: z.boolean(),
    overpressure: z.boolean(),
    underpressure: z.boolean(),
    low_suction_pressure: z.boolean(),
    flow_start: z.boolean(),
    alternate_phase_reversal: z.boolean(),
    alternate_isolating_switch_open: z.boolean(),
    alternate_circuit_breaker_tripped: z.boolean(),
    io_electric_board_communication_loss: z.boolean(),
    io_transfer_switch_board_comm_loss: z.boolean(),
    weekly_test_required: z.boolean(),
    alternate_lock_rotor_current: z.boolean(),
    low_ambient_temperature_internal_sensor: z.boolean(),
    high_ambient_temperature_internal_sensor: z.boolean(),
    control_voltage_not_healthy: z.boolean(),
    soft_starter_fault: z.boolean(),
  }),
  time: z.string().optional(),
});

export type SCIType = z.infer<typeof SCITypeSchema>;



// Definir el esquema Zod
export const AirConditioningTypeSchema = z.object({
  data: z.array(
    z.object({
      unit_name: z.string(),
      alias: z.string(),
      id: z.string(),
      alarm: z.string(),
      status: z.string(),
      temperature_setting: z.number(),
      temperature_indoor: z.number(),
    })
  ),
  time: z.string().optional()
});

// Generar la interfaz o tipo a partir del esquema Zod
export type AirConditioningType = z.infer<typeof AirConditioningTypeSchema>;





