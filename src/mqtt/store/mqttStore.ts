//import {persist} from 'zustand/middleware'
import { create } from 'zustand';
import { getClient } from '@/mqtt/mqttClient';
import { toast } from 'sonner';
import type { BoardType,  ParkingType, SCIType, VariatorsType, WaterPumpType,  AirConditioningType, PoolType, CO2Type } from '@/types';
import { AirConditioningTypeSchema, ArrayBoardTypeSchema, ArrayPoolTypeSchema, ArrayVariatorsTypeSchema, ArrayWaterPumpTypeSchema, CO2TypeSchema, ParkingTypeSchema, PoolTypeSchema, SCITypeSchema } from '@/validators/schemas';



const schemas = [
  AirConditioningTypeSchema,
  SCITypeSchema,
  ParkingTypeSchema,
  ArrayWaterPumpTypeSchema,
  ArrayBoardTypeSchema,
  ArrayVariatorsTypeSchema,
  PoolTypeSchema,
  CO2TypeSchema
];


export const topicNames: { [key: string]: string } = {
  "dashboard/aire-acondicionado/1": "Aire Acondicionado 1",
  "dashboard/aire-acondicionado/2": "Aire Acondicionado 2",
  'dashboard/bombas/agua-potable': "Bombas Agua Potable",
  'dashboard/bombas/aguas-tratadas': "Bombas Aguas Tratadas",
  'dashboard/bombas/aguas-grises': "Bombas Agua Grises",
  'dashboard/estacionamientos/sotano/1a': "Estacionamiento Sotano 1A",
  'dashboard/estacionamientos/sotano/2a': "Estacionamiento Sotano 2A",
  'dashboard/estacionamientos/sotano/3a': "Estacionamiento Sotano 3A",
  'dashboard/estacionamientos/sotano/4a': "Estacionamiento Sotano 4A",
  'dashboard/estacionamientos/sotano/1b': "Estacionamiento Sotano 1B",
  'dashboard/estacionamientos/sotano/2b': "Estacionamiento Sotano 2B",
  'dashboard/estacionamientos/sotano/3b': "Estacionamiento Sotano 3B",
  'dashboard/estacionamientos/sotano/4b': "Estacionamiento Sotano 4B",
  'dashboard/sci': "Sistema Contra Incendios",
  'dashboard/tableros': "Tableros Electricos",
  'dashboard/variadores/agua-potable': "Variadores Agua Potable",
  'dashboard/variadores/aguas-tratadas': "Variadores Aguas Tratables",
  'dashboard/variadores/aguas-grises': "Variadores Aguas Grises",
  'dashboard/piscinas/1': "Piscina 1",
  'dashboard/piscinas/2': "Piscina 2",
  'dashboard/co2': "CO2 en estacionamientos"
}

const getTopicName = (topic:string) => {
  return topicNames[topic] || `Dispositivo desconocido para el topic: ${topic}`;
};


// Unificar todos los tipos de mensaje posibles
export type MqttMessageType =
  AirConditioningType
  | CO2Type
  | SCIType
  | ParkingType
  | WaterPumpType[]
  | BoardType[]
  | VariatorsType[]
  | PoolType;

// Define el tipo de datos del estado global
interface MqttStore {
  subscribedTopics: { [topic: string]: number }; // Cada tópico tiene un contador de suscripciones
  subsData: { [topic: string]: MqttMessageType };  // Los datos ahora son de tipo MqttMessageType
  setSubsData: (topic: string, data: MqttMessageType) => void;  // Recibe datos validados
  subscribeToTopic: (topic: string, onMessage: (message: MqttMessageType) => void) => void;  // Recibe cualquier tipo de mensaje
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
            const topicName = getTopicName(topic);
            toast.success(`Conexión MQTT establecida para ${topicName}`);
          }
        });

        // Solo registramos el listener una vez
        client.on('message', (receivedTopic, message) => {
          // Verificamos si el tópico recibido es el que estamos suscritos
          if (receivedTopic === topic) {
            try {
              const parsedMessage = JSON.parse(message.toString());
              // Validamos el mensaje con Zod antes de pasarlo al callback



              // Validamos el mensaje contra todos los esquemas disponibles
              for (const schema of schemas) {
                try {
                  schema.parse(parsedMessage)
                  // Si el mensaje pasa el esquema, lo enviamos
                  onMessage(parsedMessage);
                  return;
                } catch (error) {
                  // Si el mensaje no pasa, probamos con el siguiente esquema
                  continue;
                }
              }

              // Si ninguno de los esquemas valida el mensaje
              console.error('Mensaje recibido no válido según los esquemas Zod');
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
      // Validamos los datos antes de almacenarlos en el estado
      
      let isValid = false;
      
      // Validamos el mensaje contra todos los esquemas disponibles
      for (const schema of schemas) {
        try {
          
          schema.parse(data); // Si el mensaje pasa el esquema, lo almacenamos
          isValid = true;
          break;
        } catch (error) {
          continue;
        }
      }
      if (!isValid) {
        console.error('Los datos no son válidos según los esquemas Zod');
        return;
      }

      // Si los datos son válidos, actualizamos el estado
      set((state) => ({
        subsData: { ...state.subsData, [topic]: data },
      }));
    },
  })
  //,{
   // name: 'mqtt-store-iot-dashboard', // Nombre de la clave en localStorage
     // Evitar errores en SSR
  //}
//)
);
