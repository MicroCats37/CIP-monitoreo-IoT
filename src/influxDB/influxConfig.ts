import { InfluxDB } from '@influxdata/influxdb-client';

// Configuración de InfluxDB
const INFLUXDB_URL = process.env.NEXT_PUBLIC_INFLUXDB_URL!;
const INFLUXDB_TOKEN = process.env.NEXT_PUBLIC_INFLUXDB_TOKEN!;
const INFLUXDB_ORG = process.env.NEXT_PUBLIC_INFLUXDB_ORG!

const influxDB = new InfluxDB({ url: INFLUXDB_URL, token: INFLUXDB_TOKEN });
const queryApi = influxDB.getQueryApi(INFLUXDB_ORG);

export { queryApi, INFLUXDB_ORG };
