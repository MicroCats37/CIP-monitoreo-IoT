import { useEffect } from "react";
import { useMQTTManager } from "./useMqttManager";

export const useMqttSubcriptions = (topic: string,topicName:string) => {
  const {
    subscribeToTopic,
    unsubscribeFromTopic,
    setSubsData
  } = useMQTTManager(); // ✅ Solo una llamada

  useEffect(() => {
    if (topic) {
      subscribeToTopic(topic,topicName, (message) => {
        setSubsData(topic,message);
      });
    }

    return () => {
      if (topic) unsubscribeFromTopic(topic);
    };
  }, [topic, subscribeToTopic, unsubscribeFromTopic, setSubsData]);
};
