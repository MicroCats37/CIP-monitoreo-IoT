// src/utils/mqttClient.ts
import mqtt, { MqttClient } from 'mqtt';

const MQTT_BROKER_URL = process.env.NEXT_PUBLIC_MQTT_WEBSOCKET_URL;
let client: mqtt.MqttClient | null = null;


export const getClient = () => {
  
  if (!MQTT_BROKER_URL) {
    throw new Error("La URL del broker MQTT no está definida. Verifica la variable de entorno MQTT_WEBSOCKET_URL.");
  }

  const options = {
    protocolId: "MQTT", // Aseguramos que se usa MQTT
    protocolVersion: 4, // Usamos MQTT 3.1.1 (4 es el protocolo para MQTT 3.1.1)
    clean: true, // Nueva sesión limpia
    reconnectPeriod: 1000, // Intentos de reconexión en milisegundos
  };


  if (!client) {
    // Crear la conexión solo si no existe una conexión activa
    client = mqtt.connect(MQTT_BROKER_URL,{
      protocolId: "MQTT", // Aseguramos que se usa MQTT
      protocolVersion: 4, // Usamos MQTT 3.1.1 (4 es el protocolo para MQTT 3.1.1)
      clean: true, // Nueva sesión limpia
      reconnectPeriod: 1000, // Intentos de reconexión en milisegundos
    });

    client.on('connect', () => {
      console.log('Conectado al broker MQTT');
    });

    client.on('error', (error) => {
      console.error('Error de conexión:', error);
      client?.end();
    });

    client.on('close', () => {
      console.log('Conexión cerrada');
    });
  }

  return client;
};

export const disconnectMQTT = () => {
  if (client) {
    client.end();
    client = null;
  }
};
