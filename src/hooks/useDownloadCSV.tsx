import { useQuery } from "@tanstack/react-query";

export const useDownloadCSV = (startTime?: string, endTime?: string) => {
  return useQuery({
    queryKey: ["tableroCSV", startTime, endTime],
    queryFn: async () => {
      if (!startTime || !endTime) throw new Error("Fechas inválidas");

      const res = await fetch(`/api/download/tableros?startTime=${startTime}&endTime=${endTime}`);
      if (!res.ok) throw new Error("Error descargando CSV");

      return res.blob();
    },
    enabled: !!startTime && !!endTime, // Evita ejecutar si no hay fechas
  });
};
