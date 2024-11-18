import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api', // Cambia la URL base según tu entorno
  timeout: 5000, // Tiempo límite para las solicitudes (opcional)
});

export default apiClient;
