import axios, { AxiosError } from 'axios';
import { z } from 'zod';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Cambia la URL base según tu entorno
  timeout: 5000, // Tiempo límite para las solicitudes (opcional)
});

interface FetchApiOptions<T> {
  url: string;
  queryParams?: Record<string, string | number | boolean>;
  schema: z.ZodSchema<T>;
}

export const fetchApi = async <T>({
  url,
  queryParams,
  schema,
}: FetchApiOptions<T>): Promise<T> => {
  try {
    const response = await apiClient.get(url, {
      params: queryParams,
    });

    const parsed = schema.safeParse(response.data);

    if (!parsed.success) {
      console.error("❌ Error validando datos con Zod:", parsed.error.format());
      throw new Error("Respuesta inválida del servidor (formato incorrecto)");
    }

    return parsed.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      const hasResponse = !!err.response;
      const resData = err.response?.data;

      const message = hasResponse
        ? resData?.message || resData?.error || `Error HTTP ${err.response?.status}`
        : 'No se pudo conectar con el servidor. Verifica tu conexión o URL.';

      console.error("🚨 Error al hacer fetch:", {
        status: err.response?.status,
        data: resData,
        message,
      });

      throw new Error(message);
    }

    console.error("🚫 Error desconocido en fetch:", err);
    throw new Error("Error inesperado al conectarse al servidor");
  }
};