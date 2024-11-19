
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
}

// Esquema para ParkingType
export const ParkingTypeSchema = z.object({
    parking_id: z.string(),
    state: z.string(),
    // time: z.string().optional(), // Descomentar si decides usar el campo 'time'
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
    value: z.boolean(),
    // time: z.string().optional(), // Descomentar si decides usar el campo 'time'
  });
  
  export type BoardType = z.infer<typeof BoardTypeSchema>;