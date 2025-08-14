"use client";

import { QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate";

export function formatDateTimeByRange(value: string, timeRange: QueryTimeType) {
  const date = new Date(value);

  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) return "Fecha inválida";

  switch (timeRange) {
    case "30m":
    case "1h":
    case "8h":
      return date.toLocaleTimeString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Formato 24 horas
      });

    case "1d":
      return date.toLocaleTimeString("es-ES", {
        weekday: "long", // Nombre del día
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

    case "7d":
    case "30d":
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });

    default:
      return value;
  }
}
