import { z } from 'zod';
// Importa los esquemas definidos previamente.
import apiClient from './apiClient'; 
import { BoardType, BoardTypeSchema, type ParkingType, ParkingTypeSchema, VariatorsType, VariatorsTypeSchema, WaterPumpType, WaterPumpTypeSchema,SCIType,SCITypeSchema, AirConditioningType, AirConditioningTypeSchema } from '@/types';
import { AxiosError } from 'axios';


export const getParkingData = async (id: string): Promise<ParkingType> => {
  try {
    const response = await apiClient.get(`/sotanos/${id}`);

    // Validar que la respuesta cumpla con el esquema ParkingDataSchema
    const parsedData = ParkingTypeSchema.parse(response.data);

    return parsedData;
  } catch (error: unknown) {  // Usamos 'unknown' aquí
    // Verificamos si el error es de tipo AxiosError
    if (error instanceof AxiosError) {
      console.error(
        "Error al obtener datos de estacionamiento:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error desconocido o no hay respuesta de la solicitud.");
    }
    throw new Error("Error al obtener datos del estacionamiento");
  }
};

// Función para obtener datos de bombas de agua
export const getWaterPumpData = async (id: string): Promise<WaterPumpType[]> => {
  try {
    const response = await apiClient.get(`/bombas/${id}`);

    // Validar que la respuesta sea un array de objetos de tipo WaterPumpType
    const parsedData = z.array(WaterPumpTypeSchema).parse(response.data);

    return parsedData;
  } catch (error: unknown) {  // Usamos 'unknown' aquí
    if (error instanceof AxiosError) {
      console.error('Error al obtener datos de bombas de agua:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido o no hay respuesta de la solicitud.');
    }
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
  } catch (error: unknown) {  // Usamos 'unknown' aquí
    if (error instanceof AxiosError) {
      console.error('Error al obtener datos de tableros:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido o no hay respuesta de la solicitud.');
    }
    throw error;
  }
};

// Función para obtener datos de variadores
export const getVariatorData = async (id: string): Promise<VariatorsType[]> => {
  try {
    const response = await apiClient.get(`/variadores/${id}`);

    // Validar que la respuesta sea un array de objetos de tipo VariatorsType
    const parsedData = z.array(VariatorsTypeSchema).parse(response.data);

    return parsedData;
  } catch (error: unknown) {  // Usamos 'unknown' aquí
    if (error instanceof AxiosError) {
      console.error('Error al obtener datos de variadores de agua:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido o no hay respuesta de la solicitud.');
    }
    throw error;
  }
};

// Función para obtener los datos de alarmas
export const getSCIData = async (): Promise<SCIType> => {
  try {
    const response = await apiClient.get('/sci');  // Asegúrate de que la URL sea la correcta
    // Validar que la respuesta cumpla con el esquema SCITypeSchema usando safeParse
    const result = SCITypeSchema.safeParse(response.data);

    if (!result.success) {
      // Si no pasa la validación, mostramos los errores
      console.error("Errores de validación de Zod:", result.error.errors);
      throw new Error("Datos no válidos");
    }

    return result.data; // Si pasa la validación, devolvemos los datos
  } catch (error: unknown) {  // Usamos 'unknown' aquí
    if (error instanceof AxiosError) {
      console.error(
        "Error al obtener datos de alarmas:",
        error.response?.data || error.message
      );
    } else if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Error desconocido o no hay respuesta de la solicitud.");
    }
    throw new Error("Error al obtener datos de alarmas");
  }
};
// Función para obtener los datos de aire acondicionado
export const getAirConditioningData = async (port: string): Promise<AirConditioningType> => {
  try {
    const response = await apiClient.get(`/aire-acondicionado/${port}`); 
    const result = AirConditioningTypeSchema.safeParse(response.data);
    // Validar que la respuesta sea un objeto con la estructura correcta
    if (!result.success) {
      // Si no pasa la validación, mostramos los errores
      console.error("Errores de validación de Zod:", result.error.errors);
      throw new Error("Datos no válidos");
    }

    return result.data; // Si pasa la validación, devolvemos los datos
  } catch (error: unknown) {  // Usamos 'unknown' aquí
    if (error instanceof AxiosError) {
      console.error(
        "Error al obtener datos de alarmas:",
        error.response?.data || error.message
      );
    } else if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Error desconocido o no hay respuesta de la solicitud.");
    }
    throw new Error("Error al obtener datos de alarmas");
  }
};