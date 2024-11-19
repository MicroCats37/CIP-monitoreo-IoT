import { queryApi } from "../influxConfig";

const INFLUXDB_BUCKET_ESTACIONAMIENTOS = 'Estacionamientos';

interface SotanoEstado{
    parking_id: string; 
    state: string; 
    //value: number; 
    //time: string
}


/** Función para consultar los últimos valores de InfluxDB **/
export const getLatestValues = async () => {
    const fluxQuery = `
      from(bucket: "${INFLUXDB_BUCKET_ESTACIONAMIENTOS}")
        |> range(start: -1h)
        |> filter(fn: (r) => r._measurement == "sotanos")
        |> filter(fn: (r) => r.tag == "sotano1" or r.tag == "sotano2" or r.tag == "sotano3" or r.tag == "sotano4")
        |> last()
        |> keep(columns: ["_time", "_measurement", "_field", "_value", "tag"])
    `;
  
    const rows = [];
    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
      const record = tableMeta.toObject(values);
      rows.push({
        tag: record.tag,  // Ahora el `tag` se incluirá en los datos
        value: record._value,
        time: record._time,
      });
    }
    // Convertir los resultados en un objeto con los últimos valores de cada `tag`
    const latestValues = rows.reduce((acc, row) => {
      // Verificamos que cada fila tiene las propiedades tag y value
      
      if (row.tag && row.value) {
        acc[row.tag] = row.value;
      } //else {console.warn('Fila no válida (sin tag o value):', row);}
      
      return acc;
    }, {} as { [key: string]: any });
    return latestValues
  };


  // Función para obtener estacionamientos ocupados en los distintos sotanos
  export const getSotanoEstado = async (id:string):Promise<SotanoEstado []> => {
    const fluxQuery = `
        from(bucket: "TEST2")
        |> range(start: -30m)  // Limita el rango de tiempo (últimos 30 minutos)
        |> filter(fn: (r) => r["_measurement"] == "sotano${id}")
        |> filter(fn: (r) => r["_field"] == "ocupado" or r["_field"] == "libre" or r["_field"] == "reservado" or r["_field"] == "dañado")
        |> group(columns: ["parking_id", "_field"])  // Agrupa por parking_id y estado
        |> last()  // Obtiene el último valor
        |> filter(fn: (r) => r["_value"] == 1)  // Filtra solo los valores con _value igual a 1
        |> yield(name: "last")
        `;

  const rows:SotanoEstado [] = [];

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const record = tableMeta.toObject(values);
    rows.push({
      parking_id: record.parking_id,
      state: record._field, // El tipo de estado (ocupado, libre, etc.)
      //value: record._value, // El valor (1 o 0)
      //time: record._time,   // Timestamp del último estado
    });
  }

  // Función para ordenar los parkings por el número de parking
    const sortParkings = (parkings:SotanoEstado[]) => {
        return parkings.sort((a, b) => {
        // Extraer el número del parking de las cadenas "parking1", "parking2", etc.
        const numA = parseInt(a.parking_id.replace('parking', ''));
        const numB = parseInt(b.parking_id.replace('parking', ''));
        // Comparar los números de parking
        return numA - numB;
        });
    };
    // Ordenar los parkings
    const orderRows = sortParkings(rows);
    //const sotano = orderRows.map(parking=>parking.state)
  return orderRows;
  };







  

  /*  // Función para obtener estacionamientos ocupados en sotano1
export const getOccupiedParkingSotano1 = async () => {
    const fluxQuery = `
    from(bucket: "TEST2")
      |> range(start: -1d)  // Limita el rango de tiempo (últimos 1 día)
      |> filter(fn: (r) => r["_measurement"] == "sotano1")
      |> filter(fn: (r) => r["_field"] == "ocupado" or r["_field"] == "libre" or r["_field"] == "reservado" or r["_field"] == "dañado")
      |> group(columns: ["parking_id", "_field"])  // Agrupa por parking_id y estado
      |> last()  // Obtiene el último valor
      |> yield(name: "last")
  `;

  const rows: { parking_id: string; state: string; value: number; time: string }[] = [];

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const record = tableMeta.toObject(values);
    rows.push({
      parking_id: record.parking_id,
      state: record._field, // El tipo de estado (ocupado, libre, etc.)
      value: record._value, // El valor (1 o 0)
      time: record._time,   // Timestamp del último estado
    });
  }

  return rows;
  }; */