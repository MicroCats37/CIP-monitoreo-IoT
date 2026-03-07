import { InfluxDB, type QueryApi } from '@influxdata/influxdb-client';

// Configuración de InfluxDB
const getInfluxConfig = () => ({
    url: process.env.NEXT_PUBLIC_INFLUXDB_URL || "http://placeholder.influxdb",
    token: process.env.NEXT_PUBLIC_INFLUXDB_TOKEN || "placeholder-token",
    org: process.env.NEXT_PUBLIC_INFLUXDB_ORG || "placeholder-org",
});

export const INFLUXDB_ORG = process.env.NEXT_PUBLIC_INFLUXDB_ORG || "placeholder-org";

let _influxQueryApi: QueryApi | null = null;

export const getInfluxQueryApi = (): QueryApi => {
    if (!_influxQueryApi) {
        const config = getInfluxConfig();
        try {
            const influxDB = new InfluxDB({ url: config.url, token: config.token });
            _influxQueryApi = influxDB.getQueryApi(config.org);
        } catch (error) {
            console.error("Failed to initialize InfluxDB client:", error);
            throw error;
        }
    }
    return _influxQueryApi!;
};

// For backward compatibility while we migrate
export const influxQueryApi = new Proxy({} as QueryApi, {
    get: (target, prop: keyof QueryApi) => {
        const api = getInfluxQueryApi();
        return api[prop];
    }
});
