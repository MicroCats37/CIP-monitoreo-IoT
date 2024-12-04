import { NextApiRequest, NextApiResponse } from 'next';
import { getAireAcondicionadoDatos } from '@/influxDB/querys/AireAcondicionadoQuerys';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const data = await getAireAcondicionadoDatos('56'); // Pasamos el número del bus como argumento

        if (data.data.length === 0) {
            res.status(404).json({
                error: `No se encontraron datos para el bus 1 en los últimos 30 minutos.`,
            });
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener datos del bus 1:', error);
        res.status(500).json({ error: 'Error al obtener datos del bus 1' });
    }
}


