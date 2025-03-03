
import { AirConditioningTypeSchema, BoardTypeSchema, ParkingTypeSchema, PoolTypeSchema, SCIDataTypeSchema, SCITypeSchema, VariatorsTypeSchema, WaterPumpTypeSchema } from '@/validators/schemas';
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
  time: string ;
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

export type AirDeviceDataType = {
    name: string;
    alias: string;
    id: string;
    "refresh-count": string;
    "refresh-time": string;
    main_type: string;
    ass_type: string;
    correcting_type: string;
    ability: {
      cool_heat: string;
      elec_heat: string;
      change_air: string;
      swing_wind: string;
      clear_head: string;
      add_oxygen: string;
      extend_temp: string;
    };
    run_mode: {
      send_wind: string;
      dehumidify: string;
      heat: string;
      cooling: string;
      automation: string;
      lock_mode: string;
      run_status: string;
    };
    wind: {
      high_wind: string;
      mid_wind: string;
      low_wind: string;
      breeze: string;
      auto_wind: string;
    };
    ts: string;
    t1: string;
    t2a: string;
    t2b: string;
    t3: string;
    comp_current: string;
    humidity: string;
    run_setting_time: string;
    stop_setting_time: string;
    power: string;
    "outdoor-unit": {
      back_oil: string;
      crankcase: string;
      st: string;
      out_low_wind: string;
      out_high_wind: string;
      compressor: string;
    };
    ass_status: {
      economy_run: string;
      elec_heat: string;
      swing: string;
      change_air: string;
      clear_headed: string;
      add_humidify: string;
      add_oxygen: string;
      dryness: string;
      plane_wind: string;
      add_water: string;
      drain_pump: string;
      lock: string;
      ctrler_lock: string;
      remote_lock: string;
    };
    fault: Record<string, string>;
    protect_status: Record<string, string>;
    nd_fault: Record<string, string>;
    inflate_valve_1_degree: string;
    inflate_valve_2_degree: string;
    power_grade: string;
    fre_comp: string;
  };

export type ParkingType = z.infer<typeof ParkingTypeSchema>;
// Esquema para WaterPumpType

export type WaterPumpType = z.infer<typeof WaterPumpTypeSchema>;

// Esquema para BoardType


export type BoardType = z.infer<typeof BoardTypeSchema>;

export type PoolType = z.infer<typeof PoolTypeSchema>;

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






