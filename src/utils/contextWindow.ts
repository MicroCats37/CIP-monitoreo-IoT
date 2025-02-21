import { QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate";

export function getWindowPeriod(time: QueryTimeType): string {
    switch (time) {
      case "1h":
        return "2m";  // Ventana de 2 minutos para 1 hora de datos
      case "8h":
        return "10m"; // Ventana de 10 minutos para 8 horas de datos
      case "1d":
        return "30m"; // Ventana de 30 minutos para 1 día de datos
      case "7d":
        return "2h";  // Ventana de 2 horas para 7 días de datos
      case "30d":
        return "6h";  // Ventana de 6 horas para 30 días de datos
      default:
        return "1m";  // Valor por defecto
    }
  }