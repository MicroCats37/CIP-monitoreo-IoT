import { useMqttStore } from "@/store/mqttStore";
import { useEffect } from "react";

// Tópicos
export const TOPICS: { [key: string]: string } = {
  aire1: 'aire-acondicionado/1',
  aire2: 'aire-acondicionado/2',
};


export const useAirConditioningSubscription = (id: string) => {
  const subscribeToTopic = useMqttStore((state) => state.subscribeToTopic);
  const unsubscribeFromTopic = useMqttStore((state) => state.unsubscribeFromTopic);
  const setSubsData = useMqttStore((state) => state.setSubsData);
  const topic = TOPICS[`aire${id}`];

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
