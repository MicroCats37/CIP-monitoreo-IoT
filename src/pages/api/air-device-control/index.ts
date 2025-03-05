import { ControlerAirdevice } from '@/utils/AirApiUtils/airFunctions';
import { ControlDeviceBody } from '@/utils/AirApiUtils/types';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }

    // Verificar si el cuerpo de la solicitud está vacío
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: "El cuerpo de la solicitud no puede estar vacío" });
    }

    // Intentar parsear el cuerpo de la solicitud
    let data: ControlDeviceBody;
    try {
      data = JSON.parse(req.body);
    } catch {
      return res.status(400).json({ error: "Formato JSON inválido" });
    }

    // Validaciones específicas
    const { controller, devid, run, mode, wind, temp } = data;

    if (!controller || !devid) {
      return res.status(400).json({ error: "Los campos 'controller' y 'devid' son obligatorios" });
    }


    // Procesar la solicitud
    const result = await ControlerAirdevice(data);
    
    return res.status(200).json({ success: true, response: result });

  } catch (error: any) {
    console.error("Error en control-device:", error);
    return res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
}
