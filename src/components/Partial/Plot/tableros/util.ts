import { BoardType } from "@/types";

type HistoricalBoardType = BoardType[][];

export const mergeBoardDataWithHistorical = (
  historicalData: HistoricalBoardType,
  currentData: BoardType[]
): HistoricalBoardType => {
  const updatedHistoricalData: HistoricalBoardType = [];

  currentData.forEach((currentBoard) => {
    const existingHistory = historicalData.find(
      (history) => history[0]?.data.potencia === currentBoard.data.potencia
    );

    if (existingHistory) {
      // Agregar el dato actual al inicio del historial
      updatedHistoricalData.push([currentBoard, ...existingHistory]);
    } else {
      // Crear un nuevo historial si no existe
      updatedHistoricalData.push([currentBoard]);
    }
  });

  return updatedHistoricalData;
};