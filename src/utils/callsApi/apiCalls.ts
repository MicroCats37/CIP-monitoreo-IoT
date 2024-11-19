import { z } from 'zod';
// Importa los esquemas definidos previamente.
import apiClient from './apiClient'; 
import { BoardType, BoardTypeSchema, type ParkingType, ParkingTypeSchema, WaterPumpType, WaterPumpTypeSchema } from '@/types';

// Función para obtener datos de estacionamientos
export const getParkingData = async (id: string): Promise<ParkingType[]> => {
  try {
    const response = await apiClient.get(`/sotanos/${id}`);

    // Validar que la respuesta sea un array de objetos de tipo ParkingType
    const parsedData = z.array(ParkingTypeSchema).parse(response.data);

    return parsedData;
  } catch (error: any) {
    console.error('Error al obtener datos de estacionamiento:', error.response?.data || error.message);
    throw error;
  }
};

// Función para obtener datos de bombas de agua
export const getWaterPumpData = async (id: string): Promise<WaterPumpType[]> => {
  try {
    const response = await apiClient.get(`/bombas/${id}`);

    // Validar que la respuesta sea un array de objetos de tipo WaterPumpType
    const parsedData = z.array(WaterPumpTypeSchema).parse(response.data);

    return parsedData;
  } catch (error: any) {
    console.error('Error al obtener datos de bombas de agua:', error.response?.data || error.message);
    throw error;
  }
};

// Función para obtener datos de tableros
export const getBoardData = async (): Promise<BoardType[]> => {
  try {
    const response = await apiClient.get(`/tableros`);

    // Validar que la respuesta sea un array de objetos de tipo BoardType
    const parsedData = z.array(BoardTypeSchema).parse(response.data);

    return parsedData;
  } catch (error: any) {
    console.error('Error al obtener datos de tableros:', error.response?.data || error.message);
    throw error;
  }
};