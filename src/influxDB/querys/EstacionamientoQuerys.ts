import { ParkingType } from "@/types";
import { queryApi } from "../influxConfig";

const INFLUXDB_BUCKET_ESTACIONAMIENTOS = 'Estacionamientos';


// Función para obtener estacionamientos ocupados en los distintos sótanos
export const getSotanoEstado = async (id: string): Promise<ParkingType> => {
  const fluxQuery = `
    from(bucket: "${INFLUXDB_BUCKET_ESTACIONAMIENTOS}")
    |> range(start: -30m)  // Limita el rango de tiempo (últimos 30 minutos)
    |> filter(fn: (r) => r["_measurement"] == "Sotano_${id.toUpperCase()}")
    |> filter(fn: (r) => r["_field"] == "ocupado" or r["_field"] == "libre" or r["_field"] == "reservado" or r["_field"] == "dañado")
    |> group(columns: ["estacionamiento", "_field"])  // Agrupa por estacionamiento y estado
    |> last()  // Obtiene el último valor
    |> filter(fn: (r) => r["_value"] == 1)  // Filtra solo los valores con _value igual a 1
    |> yield(name: "last")
  `;

  const rows: ParkingType = {
    data: [],
    time: ""
  };

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const record = tableMeta.toObject(values);

    // Si no existe un time, lo asignamos
    if (!rows.time) {
      rows.time = record._time; // Asignar el timestamp del primer registro encontrado
    }

    // Agregar el estacionamiento y estado al array de `data`
    rows.data.push({
      estacionamiento: record.estacionamiento,
      estado: record._field,
    });
  }

  // Ordenar los estacionamientos por número (por ejemplo, E1, E2, E3, etc.)
  rows.data.sort((a, b) => {
    const numA = parseInt(a.estacionamiento.replace('E', ''), 10);
    const numB = parseInt(b.estacionamiento.replace('E', ''), 10);
    return numA - numB;
  });

  return rows; // Retorna el objeto con el array de datos y el timestamp
};
