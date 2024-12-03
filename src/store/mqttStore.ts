


import { create } from 'zustand';
import { getClient } from '@/mqtt/mqttClient';
import { toast } from 'sonner';

// Define el tipo de datos del estado global
interface MqttStore {
  subscribedTopics: { [topic: string]: number }; // Cada tópico tiene un contador de suscripciones
  subsData: { [topic: string]: any }; 
  setSubsData: (topic: string, data: any) => void;
  subscribeToTopic: (topic: string, onMessage: (message: any) => void) => void;
  unsubscribeFromTopic: (topic: string) => void;
}

export const useMqttStore = create<MqttStore>()(
  //persist(
  (set, get) => ({
    subscribedTopics: {},
    subsData: {},

    // Función para suscribirse a un tópico
    subscribeToTopic: (topic, onMessage) => {
      const { subscribedTopics } = get();
      const client = getClient();

      if (!subscribedTopics[topic]) {
        // Si no hay suscripciones activas, suscríbete al tópico
        subscribedTopics[topic] = 1;

        // Suscribirse al tópico en el cliente MQTT
        client.subscribe(topic, { qos: 0 }, (err) => {
          if (err) {
            console.error(`Error al suscribirse al tópico ${topic}:`, err);
          } else {
            console.log(`Suscrito al tópico: ${topic}`);
            toast.success(`Conexión MQTT establecida para ${topic}`);
          }
        });

        // Solo registramos el listener una vez
        client.on('message', (receivedTopic, message) => {
          // Verificamos si el tópico recibido es el que estamos suscritos
          if (receivedTopic === topic) {
            try {
              const parsedMessage = JSON.parse(message.toString());
              onMessage(parsedMessage); // Llamamos al callback con el mensaje
              //console.log(`Mensaje recibido para ${topic}:`, parsedMessage);
            } catch (err) {
              console.error(`Error al parsear el mensaje de ${topic}:`, err);
            }
          }
        });
      } else {
        // Si ya estamos suscritos, solo incrementamos el contador
        subscribedTopics[topic]++;
      }

      // Actualizamos el estado global
      set({ subscribedTopics });
    },

    // Función para desuscribirse de un tópico
    unsubscribeFromTopic: (topic) => {
      const { subscribedTopics } = get();
      const client = getClient();

      if (subscribedTopics[topic]) {
        // Decrementamos el contador de suscripciones
        subscribedTopics[topic]--;

        if (subscribedTopics[topic] === 0) {
          // Si no quedan suscriptores, desuscribimos
          client.unsubscribe(topic, (err) => {
            if (err) {
              console.error(`Error al desuscribirse del tópico ${topic}:`, err);
            } else {
              console.log(`Desuscrito del tópico: ${topic}`);
            }
          });

          // Eliminamos el tópico de las suscripciones
          delete subscribedTopics[topic];
        }
      }

      // Actualizamos el estado global
      set({ subscribedTopics });
    },

    // Función para actualizar los datos de un tópico
    setSubsData: (topic, data) => {
      set((state) => ({
        subsData: { ...state.subsData, [topic]: data },
      }));
    },
  })
);
