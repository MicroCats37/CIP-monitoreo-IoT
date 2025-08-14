import { create, StateCreator } from 'zustand';
import { GeneralMQTTObjectType } from '@/types';

//import { devtools } from 'zustand/middleware';




interface MqttStoreState {
  subscribedTopics: { [topic: string]: number };
  subsData: { [topic: string]: GeneralMQTTObjectType };
}

interface MqttStoreActions {
  updateSubscribedTopics: (topic: { [topic: string]: number }) => void;
  updateSubsData: (topic: string, data: GeneralMQTTObjectType) => void;
}


type MqttStoreType = MqttStoreState & MqttStoreActions;

const storeMqtt: StateCreator<MqttStoreType, [], []> = (set, get) => ({
  subscribedTopics: {},
  subsData: {},
  updateSubscribedTopics: (topic) => set({ subscribedTopics: topic }),
  updateSubsData: (topic, messages) =>
    set((state) => ({
      subsData: {
        ...state.subsData,
        [topic]: messages,
      },
    })),
  });


export const useMqttStore = create<MqttStoreType>(storeMqtt);
