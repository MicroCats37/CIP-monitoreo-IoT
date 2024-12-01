


 import { create } from 'zustand';
import { getClient } from '@/mqtt/mqttClient';
import { toast } from 'sonner';
import { persist } from 'zustand/middleware';

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
  //,{name: 'mqtt-data'}
  //)
);



/*
import { create } from 'zustand';
import { getClient } from '@/mqtt/mqttClient';
import { toast } from 'sonner';
import {persist} from 'zustand/middleware';

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
        // Iniciar el contador para el tópico si no existe
        subscribedTopics[topic] = 1;

        // Suscribirse al tópico en el cliente MQTT
        client.subscribe(topic, { qos: 0 }, (err) => {
          if (err) {
            console.error(`Error al suscribirse al tópico ${topic}:`, err);
          } else {
            console.log(`Suscrito al tópico: ${topic}`);
            toast.success(`Conexión MQTT establecida ${topic}`);
          }
        });

        // Crear un solo listener para todos los mensajes
        client.on('message', (receivedTopic, message) => {
          if (subscribedTopics[receivedTopic]) {
            try {
              const parsedMessage = JSON.parse(message.toString());
              //console.log('Mensaje recibido:', parsedMessage);
              // Llamar a onMessage solo para el tópico que estamos escuchando
              if (receivedTopic === topic) {
                onMessage(parsedMessage);
                console.log(parsedMessage)
              }
            } catch (err) {
              console.error('Error al parsear el mensaje MQTT:', err);
            }
          }
        });
      } else {
        // Incrementar el contador de suscripciones si ya existe
        subscribedTopics[topic]++;
      }

      // Actualizar el estado con la nueva suscripción
      set({ subscribedTopics });
    },

    // Función para desuscribirse de un tópico
    unsubscribeFromTopic: (topic) => {
      const { subscribedTopics } = get();
      const client = getClient();

      if (subscribedTopics[topic]) {
        // Decrementar el contador de suscripciones
        subscribedTopics[topic]--;

        if (subscribedTopics[topic] === 0) {
          // Si no hay suscriptores restantes, desuscribirse del tópico
          client?.unsubscribe(topic, (err) => {
            if (err) {
              console.error(`Error al desuscribirse del tópico ${topic}:`, err);
            } 

            else {
              console.log(`Desuscrito del tópico: ${topic}`);
            }

          });
          // Eliminar el tópico de las suscripciones
          delete subscribedTopics[topic];
        }
      }

      // Actualizar el estado con la nueva lista de suscripciones
      set({ subscribedTopics });
    },

    // Función para actualizar los datos de un tópico
    setSubsData: (topic, data) => {
      set((state) => ({
        subsData: { ...state.subsData, [topic]: data },
      }));
    },
  })
//,{name: 'mqtt-data'}
//)
);*/