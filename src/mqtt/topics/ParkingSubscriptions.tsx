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
import { useEffect } from "react";

// Tópicos
export const TOPICS: { [key: string]: string } = {
  sotano1a: 'estacionamientos/sotano/1a',
  sotano2a: 'estacionamientos/sotano/2a',
  sotano3a: 'estacionamientos/sotano/3a',
  sotano4a: 'estacionamientos/sotano/4a',
  sotano1b: 'estacionamientos/sotano/1b',
  sotano2b: 'estacionamientos/sotano/2b',
  sotano3b: 'estacionamientos/sotano/3b',
  sotano4b: 'estacionamientos/sotano/4b',
};


export const useParkingSubscription = (id: string) => {
  const subscribeToTopic = useMqttStore((state) => state.subscribeToTopic);
  const unsubscribeFromTopic = useMqttStore((state) => state.unsubscribeFromTopic);
  const setSubsData = useMqttStore((state) => state.setSubsData);
  const topic = TOPICS[`sotano${id}`];

  useEffect(() => {
    if (topic) {
      subscribeToTopic(topic, (message) => {
        setSubsData(topic,message);
      });
    }

    return () => {
      if (topic) unsubscribeFromTopic(topic);
    };
  }, [topic, subscribeToTopic, unsubscribeFromTopic, setSubsData]);
};
