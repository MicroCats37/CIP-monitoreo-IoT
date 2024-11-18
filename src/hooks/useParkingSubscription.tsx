// src/hooks/useParkingSubscription.ts
import { useEffect } from 'react';
import { useMqttStore } from '@/store/mqttStore';

const useParkingSubscription = (topic: string) => {
  const { subscribeToTopic, unsubscribeFromTopic, setParkingData, parkingData } = useMqttStore();

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      const blockStates = message.data; 
      setParkingData(topic, blockStates); 
    };

    subscribeToTopic(topic, handleNewMessage);

    return () => {
      unsubscribeFromTopic(topic);
    };
  }, [topic, subscribeToTopic, unsubscribeFromTopic, setParkingData]);

  return parkingData[topic] || []; 
};

export default useParkingSubscription;
