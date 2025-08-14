// src/utils/mqttDownlink.ts

import { getClient } from "@/mqtt/mqttClient";


export type DownlinkOpts = {
  qos?: 0 | 1 | 2;
  retain?: boolean;
};

export const publishDownlink = (
  topic: string,
  payload: string | Buffer,
  { qos = 0, retain = false }: DownlinkOpts = {}
): Promise<void> => {
  const client = getClient();

  return new Promise((resolve, reject) => {
    if (!client || !client.connected) {
      return reject(new Error('MQTT no conectado'));
    }

    client.publish(topic, payload, { qos, retain }, (err?: Error) => {
      if (err) return reject(err);
      resolve();
    });
  });
};
