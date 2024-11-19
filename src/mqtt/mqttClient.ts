// src/utils/mqttClient.ts
import mqtt, { MqttClient } from 'mqtt';

const MQTT_BROKER_URL = process.env.NEXT_PUBLIC_MQTT_WEBSOCKET_URL;
let client: mqtt.MqttClient | null = null;

export const getClient = (): MqttClient => {
  if (!client) {
    client = mqtt.connect(MQTT_BROKER_URL!, {
      protocolId: 'MQTT',
      protocolVersion: 4,
      clean: true,
      connectTimeout: 1000,
      reconnectPeriod: 0,
    });

    client.on('connect', () => {
      console.log('Conectado al broker MQTT');
    });

    client.on('message', (topic, message) => {
      // Aquí podrías propagar el mensaje a las funciones relevantes
      console.log(`Mensaje recibido en ${topic}:`, message.toString());
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

