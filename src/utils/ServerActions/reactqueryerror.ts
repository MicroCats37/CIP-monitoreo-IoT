export const handleQueryError = (error: unknown) => {
    if (error instanceof Error) {
      try {
        // Intentar parsear el mensaje como JSON (para errores de Zod u otros)
        const parsedError = JSON.parse(error.message);
        console.error("Errores específicos:", parsedError);
  
        // Mostrar los errores parseados (puedes usar una librería de notificaciones como Sonner o React Toastify)
        alert("Error en la validación de datos: " + JSON.stringify(parsedError));
      } catch {
        // Si no se puede parsear el mensaje, es un error genérico
        console.error("Error genérico:", error.message);
        alert("Error genérico: " + error.message);
      }
    } else {
      console.error("Error desconocido:", error);
      alert("Error desconocido. Revisa la consola para más detalles.");
    }
  };
  