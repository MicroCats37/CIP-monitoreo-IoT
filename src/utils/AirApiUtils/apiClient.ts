// apiClient.ts

import { ControlDeviceResponse } from "./types";
import { ControlDeviceBody } from "./types";


export async function controlAirDevice(body: ControlDeviceBody): Promise<ControlDeviceResponse> {
  const response = await fetch('/api/device/aire-acondicionado/control', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error('Error al controlar el dispositivo');
  }

  return response.json();
}