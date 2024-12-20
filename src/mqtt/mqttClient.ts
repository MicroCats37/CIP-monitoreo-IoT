// src/utils/mqttClient.ts
import mqtt, { MqttClient } from 'mqtt';

const MQTT_BROKER_URL = process.env.NEXT_PUBLIC_MQTT_WEBSOCKET_URL;
let client: mqtt.MqttClient | null = null;
let reconnecting = false;
// let lastMessageListener: (topic: string, message: Buffer) => void;

export const getClient = (): MqttClient => {
  if (!client) {
    client = mqtt.connect(MQTT_BROKER_URL!, {
      protocolId: 'MQTT',
      protocolVersion: 4,
      clean: true,
      connectTimeout: 3000, // Aumentar el timeout a 3 segundos
      reconnectPeriod: 3000, // Intentar reconectar cada 3 segundos
      // keepalive: 60, // Enviar pings cada 60 segundos para mantener la conexión (opcional)
    });

    client.on('connect', () => {
      console.log('Conectado al broker MQTT');
      reconnecting = false; // Resetear la bandera
    });

    client.on('error', (error) => {
      console.error('Error de conexión:', error);
      if (!reconnecting) { // Evitar múltiples llamadas a end()
        client?.end(); // Cerrar la conexión actual para forzar la reconexión
        reconnecting = true;
      }
    });

    client.on('close', () => {
      console.log('Conexión cerrada');
      if (!reconnecting) {
          reconnecting = true
      }
      if (!client?.reconnecting) {
        console.log("Intentando reconectar...");
        setTimeout(() => {
            if (client)
                client.reconnect();
        }, 3000);
      }
    });

    client.on('reconnect', () => {
        console.log("Reconectando...");
    })
  }

  removeAllExceptLastListener();
  return client;
};



const removeAllExceptLastListener = () => {
  if (client) {
    const listeners = client.listeners('message');  // Obtener todos los listeners
    if (listeners.length > 1) {
      // Eliminar todos los listeners excepto el último
      listeners.slice(0, -1).forEach(listener => {
        client!.removeListener('message', listener);
      });
    }
  }
};