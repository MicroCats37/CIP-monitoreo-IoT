
import { useMqttStore } from "@/store/mqttStore";
import { useEffect } from "react";


// Tópicos
export const TOPICS: { [key: string]: string } = {
  aguapotable: 'bombas/agua-potable',
  aguastratadas: 'bombas/aguas-tratadas',
  aguasgrises: 'bombas/aguas-grises',
};

export const useWaterPumpSubscription = (id: string) => {
  const subscribeToTopic = useMqttStore((state) => state.subscribeToTopic);
  const unsubscribeFromTopic = useMqttStore((state) => state.unsubscribeFromTopic);
  const setSubsData = useMqttStore((state) => state.setSubsData);
  const topic = TOPICS[id];

  useEffect(() => {
    if (topic) {
      subscribeToTopic(topic, (message) => {
        setSubsData(topic, message);
      });
    }

    return () => {
      if (topic) unsubscribeFromTopic(topic);
    };
  }, [topic, subscribeToTopic, unsubscribeFromTopic, setSubsData]);
};
