import { ChartConfig } from '@/components/ui/chart';
import {
  ChartSeriesData,
  ChartStakedData,
  ChartStakedDataSimple,
  MonitoreoPlotGeneralMessageDetailsArraySchema,
  type MonitoreoPlotGeneralMessageDetailsArrayType,
  MonitoreoPlotGeneralMessageDetailsObjectSchema,
  type MonitoreoPlotGeneralMessageDetailsObjectType,
} from '@/validators/schemas';
import { getLabel, getUnit } from './LabelandUnits';


/**
 * Formatea los datos de un mensaje MQTT histórico donde `data` es un objeto.
 * Valida con Zod y retorna datos agrupados por sensor.
 */

/*
Cuando Details es Object y la salida no es stakedt
*/
export function formatChartConfigSimpleDetailsArray(
  id:string,rawData?: MonitoreoPlotGeneralMessageDetailsObjectType,
  
): { data: ChartStakedData; chartConfig: ChartConfig } {
  const result: ChartStakedData = {};
  const chartConfig: ChartConfig = {};
  const fieldSet = new Set<string>();
  if (!rawData) {
    return { data: result, chartConfig };
  }
  const parsed = MonitoreoPlotGeneralMessageDetailsObjectSchema.safeParse(rawData);
  if (!parsed.success) {
    console.warn('⚠️ Datos no válidos para este tipo de formateo');
    return { data: result, chartConfig };
  }

  const { details } = parsed.data;

  for (const detail of details) {
    if (!Array.isArray(detail.data)) {
      const { sensor, fields } = detail.data;
      const sensorName = sensor.name;
      const time = detail.time;

      const point: ChartSeriesData = {
        timestamp: new Date(time).getTime(),
        ...fields,
      };

      if (!result[sensorName]) {
        result[sensorName] = [];
      }

      result[sensorName].push(point);

      // Recolectamos todos los campos únicos para el config
      for (const fieldKey of Object.keys(fields)) {
        fieldSet.add(fieldKey);
      }
    }
  }

  // Generar config para los campos únicos detectados
  const fieldList = Array.from(fieldSet);

  fieldList.forEach((name, index) => {
    chartConfig[name] = {
      field: name,
      label: getLabel(name,id), // solo el nombre como pediste
      color: `hsl(var(--chart-${index + 1}))`,
      unit: getUnit(name,id),
    };
  });
  return { data: result, chartConfig };
}


export function formatChartConfigStackedDetailsArray(
  id:string,rawData?: MonitoreoPlotGeneralMessageDetailsObjectType,
  
): { data: ChartStakedDataSimple; chartConfig: ChartConfig } {
  const result: ChartStakedDataSimple = {};
  const chartConfig: ChartConfig = {};
  const fieldSet = new Set<string>();

  if (!rawData) return { data: result, chartConfig };

  const parsed = MonitoreoPlotGeneralMessageDetailsObjectSchema.safeParse(rawData);
  if (!parsed.success) {
    console.warn('⚠️ Datos no válidos para este tipo de formateo');
    return { data: result, chartConfig };
  }

  for (const detail of parsed.data.details) {
    if (Array.isArray(detail.data)) continue;

    const { sensor, fields } = detail.data;
    const sensorName = sensor.name;
    const timestamp = new Date(detail.time).getTime();

    if (!result[sensorName]) {
      result[sensorName] = {};
    }

    for (const [fieldKey, value] of Object.entries(fields)) {
      if (typeof value !== 'number') continue;

      fieldSet.add(fieldKey);

      if (!result[sensorName][fieldKey]) {
        result[sensorName][fieldKey] = [];
      }

      const point: ChartSeriesData = {
        timestamp,
        [fieldKey]: value,
      };

      result[sensorName][fieldKey].push(point);
    }
  }

  Array.from(fieldSet).forEach((name, index) => {
    chartConfig[name] = {
      field: name,
      label: getLabel(name,id), // solo el nombre como pediste
      color: `hsl(var(--chart-${index + 1}))`,
      unit: getUnit(name,id),
    };
  });

  return { data: result, chartConfig };
}



export function formatChartConfigSimpleDetailsArrayArray(
  id:string,rawData?: MonitoreoPlotGeneralMessageDetailsArrayType,
  
): { data: ChartStakedDataSimple; chartConfig: ChartConfig } {
  const result: ChartStakedDataSimple = {};
  const chartConfig: ChartConfig = {};
  const fieldSet = new Set<string>();

  if (!rawData) return { data: result, chartConfig };

  const parsed = MonitoreoPlotGeneralMessageDetailsArraySchema.safeParse(rawData);
  if (!parsed.success) {
    console.warn('⚠️ Datos no válidos para formateo array');
    return { data: result, chartConfig };
  }

  for (const snapshot of parsed.data.details) {
    for (const entry of snapshot) {
      const { sensor, fields } = entry.data;
      const sensorName = sensor.name;
      const timestamp = new Date(entry.time).getTime();

      if (!result[sensorName]) {
        result[sensorName] = {};
      }

      for (const [fieldKey, value] of Object.entries(fields)) {
        if (typeof value !== 'number') continue;

        fieldSet.add(fieldKey);

        if (!result[sensorName][fieldKey]) {
          result[sensorName][fieldKey] = [];
        }

        const point: ChartSeriesData = {
          timestamp,
          [fieldKey]: value,
        };

        result[sensorName][fieldKey].push(point);
      }
    }
  }

  Array.from(fieldSet).forEach((name, index) => {
    chartConfig[name] = {
      field: name,
      label: getLabel(name,id), // solo el nombre como pediste
      color: `hsl(var(--chart-${index + 1}))`,
      unit: getUnit(name,id),
    };
  });

  return { data: result, chartConfig };
}


export function formatChartConfigStackedDetailsArrayArray(
  id:string,rawData?: MonitoreoPlotGeneralMessageDetailsArrayType
): { data: ChartStakedData; chartConfig: ChartConfig } {
  const result: ChartStakedData = {};
  const chartConfig: ChartConfig = {};
  const fieldSet = new Set<string>();

  if (!rawData) return { data: result, chartConfig };

  const parsed = MonitoreoPlotGeneralMessageDetailsArraySchema.safeParse(rawData);
  if (!parsed.success) {
    console.warn('⚠️ Datos no válidos para formateo por sensor agrupado');
    return { data: result, chartConfig };
  }

  for (const snapshot of parsed.data.details) {
    for (const entry of snapshot) {
      const { sensor, fields } = entry.data;
      const sensorName = sensor.name;
      const timestamp = new Date(entry.time).getTime();

      if (!result[sensorName]) {
        result[sensorName] = [];
      }

      // Crea un punto combinado por timestamp con todos los campos
      const point: ChartSeriesData = { timestamp };

      for (const [fieldKey, value] of Object.entries(fields)) {
        if (typeof value !== 'number') continue;

        fieldSet.add(fieldKey);
        point[fieldKey] = value;
      }

      result[sensorName].push(point);
    }
  }

  Array.from(fieldSet).forEach((name, index) => {
    chartConfig[name] = {
      field: name,
      label: getLabel(name,id), // solo el nombre como pediste
      color: `hsl(var(--chart-${index + 1}))`,
      unit: getUnit(name,id),
    };
  });
  return { data: result, chartConfig };
}









export default function formatStackedDataArray(
  id:string,data: ChartStakedData,
): { flatData: ChartSeriesData[]; chartConfig: ChartConfig } {
  const timestampMap: Map<number, ChartSeriesData> = new Map();
  const chartConfig: ChartConfig = {};
  const fieldSet = new Set<string>();

  let colorIndex = 1;

  for (const [sensorId, registros] of Object.entries(data)) {
    for (const registro of registros) {
      const { timestamp, ...campos } = registro;

      let entry = timestampMap.get(timestamp);
      if (!entry) {
        entry = { timestamp };
        timestampMap.set(timestamp, entry);
      }

      for (const [field, valor] of Object.entries(campos)) {
        if (valor === undefined) continue;

        const fieldName = `${sensorId} ${getLabel(field,id)}`;//aca porner la fncion 
        fieldSet.add(fieldName);

        entry[fieldName] = valor;
      }
    }
  }

  // Construir config
  Array.from(fieldSet).forEach((name,index) => {
    chartConfig[name] = {
      field: name,
      label: getLabel(name,id), // solo el nombre como pediste
      color: `hsl(var(--chart-${index + 1}))`,
      unit: getUnit(name,id),
    };
  });

  // Convertir el mapa a array ordenado por timestamp
  const flatData = Array.from(timestampMap.values()).sort(
    (a, b) => a.timestamp - b.timestamp
  );

  return { flatData, chartConfig };
}
