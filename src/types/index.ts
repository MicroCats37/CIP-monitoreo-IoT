
import { AirConditioningTypeSchema, BoardTypeSchema, ParkingTypeSchema, SCIDataTypeSchema, SCITypeSchema, VariatorsTypeSchema, WaterPumpTypeSchema } from '@/validators/schemas';
import { z } from 'zod';

export interface SotanosStateKeyDataType {
  [key: string]: SotanosStateDataType
}
export interface SotanosStateDataType {
  id: string
  quantity: number
  order: {
    position: number,
    tag: string
    orientation: boolean
  }[]
} 

export interface DataPlotStaked {
  time: string;
  [key: string]: number | string | boolean; // Permite otros campos dinámicos
}

export interface PlotDataType{
  data:{
    [key: string]: number | boolean | string
  },
  time:string
}

export interface AreaKeyDataType {
  [area: string]: AreaData | { [param: string]: AreaData };
}
export interface AreaData {
  id?: string,
  topickey: string,
}


export type ParkingType = z.infer<typeof ParkingTypeSchema>;
// Esquema para WaterPumpType

export type WaterPumpType = z.infer<typeof WaterPumpTypeSchema>;

// Esquema para BoardType


export type BoardType = z.infer<typeof BoardTypeSchema>;



export type VariatorsType = z.infer<typeof VariatorsTypeSchema>;


export type SCIType = z.infer<typeof SCITypeSchema>;

export type SCIDataType = z.infer<typeof SCIDataTypeSchema>

// Generar la interfaz o tipo a partir del esquema Zod
export type AirConditioningType = z.infer<typeof AirConditioningTypeSchema>;

export type SCISimplifiedType = {
  time: SCIType["time"];  // Asignar el tipo directamente a `time`
  data: Pick<SCIType["data"], "voltage" | "current" | "frequency" | "custom_locked_rotor_current">; // Seleccionar solo las propiedades necesarias de `data`
};

export type TickFormattedType = {
  tickFormatter?: (value: any, index: number) => string;
}






