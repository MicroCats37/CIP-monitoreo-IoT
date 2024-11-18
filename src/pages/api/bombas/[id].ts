import { getBombasEstado } from "@/influxDB/querys/BombasQuerys";
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
const { id } = req.query;
   const validBombasIds = ['agua-potable', 'aguas-tratadas', 'aguas-grises'];

  if (!validBombasIds.includes(id as string)) {
    res.status(404).json({ error: 'Estacionamiento no válido. Solo existen Bomba de Agua Potable,Tratadas y grises' });
    return;
  }
  try {
    const data = await getBombasEstado(id as string);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener datos de sotano:', error);
    res.status(500).json({ error: 'Error al obtener datos del sotano' });
  }
}
