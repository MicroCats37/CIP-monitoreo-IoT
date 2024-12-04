
import { z } from 'zod';

export interface SotanosStateDataType {
  id: string
  quantity: number
  order: {
    position: number,
    tag: string
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
  time: z.string().optional(),
});

export type SCIType = z.infer<typeof SCITypeSchema>;


// Definir el esquema Zod
export const AirConditioningTypeSchema = z.object({
  data: z.array(
      z.object({
          unit_name: z.string().min(1, "El nombre de la unidad no puede estar vacío."),
          alias: z.string().min(1, "El alias no puede estar vacío."),
          id: z.string().min(1, "El ID no puede estar vacío."),
          alarm: z.number().nonnegative("El campo alarm debe ser un número no negativo."),
          status: z.string().min(1, "El estado no puede estar vacío."),
      })
  ),
  time: z.string().optional()
});

// Generar la interfaz o tipo a partir del esquema Zod
export type AirConditioningType = z.infer<typeof AirConditioningTypeSchema>;











// Función para validar y manejar errores específicos
export const validateData = (data: any, schema: z.ZodSchema<any>) => {
  try {
    // Intentar parsear los datos con el esquema
    schema.parse(data);
    console.log('Datos válidos');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => {
        return `Campo: ${err.path.join('.')}, Error: ${err.message}`;
      }).join('\n');

      console.error('Errores de validación:\n', errorMessages);
      throw new Error('Datos inválidos');
    }
  }
};

// Función para validar SCI
export const validateSCIData = (data: any) => {
  validateData(data, SCITypeSchema);
};

// Función para validar WaterPump
export const validateWaterPumpData = (data: any) => {
  validateData(data, WaterPumpTypeSchema);
};

// Función para validar Board
export const validateBoardData = (data: any) => {
  validateData(data, BoardTypeSchema);
};

// Función para validar Variators
export const validateVariatorsData = (data: any) => {
  validateData(data, VariatorsTypeSchema);
};

// Función para validar Parking
export const validateParkingData = (data: any) => {
  validateData(data, ParkingTypeSchema);
};