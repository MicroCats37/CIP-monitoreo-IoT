// pages/api/getData.ts
import { getLatestValues } from '@/influxDB/querys/EstacionamientoQuerys';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getLatestValues();
    res.status(200).json(data); // Responde con los valores al frontend
  } catch (error) {
    console.error('Error al obtener datos de InfluxDB:', error);
    res.status(500).json({ error: 'Error al obtener datos de InfluxDB' });
  }
}
