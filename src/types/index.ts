
import { z } from 'zod';

export interface SotanosStateDataType{
    id:string
    quantity:number
    order:{
      position:number,
      tag:string
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
  
  export type WaterPumpType = z.infer<typeof WaterPumpTypeSchema>;
  
  // Esquema para BoardType
  export const BoardTypeSchema = z.object({
    potencia: z.string(),
    value: z.number(),
    time: z.string().optional(), // Descomentar si decides usar el campo 'time'
  });
  
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
  
  export type VariatorsType = z.infer<typeof VariatorsTypeSchema>;



export const SCITypeSchema = z.object({
  voltage: z.number(),
  current: z.number(),
  frequency: z.number(),
  custom_locked_rotor_current: z.number(),
  user_alarm_1: z.boolean(),
  user_alarm_2: z.boolean(),
  user_alarm_3: z.boolean(),
  user_alarm_4: z.boolean(),
  user_alarm_5: z.boolean(),
  user_alarm_6: z.boolean(),
  user_alarm_7: z.boolean(),
  user_alarm_8: z.boolean(),
  user_alarm_9: z.boolean(),
  user_alarm_10: z.boolean(),
  user_alarm_11: z.boolean(),
  user_alarm_12: z.boolean(),
  user_alarm_13: z.boolean(),
  user_alarm_14: z.boolean(),
  user_alarm_15: z.boolean(),
  user_alarm_16: z.boolean(),
  user_alarm_17: z.boolean(),
  user_alarm_18: z.boolean(),
  user_alarm_19: z.boolean(),
  user_alarm_20: z.boolean(),
  time: z.string(),
});

export type SCIType = z.infer<typeof SCITypeSchema>;
