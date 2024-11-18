import { useMqttStore } from "@/store/mqttStore";

export const subscribeBoards = () => {
  const topic = 'tableros';
  const { subscribeToTopic, setSubsData } = useMqttStore.getState();

  if (topic) {
    subscribeToTopic(topic, (message) => {
      setSubsData(topic, message);
    });
  }
};

// Función para desuscribirse de un sótano basado en el id
export const unsubscribeBoards = () => {
  const topic = 'tableros';
  const { unsubscribeFromTopic } = useMqttStore.getState();
  if (topic) {
    unsubscribeFromTopic(topic);
  }
};
