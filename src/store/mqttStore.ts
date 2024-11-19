/*import { create } from 'zustand';
import mqtt, { MqttClient } from 'mqtt';
import { convertHexToBinary, decodeBinaryToStates } from '@/utils/decodecEstacionamiento';
import {persist} from 'zustand/middleware'
// Define el tipo de datos del estado global
interface MqttStore {

  subscribedTopics: { [topic: string]: number };
  subsData: { [topic: string]: string[] };
  setSubsData: (topic: string, data: string[]) => void;
  updateSubscribedTopics: (topic: string, count: number) => void;
}

export const useMqttStore = create<MqttStore>()(persist(
  (set) => ({
    subsData: {},

    setSubsData: (topic, data) => {
      set((state) => ({
        subsData: { ...state.subsData, [topic]: data },
      }));
    },

    subscribedTopics: {},

    updateSubscribedTopics: (topic, count) => {
      set((state) => ({
        subscribedTopics: {
          ...state.subscribedTopics,
          [topic]: (state.subscribedTopics[topic] || 0) + count,
        },
      }));
    },
}),{
  name:'storage-zzz'
}));
*/

/*
manageSubscription: (topic, action) => {
    const { ensureClient, subscribedTopics, setSubsData } = get();
    const client = ensureClient();

    if (action === 'subscribe') {
      if (!subscribedTopics[topic]) {
        subscribedTopics[topic] = 1;
        client.subscribe(topic, { qos: 0 }, (err) => {
          if (err) {
            console.error(`Error al suscribirse al tópico ${topic}:`, err);
          } else {
            console.log(`Suscrito al tópico: ${topic}`);
          }
        });

        client.on('message', (receivedTopic, message) => {
          if (receivedTopic === topic) {
            const parsedMessage = JSON.parse(message.toString());
            const blockStates = decodeBinaryToStates(convertHexToBinary(parsedMessage.data));
            setSubsData(topic, blockStates);
          }
        });
      } else {
        subscribedTopics[topic]++;
      }
    } else if (action === 'unsubscribe' && subscribedTopics[topic]) {
      subscribedTopics[topic]--;
      if (subscribedTopics[topic] === 0) {
        client.unsubscribe(topic, (err) => {
          if (err) {
            console.error(`Error al desuscribirse del tópico ${topic}:`, err);
          } else {
            console.log(`Desuscrito del tópico: ${topic}`);
          }
        });
        delete subscribedTopics[topic];
      }
    }

    set({ subscribedTopics });
  },
*/






// Define el tipo de datos del estado global
import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import mqtt, { MqttClient } from 'mqtt';
import { toast } from 'sonner';

// Define el tipo de datos del estado global
interface MqttStore {
  client: MqttClient | null;
  subscribedTopics: { [topic: string]: number }; // Cada tópico tiene un contador de suscripciones
  subsData: { [topic: string]: any }; 
  setSubsData: (topic: string, data: object) => void;
  ensureClient: () => MqttClient; // Asegura que el cliente esté activo, o crea uno nuevo
  subscribeToTopic: (topic: string, onMessage: (message: any) => void) => void;
  unsubscribeFromTopic: (topic: string) => void;
}

export const useMqttStore = create<MqttStore>()(
  persist(
  (set, get) => ({
    client: null,
    subscribedTopics: {},
    subsData: {},  

    // Asegura que el cliente MQTT esté activo
    ensureClient: () => {
      let client = get().client;

      if (!client) {
        // Crear una nueva instancia de cliente si no existe
        client = mqtt.connect('mqtt://localhost:9001', {
          protocolId: 'MQTT',
          protocolVersion: 4,
          clean: true,
          connectTimeout: 1000,
          reconnectPeriod: 0
        });

        // Configuración de eventos del cliente
        client.on('connect', () => console.log('Conectado al broker MQTT'));

        client.on('error', (error) => {
          console.error('Error de conexión:', error);
          client?.end();
          toast.error('Error de conexión al broker MQTT');
        });

        client.on('close', () => console.log('Conexión cerrada'));

        // Actualizar el estado global con el cliente activo
        set({ client });
      }
      return client;
    },

    // Función para suscribirse a un tópico
    subscribeToTopic: (topic, onMessage) => {
      const { ensureClient, subscribedTopics } = get();
      const client = ensureClient();

      if (!subscribedTopics[topic]) {
        // Iniciar el contador para el tópico si no existe
        subscribedTopics[topic] = 1;

        // Suscribirse al tópico en el cliente MQTT
        client.subscribe(topic, { qos: 0 }, (err) => {
          if (err) {
            console.error(`Error al suscribirse al tópico ${topic}:`, err);
          } else {
            console.log(`Suscrito al tópico: ${topic}`);
            toast.success('Conexión MQTT establecida');
          }
        });

        // Manejar la recepción de mensajes solo una vez por cada tópico
        client.on('message', (receivedTopic, message) => {
          if (receivedTopic === topic) {
            try {
              const parsedMessage = JSON.parse(message.toString());
              console.log('Mensaje recibido:', parsedMessage);
              onMessage(parsedMessage);
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
      const { client, subscribedTopics } = get();

      if (subscribedTopics[topic]) {
        // Decrementar el contador de suscripciones
        subscribedTopics[topic]--;

        if (subscribedTopics[topic] === 0) {
          // Si no hay suscriptores restantes, desuscribirse del tópico
          client?.unsubscribe(topic, (err) => {
            if (err) {
              console.error(`Error al desuscribirse del tópico ${topic}:`, err);
            } else {
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
  }),{name:"store"})
);



/*
manageSubscription: (topic, action) => {
    const { ensureClient, subscribedTopics, setSubsData } = get();
    const client = ensureClient();

    if (action === 'subscribe') {
      if (!subscribedTopics[topic]) {
        subscribedTopics[topic] = 1;
        client.subscribe(topic, { qos: 0 }, (err) => {
          if (err) {
            console.error(`Error al suscribirse al tópico ${topic}:`, err);
          } else {
            console.log(`Suscrito al tópico: ${topic}`);
          }
        });

        client.on('message', (receivedTopic, message) => {
          if (receivedTopic === topic) {
            const parsedMessage = JSON.parse(message.toString());
            const blockStates = decodeBinaryToStates(convertHexToBinary(parsedMessage.data));
            setSubsData(topic, blockStates);
          }
        });
      } else {
        subscribedTopics[topic]++;
      }
    } else if (action === 'unsubscribe' && subscribedTopics[topic]) {
      subscribedTopics[topic]--;
      if (subscribedTopics[topic] === 0) {
        client.unsubscribe(topic, (err) => {
          if (err) {
            console.error(`Error al desuscribirse del tópico ${topic}:`, err);
          } else {
            console.log(`Desuscrito del tópico: ${topic}`);
          }
        });
        delete subscribedTopics[topic];
      }
    }

    set({ subscribedTopics });
  },
*/
