import { GeneralMQTTObjectType } from "@/types";
import { useEffect } from "react";
import { toast } from "sonner";
import { useMQTTManager } from "./useMqttManager";

/**
 * Hook para manejar lógica basada en error y datos.
 * @param topic - El tópico relacionado con los datos.
 * @param error - Mensaje de error si ocurre algún problema.
 * @param data - Los datos recibidos desde MQTT o fetch.
 */
export const useMqttinitialData = (
    topic: string,
    error: Error | null,
    data: GeneralMQTTObjectType | undefined
) => {
    const {
        setSubsData
    } = useMQTTManager(); // ✅ Solo una llamada
    useEffect(() => {
        if (error) {
            toast.error(`${error}`);
        }
    }, [error]);

    useEffect(() => {
        if (data) {
            setSubsData(topic, data);
        }
    }, [data]);
};
