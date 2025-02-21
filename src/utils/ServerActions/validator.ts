"use server";

import { ZodSchema } from "zod";

// Función genérica para validar datos en Server Actions
export async function fetchDataAction<T>(
  action: () => Promise<unknown>,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const data = await action();

    const result = schema.safeParse(data);

    if (!result.success) {
      console.error("Errores de validación de Zod:", result.error.errors);
      // Lanzar un error con información más detallada para el cliente
      throw new Error(JSON.stringify(result.error.errors)); // Importante para Server Components
    }

    return result.data;
  } catch (error: unknown) {
    // Manejo de errores más robusto
    if (error instanceof Error) {
      console.error("Error en Server Action:", error.message);
      // Re-lanzar el error para que se propague al cliente
      throw new Error(error.message); // Importante para Server Components

    } else {
      console.error("Error desconocido en Server Action:", error);
      throw new Error("Error desconocido al procesar la acción.");
    }
  }
}