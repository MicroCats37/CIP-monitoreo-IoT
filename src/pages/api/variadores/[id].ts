import { getVariadoresDatos } from '@/influxDB/querys/VariadoresQuerys';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const validBombasIds = ['agua-potable', 'aguas-tratadas', 'aguas-grises'];

    if (!validBombasIds.includes(id as string)) {
        res.status(404).json({
            error: 'Bomba no válida. Solo existen Agua Potable, Aguas Tratadas y Aguas Grises.',
        });
        return;
    }

    try {
        // Obtiene los datos de la bomba utilizando la nueva función
        const data = await getVariadoresDatos(id as string);

        if (data.length === 0) {
            res.status(404).json({
                error: `No se encontraron datos para la bomba "${id}" en los últimos 30 minutos.`,
            });
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener datos de la bomba:', error);
        res.status(500).json({ error: 'Error al obtener datos de la bomba' });
    }
}
