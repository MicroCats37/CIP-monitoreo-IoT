import { useEffect } from "react";
import { toast } from "sonner";
import { MqttMessageType, useMqttStore } from "@/mqtt/store/mqttStore";

/**
 * Hook para manejar lógica basada en error y datos.
 * @param topic - El tópico relacionado con los datos.
 * @param error - Mensaje de error si ocurre algún problema.
 * @param data - Los datos recibidos desde MQTT o fetch.
 */
export const useResponseData = (
  topic: string,
  error: Error | null,
  data: MqttMessageType | undefined
) => {
  const setSubsData = useMqttStore((state) => state.setSubsData);
  useEffect(() => {
    if (error) {
      toast.error(`${error}`);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setSubsData(topic, data);
      toast.success("Datos cargados correctamente.");
    }
  }, [data, topic, setSubsData]);
};
