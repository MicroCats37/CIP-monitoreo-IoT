import axios from 'axios';
import apiClient from './apiClient';

export const getData = async () => {
  try {
    const response = await apiClient.get('/getData');
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw error;
  }
};

export const getParkingData = async (id: string) => { 
  try { const response = await apiClient.get(`/sotanos/${id}`); 
  return response.data; 
  } 
  catch (error) { 
    console.error('Error al obtener datos:', error); 
    throw error; 
}};


export const getWaterPumpData = async (id: string) => { 
  try { const response = await apiClient.get(`/bombas/${id}`); 
  return response.data; 
  } 
  catch (error) { 
    console.error('Error al obtener datos:', error); 
    throw error; 
}};

export const getBoardData = async () => { 
  try { const response = await apiClient.get(`/tableros`); 
  return response.data; 
  } 
  catch (error) { 
    console.error('Error al obtener datos:', error); 
    throw error; 
}};