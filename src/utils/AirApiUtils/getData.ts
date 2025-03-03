import { AirDeviceDataType } from "@/types";

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