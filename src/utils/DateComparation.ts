import { PlotDataType } from "@/types";

// Función de utilidad para formatear y normalizar los tiempos
export const normalizeTimestamps = (data: PlotDataType[]): string[] => {
    return data.map((item) => {
        return item.time.split(/[.Z]/)[0] + "Z";
    });
};

// Función de utilidad para comparar los tiempos normalizados de dos conjuntos de datos
export const areTimestampsEqual = (
    data1: PlotDataType[] | undefined,
    data2: PlotDataType[] | undefined
): boolean => {

    if (!data1 || !data2) return false; // Si alguno es undefined, no puede haber coincidencia.

    try {
        return (
            JSON.stringify(normalizeTimestamps(data1)) ===
            JSON.stringify(normalizeTimestamps(data2))
        );
    } catch (error) {
        console.error(error);
        return false; // Si ocurre un error (por ejemplo, falta 'time'), devolver `false`
    }
};
