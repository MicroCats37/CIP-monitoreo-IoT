
import { useMqttStore } from "@/store/mqttStore";
import { useEffect } from "react";

// Tópicos
export const TOPICS: { [key: string]: string } = {
  sotano1a: 'dashboard/estacionamientos/sotano/1a',
  sotano2a: 'dashboard/estacionamientos/sotano/2a',
  sotano3a: 'dashboard/estacionamientos/sotano/3a',
  sotano4a: 'dashboard/estacionamientos/sotano/4a',
  sotano1b: 'dashboard/estacionamientos/sotano/1b',
  sotano2b: 'dashboard/estacionamientos/sotano/2b',
  sotano3b: 'dashboard/estacionamientos/sotano/3b',
  sotano4b: 'dashboard/estacionamientos/sotano/4b',
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
