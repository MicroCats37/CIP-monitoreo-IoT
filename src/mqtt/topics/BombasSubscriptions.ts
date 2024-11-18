
import { useMqttStore } from "@/store/mqttStore";


// Tópicos
export const TOPICS: { [key: string]: string } = {
  aguapotable: 'bombas/agua-potable',
  aguastratadas: 'bombas/aguas-tratadas',
  aguasgrises: 'bombas/aguas-grises',
};

// Función para suscribirse a un sótano basado en el id
export const subscribeWaterPump = (id: string) => {
  const topic = TOPICS[`${id}`];
  const { subscribeToTopic, setSubsData } = useMqttStore.getState();
  if (topic) {
    subscribeToTopic(topic, (message) => {
      setSubsData(topic, message);
    });
  }
};

// Función para desuscribirse de un sótano basado en el id
export const unsubscribeWaterPump = (id: string) => {
  const topic = TOPICS[`${id}`];
  const { unsubscribeFromTopic } = useMqttStore.getState();
  if (topic) {
    unsubscribeFromTopic(topic);
  }
};
