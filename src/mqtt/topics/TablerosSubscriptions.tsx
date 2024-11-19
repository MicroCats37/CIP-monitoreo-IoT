import { useMqttStore } from "@/store/mqttStore";
import { useEffect } from "react";

export const useBoardSubscription = () => {
  const subscribeToTopic = useMqttStore((state) => state.subscribeToTopic);
  const unsubscribeFromTopic = useMqttStore((state) => state.unsubscribeFromTopic);
  const setSubsData = useMqttStore((state) => state.setSubsData);
  const topic = 'tableros';

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

