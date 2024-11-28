// src/utils/mqttClient.ts
import mqtt, { MqttClient } from 'mqtt';

const MQTT_BROKER_URL = process.env.NEXT_PUBLIC_MQTT_WEBSOCKET_URL;
let client: mqtt.MqttClient | null = null;

// let lastMessageListener: (topic: string, message: Buffer) => void;

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

    client.on('error', (error) => {
      console.error('Error de conexión:', error);
      client?.end();
    });

    client.on('close', () => {
      console.log('Conexión cerrada');
    });
  }


  removeAllExceptLastListener();

  return client;
};



const removeAllExceptLastListener = () => {
  if (client) {
    const listeners = client.listeners('message');  // Obtener todos los listeners
    if (listeners.length > 2) {
      // Eliminar todos los listeners excepto el último
      listeners.slice(0, -2).forEach(listener => {
        client!.removeListener('message', listener);
      });
    }
  }
};