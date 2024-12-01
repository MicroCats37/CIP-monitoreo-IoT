
import { z } from 'zod';
export interface SotanosType {
    sotano1:string,
    sotano2:string,
    sotano3:string,
    sotano4:string,
}

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
  time: z.string(),                // Timestamp del estado
});

export type ParkingType = z.infer<typeof ParkingTypeSchema>;
  // Esquema para WaterPumpType
  export const WaterPumpTypeSchema = z.object({
    bomba: z.string(),
    estado: z.boolean(),
    // time: z.string().optional(), // Descomentar si decides usar el campo 'time'
  });
  
  export type WaterPumpType = z.infer<typeof WaterPumpTypeSchema>;
  
  // Esquema para BoardType
  export const BoardTypeSchema = z.object({
    potencia: z.string(),
    value: z.number(),
    // time: z.string().optional(), // Descomentar si decides usar el campo 'time'
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
  });
  
  export type VariatorsType = z.infer<typeof VariatorsTypeSchema>;