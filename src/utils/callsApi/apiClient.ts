import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Cambia la URL base según tu entorno
  timeout: 5000, // Tiempo límite para las solicitudes (opcional)
});


export const fetchApi = async <T>(url: string): Promise<T> => {
  const response = await apiClient.get(url);
  return response.data;
};
