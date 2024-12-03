import { getAlarmsData } from "@/influxDB/querys/SCIQuerys";// Asegúrate de que esta ruta sea correcta
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Llama a la función que obtiene los datos desde InfluxDB
    const data = await getAlarmsData();
    // Responde con los datos en formato JSON
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener datos de alarmas:', error);

    // Devuelve un error 500 en caso de fallo
    res.status(500).json({ error: 'Error al obtener datos de alarmas' });
  }
}
