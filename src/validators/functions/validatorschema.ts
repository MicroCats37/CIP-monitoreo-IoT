import { apiClient } from "@/utils/callsApi/apiClient";
import { AxiosError } from "axios";
import { ZodSchema } from "zod";


// Función genérica para manejar solicitudes
export async function fetchData<T>(url: string, schema: ZodSchema<T>): Promise<T> {
  try {
    const response = await apiClient.get(url);
    const result = schema.safeParse(response.data);

    if (!result.success) {
      console.error("Errores de validación de Zod:", result.error.errors);
      throw new Error("Datos no válidos");
    }

    return result.data; // Datos validados correctamente
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error en la solicitud:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Error genérico:", error.message);
    } else {
      console.error("Error desconocido.");
    }
    throw new Error("Error al obtener datos");
  }
}
