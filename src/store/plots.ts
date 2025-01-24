import { PlotDataType } from '@/types';
import { create } from 'zustand';

type HistoricalDataType = PlotDataType[][];

interface HistoricalStore {
  currentData: PlotDataType[];
  historicalData: { [topic: string]: HistoricalDataType };
  addData: (topic: string, currentData: PlotDataType[], identifierKey?: string) => void;
  initializeData: (topic: string, initialData: HistoricalDataType) => void;
}

export const useHistoricalStore = create<HistoricalStore>()((set) => ({
  historicalData: {},
  currentData: [],
  addData: (topic, currentData, identifierKey) => {
    set((state) => {
      if (!Array.isArray(currentData)) {
        return state;
      }
      const updatedHistoricalData = { ...state.historicalData };

      // Asegurar que el topic existe en `historicalData`
      if (!updatedHistoricalData[topic]) {
        updatedHistoricalData[topic] = [];
      }

      currentData.forEach((currentItem) => {
        const currentTimeWithoutMs = currentItem.time.split(/[.Z]/)[0] + 'Z';

        if (identifierKey) {
          // Caso con `identifierKey`
          const currentIdentifier = currentItem.data[identifierKey];

          // Buscar historial que coincida con el identificador
          const matchingHistoryIndex = updatedHistoricalData[topic].findIndex((history) => {
            const lastItem = history[history.length - 1]; // Último valor del historial
            return lastItem?.data[identifierKey] === currentIdentifier;
          });

          if (matchingHistoryIndex !== -1) {
            const matchingHistory = updatedHistoricalData[topic][matchingHistoryIndex];
            const lastMatchingItem = matchingHistory[matchingHistory.length - 1];
            const lastMatchingTimeWithoutMs = lastMatchingItem.time.split(/[.Z]/)[0] + 'Z';

            if (currentTimeWithoutMs !== lastMatchingTimeWithoutMs) {
              // Agregar nuevo valor si no coincide el tiempo
              updatedHistoricalData[topic][matchingHistoryIndex].push(currentItem);
            }
          } else {
            // Crear un nuevo historial si no existe uno coincidente
            updatedHistoricalData[topic].push([currentItem]);
          }
        } else {
          // Caso sin `identifierKey` (datos únicos, como el sistema contra incendios)
          const lastHistory = updatedHistoricalData[topic][updatedHistoricalData[topic].length - 1];
          const lastItem = lastHistory?.[lastHistory.length - 1]; // Último valor del último historial
          const lastTimeWithoutMs = lastItem?.time.split(/[.Z]/)[0] + 'Z';

          if (!lastItem || currentTimeWithoutMs !== lastTimeWithoutMs) {
            // Crear un nuevo historial si no existe o si el tiempo no coincide
            updatedHistoricalData[topic].push([currentItem]);
          }
        }
      });
      return {
        historicalData: updatedHistoricalData,
        currentData:currentData,
      };
    });
  },
  initializeData: (topic, initialData) => {
    set((state) => ({
      historicalData: {
        ...state.historicalData,
        [topic]: initialData,
      },
    }));
  },
}));
