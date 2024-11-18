
import { getTableroEstados } from '@/influxDB/querys/TablerosQuerys';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = await getTableroEstados()
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener datos de sotano:', error);
    res.status(500).json({ error: 'Error al obtener datos del sotano' });
  }
}
