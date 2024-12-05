import { useMqttStore } from "@/store/mqttStore";
import { useEffect } from "react";


// Tópicos
export const TOPICS: { [key: string]: string } = {
  variadoraguapotable: 'dashboard/variadores/agua-potable',
  variadoraguastratadas: 'dashboard/variadores/aguas-tratadas',
  variadoraguasgrises: 'dashboard/variadores/aguas-grises',
};

export const useVariatorsSubscription = (id: string) => {
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