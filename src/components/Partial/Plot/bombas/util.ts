import { WaterPumpType } from "@/types";

export const mergeCurrentWithHistory = (
    historial: WaterPumpType[][],
    currentData: WaterPumpType[]
  ): WaterPumpType[][] => {
    // Convertir currentData en un mapa para acceso rápido por bomba
    const currentDataMap = currentData.reduce((acc, item) => {
      acc[item.data.bomba] = item;
      return acc;
    }, {} as Record<string, WaterPumpType>);
  
    // Recorrer el historial y añadir los valores actuales
    return historial.map((bombaHistory) => {
      if (bombaHistory.length === 0) return bombaHistory;
  
      // Obtener el nombre de la bomba desde el historial
      const bombaName = bombaHistory[0].data.bomba;
  
      // Si hay un dato actual para esta bomba, añadirlo al inicio del historial
      const currentEntry = currentDataMap[bombaName];
      return currentEntry ? [currentEntry, ...bombaHistory] : bombaHistory;
    });
  };