

import { AirDeviceDataType, cleanJson, getMode, getTemp, getWind } from "@/utils/AirApiUtils/getData";
import { parseStringPromise } from "xml2js";
import { ControlDeviceBody } from './types';

const username = "admin";
const password = "12345";
const credentials = Buffer.from(`${username}:${password}`).toString("base64");

// Función para determinar la URL base según el `controller`
function getBaseUrl(controller: string) {
  if (controller === "55") {
    return "http://10.10.5.55/cgi-bin/mdacxml.cgi";
  } else if (controller === "56") {
    return "http://10.10.5.56/cgi-bin/mdacxml.cgi";
  } else {
    throw new Error("El 'controller' debe ser '55' o '56'");
  }
}

// Función para obtener los datos actuales del dispositivo
async function getAirDeviceData(controller: string, devid: string) {
  const BASE_URL = getBaseUrl(controller);

  const response = await fetch(`${BASE_URL}?req=devsta&devid=${devid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/xml",
      "Authorization": `Basic ${credentials}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error obteniendo datos del dispositivo: ${response.status}`);
  }

  const xmlText = await response.text();
  const jsonData = await parseStringPromise(xmlText);
  const data: AirDeviceDataType = cleanJson(jsonData.result.device[0]);
  return data;
}

// Función para enviar comando de control
async function controlDevice(controller: string, devid: string, run: string, mode: string, wind: string, temp: string) {
  const BASE_URL = getBaseUrl(controller);

  const url = `${BASE_URL}?req=ctrl_indoor_unit&devid=${devid}&run=${run}&mode=${mode}&wind=${wind}&temp=${temp}&start_t=0&stop_t=0&economy=0&change_air=0&swing=0&elec_heat=0`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Basic ${credentials}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error controlando el dispositivo: ${response.status}`);
  }
  return response.text();
}

export async function ControlerAirdevice(deviceData:ControlDeviceBody) {
  try {
    // Extraer el cuerpo de la solicitud
    
    const { controller, devid, run, mode, wind, temp } = deviceData;

    if (!controller) {
      throw new Error("El 'controller' es requerido");
    }
    if (!devid) {
      throw new Error("El 'devid' es requerido");
    }

    // Obtener datos actuales si faltan parámetros
    let AirDeviceData: AirDeviceDataType = await getAirDeviceData(controller, devid);

    const finalMode = mode !== undefined ? mode : getMode(AirDeviceData);
    const finalRun = run !== undefined ? run : AirDeviceData.run_mode.run_status;
    const finalWind = wind !== undefined ? wind : getWind(AirDeviceData);
    const finalTemp = temp !== undefined ? getTemp(temp) : getTemp(AirDeviceData.ts);

    // Validar temp si fue proporcionado
    if (temp !== undefined) {
      if (Number(finalTemp) < 17 || Number(finalTemp)> 30) {
        throw new Error("El 'temp' debe estar en el rango de 17 a 30");
      }
    }

    // Validar wind si fue proporcionado
    if (wind !== undefined) {
      const allowedWinds = new Set([1, 2, 4, 8, 16]);
      if (!allowedWinds.has(Number(wind))) {
        throw new Error("El 'wind' debe ser uno de los siguientes valores: 1, 2, 4, 8, 16");
      }
    }

    // Enviar el comando de control
    const controlResponse = await controlDevice(controller, devid, finalRun, finalMode, finalWind, finalTemp);
    return { success: true, response: controlResponse };
  } catch (error: any) {
    return { error: error.message || "Error desconocido" };
  }
}