import { getSotanoEstado } from '@/influxDB/querys/EstacionamientoQuerys';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
const { id } = req.query;
   const validParkingIds = ['1', '2', '3', '4'];

  if (!validParkingIds.includes(id as string)) {
    res.status(404).json({ error: 'Estacionamiento no válido. Solo se permiten los estacionamientos 1, 2, 3, y 4.' });
    return;
  }
  try {
    const data = await getSotanoEstado(id as string);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener datos de sotano:', error);
    res.status(500).json({ error: 'Error al obtener datos del sotano' });
  }
}
