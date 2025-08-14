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

export function cleanJson(obj: any): any {
    if (typeof obj !== "object" || obj === null) return obj;
    if (Array.isArray(obj) && obj.length === 1) return cleanJson(obj[0]);
    if (Array.isArray(obj)) return obj.map(cleanJson);
    return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, cleanJson(value)]));
}


// Mapeo de modos
export function getMode(AirDeviceData: AirDeviceDataType) {
    const mode_mapping: Record<string, string> = {
        send_wind: "1",
        dehumidify: "2",
        heat: "4",
        cooling:"8",
        automation: "16",
    };

    for (const key of Object.keys(mode_mapping)) {
        const typedKey = key as keyof typeof AirDeviceData.run_mode;
        if (AirDeviceData.run_mode[typedKey] === "1") {
            return mode_mapping[typedKey];
        }
    }
    return "16"; // Default
}

// Mapeo de velocidad de viento
export function getWind(AirDeviceData: AirDeviceDataType) {
    const wind_mapping: Record<string, string> = {
        high_wind: "1",
        mid_wind: "2",
        low_wind: "3",
        auto_wind: "4",
    };

    for (const key of Object.keys(wind_mapping)) {
        const typedKey = key as keyof typeof AirDeviceData.wind;
        if (AirDeviceData.wind[typedKey] === "1") {
            return wind_mapping[key];
        }
    }
    return "4"; // Default auto_wind
}

export function getTemp(ts:string){
    if(ts==='0'){
        return "NaN"
    }
    else{
        return ts
    }
}