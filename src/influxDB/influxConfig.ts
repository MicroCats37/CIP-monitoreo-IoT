import { InfluxDB } from '@influxdata/influxdb-client';

// Configuración de InfluxDB
const INFLUXDB_URL = 'http://localhost:8086';
const INFLUXDB_TOKEN = 'UX4Rc8fbNlBTlKpD-6SOK0waR7T_FfXLOQ0yKbFm2GgdZrnTWgstV1uH8AAV94UZLR1myo0UZrGfCeXrvZZepA==';
const INFLUXDB_ORG = 'ORG_NAME';

const influxDB = new InfluxDB({ url: INFLUXDB_URL, token: INFLUXDB_TOKEN });
const queryApi = influxDB.getQueryApi(INFLUXDB_ORG);

export { queryApi, INFLUXDB_ORG };
