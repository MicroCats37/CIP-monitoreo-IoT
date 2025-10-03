// hooks/useMQTTManager.ts
import { getClient } from '@/mqtt/mqttClient';
import { toast } from 'sonner';
import { generalMQTTObjectSchema, MQTTmessageType1Schema, MQTTmessageType2Schema, MQTTmessageType3Schema } from '@/validators/schemas';
import type { GeneralMQTTObjectType } from '@/types';
import { useMqttStore } from '@/store/storages/mqtt.store';
import { useShallow } from 'zustand/react/shallow';
import { z } from 'zod';

type Fields = Record<
  string,
  string | number | boolean | { value: string | number | boolean; label: string }[] | undefined
>;

const schemas = [generalMQTTObjectSchema];
const topicCallbacks: Record<string, ((msg: GeneralMQTTObjectType) => void)[]> = {};
export const useMQTTManager = () => {
  // Reactividad

  const subscribedTopics = useMqttStore(useShallow((s) => s.subscribedTopics));
  const updateSubscribedTopics = useMqttStore(useShallow((s) => s.updateSubscribedTopics));
  const subsData = useMqttStore(useShallow((s) => s.subsData));
  const setStoreSubsData = useMqttStore(useShallow((s) => s.updateSubsData));

  type T1 = z.infer<typeof MQTTmessageType1Schema>;
  type T2 = z.infer<typeof MQTTmessageType2Schema>;
  type T3 = z.infer<typeof MQTTmessageType3Schema>;

  const isType1 = (m: unknown): m is T1 =>
    MQTTmessageType1Schema.safeParse(m).success;

  const isType2 = (m: unknown): m is T2 =>
    MQTTmessageType2Schema.safeParse(m).success;

  const isType3 = (m: unknown): m is T3 =>
    MQTTmessageType3Schema.safeParse(m).success;

  const hasValidFields = (fields: unknown): boolean =>
    typeof fields === "object" &&
    fields !== null &&
    !Array.isArray(fields) &&
    Object.keys(fields).length > 0;

  const setSubsData = (topic: string, message: GeneralMQTTObjectType) => {
    const existingMessage = subsData[topic] as GeneralMQTTObjectType | undefined;
    // --- TYPE 1 ---
    // details: { data: MQTTDataSchema, time: string }
    if (isType1(message)) {

      const dataObj = message.details.data;
      if (!hasValidFields(dataObj.fields)) {
        console.warn("Fields vacíos (Type 1), no se actualiza:", message);
        return;
      }
      let newMessage: GeneralMQTTObjectType;
      if (existingMessage){
        newMessage=message
      }

      // Igual: decides si mergeas / reemplazas. Reemplazo directo:
      setStoreSubsData(topic, message);
      return;
      
    }

    // --- TYPE 2 ---
    // details: { data: MQTTDataSchema[], time: string }
    if (isType2(message)) {
      const dataArr = message.details.data;
      const hasValid = dataArr.some(d => hasValidFields(d.fields));
      if (!hasValid) {
        console.warn("Fields vacíos (Type 2), no se actualiza:", message);
        return;
      }

      // Aquí decides si quieres mergear por sensor.name dentro del mismo details
      // o simplemente reemplazar. Ejemplo: reemplazar directo:
      setStoreSubsData(topic, message);
      return;

    }


    // --- TYPE 3 ---
    // details: Array<{ data: MQTTDataSchema | MQTTDataSchema[], time: string }>
    if (isType3(message)) {
      const incomingArray = message.details;
      const existingArray = Array.isArray((existingMessage as any)?.details)
        ? [...(existingMessage as any).details]
        : [];

      const updatedArray = [...existingArray];

      for (const incomingDetail of incomingArray) {
        const entries = Array.isArray(incomingDetail.data)
          ? incomingDetail.data
          : [incomingDetail.data];

        if (!entries.some(d => hasValidFields(d.fields))) continue;

        for (const dataItem of entries) {
          const name = dataItem.sensor.name;

          const index = updatedArray.findIndex((d) => {
            const existingData = d.data;
            return Array.isArray(existingData)
              ? existingData.some((e) => e.sensor.name === name)
              : existingData.sensor.name === name;
          });

          if (index !== -1) {
            updatedArray[index] = incomingDetail;
          } else {
            updatedArray.push(incomingDetail);
          }
        }
      }

      const updatedMessage: GeneralMQTTObjectType = {
        device: message.device,
        details: updatedArray,
      };

      setStoreSubsData(topic, updatedMessage);
      return;
    }

    console.error("Mensaje no válido (ningún schema matcheó):", topic, message);
  };



  const subscribeToTopic = (
    topic: string,
    topicName: string,
    onMessage: (msg: GeneralMQTTObjectType) => void
  ) => {
    const client = getClient();
    if (!subscribedTopics[topic]) {
      subscribedTopics[topic] = 1;
      client.subscribe(topic, { qos: 0 }, (err) => {
        if (!err) toast.success(`Conectado a ${topicName}`);
      });
      client.on('message', (_, raw) => {
        try {
          const msg = JSON.parse(raw.toString()) as GeneralMQTTObjectType;
          for (const z of schemas) {
            try { z.parse(msg); onMessage(msg); return; }
            catch { }
          }
        } catch { }
      });
    } else {
      subscribedTopics[topic]++;
    }
    updateSubscribedTopics(subscribedTopics);
  };

  const unsubscribeFromTopic = (topic: string) => {
    const client = getClient();
    if (subscribedTopics[topic]) {
      subscribedTopics[topic]--;
      if (subscribedTopics[topic] <= 0) {
        client.unsubscribe(topic);
        delete subscribedTopics[topic];
      }
    }
    updateSubscribedTopics(subscribedTopics);
  };

  return { subscribeToTopic, unsubscribeFromTopic, setSubsData };
};


/*
  const setSubsData = (topic: string, message: GeneralMQTTObjectType) => {
    const existingMessage = subsData[topic] as GeneralMQTTObjectType | undefined;
    // --- TYPE 1 ---
    // details: { data: MQTTDataSchema, time: string }
    if (isType1(message)) {
      const dataObj = message.details.data;

      if (!hasValidFields(dataObj.fields)) {
        console.warn("Fields vacíos (Type 1), no se actualiza:", message);
        return;
      }


      // Si ya tengo algo guardado y también es Type 1 → merge parcial de fields
      if (existingMessage && isType1(existingMessage)) {
        const sameSensor = existingMessage.details.data.sensor.name === dataObj.sensor.name;

        if (sameSensor) {
          const merged: T1 = {
            device: message.device, // si quieres conservar el antiguo, cámbialo
            details: {
              time: message.details.time, // normalmente quieres el nuevo time
              data: {
                ...existingMessage.details.data,
                ...dataObj,
                fields: mergeFields(
                  existingMessage.details.data.fields as Fields,
                  dataObj.fields as Fields
                ),
              },
            },
          };

          setStoreSubsData(topic, merged);
          return;
        }

        // Si el sensor cambió, reemplaza todo (o decide otra política)
        setStoreSubsData(topic, message);
        return;
      }

      // Si no hay existente o no es Type 1, guarda tal cual
      setStoreSubsData(topic, message);
      return;
    }

    // --- TYPE 2 ---
    // details: { data: MQTTDataSchema[], time: string }
    if (isType2(message)) {
      const dataArr = message.details.data;

      const hasValid = dataArr.some(d => hasValidFields(d.fields));
      if (!hasValid) {
        console.warn("Fields vacíos (Type 2), no se actualiza:", message);
        return;
      }

      const existing = subsData[topic];

      // Si no existe o no es Type 2, guardamos directo
      if (!existing || !isType2(existing)) {
        setStoreSubsData(topic, message);
        return;
      }

      // Tenemos un Type 2 previo: merge por sensor.name
      const existingArray = existing.details.data;
      const updatedArray = [...existingArray];

      for (const incomingItem of dataArr) {
        const sensorName = incomingItem.sensor.name;
        const index = updatedArray.findIndex(d => d.sensor.name === sensorName);

        if (index !== -1) {
          const current = updatedArray[index];

          updatedArray[index] = {
            ...current,
            ...incomingItem,
            fields: mergeFields(
              current.fields as Fields,
              incomingItem.fields as Fields
            ),
          };
        } else {
          // Sensor nuevo
          updatedArray.push(incomingItem);
        }
      }

      const mergedMessage: T2 = {
        device: message.device,            // o conserva existing.device si prefieres
        details: {
          time: message.details.time,      // usualmente quieres el nuevo time
          data: updatedArray,
        },
      };

      setStoreSubsData(topic, mergedMessage);
      return;
    }


    // --- TYPE 3 ---
    // details: Array<{ data: MQTTDataSchema | MQTTDataSchema[], time: string }>
    if (isType3(message)) {
      const incomingArray = message.details;
      const existingArray = Array.isArray((existingMessage as any)?.details)
        ? [...(existingMessage as any).details]
        : [];

      const updatedArray = [...existingArray];

      for (const incomingDetail of incomingArray) {
        const entries = Array.isArray(incomingDetail.data)
          ? incomingDetail.data
          : [incomingDetail.data];

        if (!entries.some(d => hasValidFields(d.fields))) continue;

        for (const dataItem of entries) {
          const name = dataItem.sensor.name;

          const index = updatedArray.findIndex((d) => {
            const existingData = d.data;
            return Array.isArray(existingData)
              ? existingData.some((e) => e.sensor.name === name)
              : existingData.sensor.name === name;
          });

          if (index !== -1) {
            updatedArray[index] = incomingDetail;
          } else {
            updatedArray.push(incomingDetail);
          }
        }
      }

      const updatedMessage: GeneralMQTTObjectType = {
        device: message.device,
        details: updatedArray,
      };

      setStoreSubsData(topic, updatedMessage);
      return;
    }

    console.error("Mensaje no válido (ningún schema matcheó):", topic, message);
  };


*/