import { getClient } from './mqttClient';
import { useMqttStore } from '@/store/mqttStore';
import { decodeBinaryToStates, convertHexToBinary } from '@/utils/decodecEstacionamiento';

// Función para suscribirse a un tópico
export const subscribeToTopic = (topic: string) => {

  const { updateSubscribedTopics, setSubsData } = useMqttStore.getState();
  const client=getClient();
  if (!useMqttStore.getState().subscribedTopics[topic]) {
    updateSubscribedTopics(topic, 1);
    
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
    updateSubscribedTopics(topic, 1);
  }
};

// Función para desuscribirse de un tópico
export const unsubscribeFromTopic = (topic: string) => {
    const { subscribedTopics, updateSubscribedTopics } = useMqttStore.getState();
    const client = getClient();
  
    if (subscribedTopics[topic]) {
      // Disminuye el contador del tópico en 1
      updateSubscribedTopics(topic, -1);
      // Obtiene el valor actualizado del estado
      const updatedSubscribedTopics = useMqttStore.getState().subscribedTopics;
  
      // Verifica si el contador es 0 después de actualizar
      if (updatedSubscribedTopics[topic] === 0) {
        console.log('asdasdasdasd');
        client.unsubscribe(topic, (err) => {
          if (err) {
            console.error(`Error al desuscribirse del tópico ${topic}:`, err);
          } else {
            console.log(`Desuscrito del tópico: ${topic}`);
          }
        });
      }
    } else {
      console.log('nunca entra a esta vaina');
    }
  };
  
