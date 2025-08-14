import { GeneralMQTTObjectType } from "@/types";
import { useHistoricalManager } from "./useMonitoreoHistorical";
import { useEffect } from "react";

// ✅ Interfaz de la función
interface UseAddHistoricalDataHook {
  (topic: string, currentData?: GeneralMQTTObjectType): void;
}

// ✅ Implementación usando la interfaz
export const useAddHistoricalData: UseAddHistoricalDataHook = (
  topic,
  currentData
) => {
  const { addHistoricalData } = useHistoricalManager();

  useEffect(() => {
    if (currentData) {
      addHistoricalData(topic, currentData);
    }
  }, [currentData]);
};