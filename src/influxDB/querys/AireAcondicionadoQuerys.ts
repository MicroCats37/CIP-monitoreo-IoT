import { queryApi } from "../influxConfig";

export interface Unidad {
    unit_name: string;
    alias: string;
    id: string;
    alarm: number;
    status: string;
}

export interface AireAcondicionadoResponse {
    data: Unidad[];
    time: string; // Tiempo global de la última consulta
}

export const getAireAcondicionadoDatos = async (port: string): Promise<AireAcondicionadoResponse> => {
    const fluxQuery = `
    from(bucket: "Aire Acondicionado")
    |> range(start: -30m)
    |> filter(fn: (r) => 
        r["_measurement"] == "INDOOR-BUS-1-${port}" or 
        r["_measurement"] == "INDOOR-BUS-2-${port}" or 
        r["_measurement"] == "INDOOR-BUS-3-${port}"
    )
    |> filter(fn: (r) => r["_field"] == "alarm" or r["_field"] == "status")
    |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> group(columns: ["_measurement", "unit_name", "alias", "id"])
    |> unique(column: "_time")
    |> keep(columns: ["_time", "unit_name", "alias", "id", "alarm", "status"])
    |> sort(columns: ["_time"], desc: true)
    |> limit(n: 1)
`;


    const rows: AireAcondicionadoResponse = {
        data: [],
        time: ""
    };

    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
        const record = tableMeta.toObject(values);
        console.log(record)
        // Asignar el timestamp del primer registro encontrado como `time`
        if (!rows.time) {
            rows.time = record._time;
        }

        // Validar y agregar datos al array `data`
        rows.data.push({
            unit_name: record.unit_name || "Unknown", // Fallback si no se encuentra el campo
            alias: record.alias || "Unknown",
            id: record.id || "Unknown",
            alarm: parseInt(record.alarm, 10) || 0, // Si no hay alarm, usar 0 como valor por defecto
            status: record.status || "Unknown",
        });
    }

    // Verificar si se obtuvieron datos; si no, lanzar error
    if (rows.data.length === 0) {
        throw new Error(`No se encontraron datos en InfluxDB para el puerto ${port}.`);
    }

    return rows;
};
