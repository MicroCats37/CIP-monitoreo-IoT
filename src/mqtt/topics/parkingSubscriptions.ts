// src/utils/mqttHandlers.ts
/*
import { useMqttStore } from "@/store/mqttStore";
import { decodeBinaryToStates, convertHexToBinary } from '@/utils/decodecEstacionamiento';
import { subscribeToTopic, unsubscribeFromTopic } from "../mqttFunctions";

// Tópicos
export const TOPICS: { [key: string]: string } = {
  sotano1: 'estacionamientos/sotano1',
  sotano2: 'estacionamientos/sotano2',
  sotano3: 'estacionamientos/sotano3',
  sotano4: 'estacionamientos/sotano4',
};

// Función para suscribirse a un sótano basado en el id
export const subscribeSotano = (id: string) => {
  const topic = TOPICS[`sotano${id}`];
  if (topic) {
    subscribeToTopic(topic);
  }
};

// Función para desuscribirse de un sótano basado en el id
export const unsubscribeSotano = (id: string) => {
  const topic = TOPICS[`sotano${id}`];
  if (topic) {
    unsubscribeFromTopic(topic);
  }
};
*/

// src/utils/mqttHandlers.ts

import { useMqttStore } from "@/store/mqttStore";
import { decodeBinaryToStates, convertHexToBinary } from '@/utils/decodecEstacionamiento';

// Tópicos
export const TOPICS: { [key: string]: string } = {
  sotano1: 'estacionamientos/sotano1',
  sotano2: 'estacionamientos/sotano2',
  sotano3: 'estacionamientos/sotano3',
  sotano4: 'estacionamientos/sotano4',
};

// Función para suscribirse a un sótano basado en el id
export const subscribeSotano = (id: string) => {
  const topic = TOPICS[`sotano${id}`];
  const { subscribeToTopic, setSubsData } = useMqttStore.getState();

  if (topic) {
    subscribeToTopic(topic, (message) => {
      const blockStates = decodeBinaryToStates(convertHexToBinary(message.data));
      setSubsData(topic, blockStates);
    });
  }
};

// Función para desuscribirse de un sótano basado en el id
export const unsubscribeSotano = (id: string) => {
  const topic = TOPICS[`sotano${id}`];
  const { unsubscribeFromTopic } = useMqttStore.getState();
  if (topic) {
    unsubscribeFromTopic(topic);
  }
};
