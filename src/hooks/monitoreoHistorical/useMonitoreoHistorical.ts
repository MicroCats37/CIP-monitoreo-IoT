// hooks/useHistoricalManager.ts

import {
    generalMQTTObjectSchema,
    MonitoreoPlotGeneralSchema,
    MQTTmessageWhenDetailsIsArraySchema,
    MQTTmessageWhenDetailsIsArrayType,
    MQTTmessageWhenDetailsIsObjectSchema,
    MQTTmessageWhenDetailsIsObjectType,
} from "@/validators/schemas";
import type {
    GeneralMQTTObjectType,
    MonitoreoPlotGeneralType,
    MQTTDetailsType,
} from "@/types";
import { useMonitoreoHistoricalStore } from "@/store/storages/monitoreoPlots.store";
import { useShallow } from "zustand/react/shallow";

const schemas = [generalMQTTObjectSchema];

export function useHistoricalManager() {
    const historicalData = useMonitoreoHistoricalStore(useShallow(s => (s.historicalData)))
    const updateData = useMonitoreoHistoricalStore(useShallow(s => (s.updateData)))
    const initialData = useMonitoreoHistoricalStore(useShallow(s => (s.initializeData)))

    const addHistoricalData = (topic: string, raw?: GeneralMQTTObjectType) => {
        let valid = false;
        for (const z of schemas) {
            try {
                z.parse(raw);
                valid = true;
                break;
            } catch { }
        }
        if (!raw || !valid) {
            console.error("Mensaje no válido para histórico:", topic, raw);
            return;
        }

        if (!valid) {
            console.error("Mensaje no válido para histórico:", topic, raw);
            return;
        }

        const message = raw;
        //const detailBlock = message.details;
        const existing = historicalData[topic] as MonitoreoPlotGeneralType;

        if (!existing) {
            /*
            const newPlot: MonitoreoPlotGeneralType = {
                device: message.device,
                details: Array.isArray(detailBlock) ? detailBlock : [detailBlock],
            };

            try {
                MonitoreoPlotGeneralSchema.parse(newPlot);
                initialData(topic, newPlot);
            } catch (err) {
                console.error("Error validando nuevo histórico:", err);
            }
                */
            return;
        }

        const historicalDetails = [...existing.details];
        const MAX_LENGTH = 200;
        if (MQTTmessageWhenDetailsIsObjectSchema.safeParse(message).success) {
            const messageValid = message as MQTTmessageWhenDetailsIsObjectType
            const detail = messageValid.details;
            const incomingTime = new Date(detail.time).toISOString();
            const lastBlock = historicalDetails[historicalDetails.length - 1];
            const lastTime = new Date((lastBlock as MQTTDetailsType).time).toISOString();
            if (incomingTime > lastTime) {
                historicalDetails.push(detail);
                if (historicalDetails.length > MAX_LENGTH) {
                    historicalDetails.shift();
                }
                historicalDetails.shift(); // Eliminar el primer elemento si es necesario
            }
        } else if (MQTTmessageWhenDetailsIsArraySchema.safeParse(message).success) {
            const messageValid = message as MQTTmessageWhenDetailsIsArrayType
            const detailArray = messageValid.details;

            for (const incomingDetail of detailArray) {
                const sensorName = incomingDetail.data.sensor.name;
                const incomingTime = new Date(incomingDetail.time).toISOString();

                // Buscar el array de histórico correspondiente a este sensor
                let matchedIndex = -1;
                for (let i = historicalDetails.length - 1; i >= 0; i--) {
                    const block = historicalDetails[i] as MQTTmessageWhenDetailsIsArrayType['details'];
                    const arr = Array.isArray(block) ? block : [block];
                    const match = arr.find((entry) => entry.data.sensor.name === sensorName);
                    if (match) {
                        matchedIndex = i;
                        break;
                    }
                }

                if (matchedIndex !== -1) {
                    const lastArray = historicalDetails[matchedIndex] as MQTTmessageWhenDetailsIsArrayType['details'];
                    const lastTime = new Date(lastArray[lastArray.length - 1].time).toISOString()


                    if (incomingTime > lastTime) {
                        (historicalDetails[matchedIndex] as MQTTDetailsType[]).push(incomingDetail);
                        if ((historicalDetails[matchedIndex] as MQTTDetailsType[]).length > MAX_LENGTH) {
                            (historicalDetails[matchedIndex] as MQTTDetailsType[]).shift();
                        } // Eliminar el primer elemento si es necesario
                    }
                }
            }
        }

        try {
            const updated = {
                device: message.device,
                details: historicalDetails as MonitoreoPlotGeneralType['details'],
            };
            MonitoreoPlotGeneralSchema.parse(updated);
            updateData(topic, updated as MonitoreoPlotGeneralType);
        } catch (err) {
            console.error("Error validando histórico actualizado:", err);
        }
    };

    return {
        addHistoricalData,
    };
}
