
import { AirConditioningTypeSchema, BoardTypeSchema, ParkingTypeSchema, SCITypeSchema, VariatorsTypeSchema, WaterPumpTypeSchema } from '@/validators';
import { z } from 'zod';

export interface SotanosStateDataType {
  id: string
  quantity: number
  order: {
    position: number,
    tag: string
    orientation: boolean
  }[]
}


export type ParkingType = z.infer<typeof ParkingTypeSchema>;
// Esquema para WaterPumpType

export type WaterPumpType = z.infer<typeof WaterPumpTypeSchema>;

// Esquema para BoardType


export type BoardType = z.infer<typeof BoardTypeSchema>;



export type VariatorsType = z.infer<typeof VariatorsTypeSchema>;


export type SCIType = z.infer<typeof SCITypeSchema>;



// Generar la interfaz o tipo a partir del esquema Zod
export type AirConditioningType = z.infer<typeof AirConditioningTypeSchema>;




