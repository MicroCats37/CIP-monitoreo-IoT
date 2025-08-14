export type PageEntry = {
  mqttTopic: string;
  name: string;
  generalName: string;
  generalEndpoint: string;
  endpointLastValue: string;
  endpointHistorical?: string; // <- sigue siendo opcional
};

type PagePathConfig = {
  type: string;
  generalName: string;
  validIds?: (string | number)[];
};

// Define qué tipos deben tener endpointHistorical
const historicalValidNames = [
  "Tableros de Energia",
  "Estado Bombas de Agua",
  "Variadores Bombas de Agua",
  "Concentracion de Co2",
  "Concentracion de Cloro Piscinas",
  "Sistema Contra Incendios",
  "Automatizacion de Bombas de Agua Chosica"

  // Agrega más según necesites
];

export const pagesByPath: Record<string, PagePathConfig> = {
  "/dashboard-iot/monitoreo/aire-acondicionado": {
    type: "aire-acondicionado",
    generalName: "Aire Acondicionado",
    validIds: ["1", "2"],
  },
  "/dashboard-iot/monitoreo/bombas-agua/estado": {
    type: "bombas-agua/estado",
    generalName: "Estado Bombas de Agua",
    validIds: ["agua-potable", "aguas-tratadas", "aguas-grises"],
  },
  "/dashboard-iot/monitoreo/bombas-agua/variadores": {
    type: "bombas-agua/variadores",
    generalName: "Variadores Bombas de Agua",
    validIds: ["agua-potable", "agua-potable-2", "aguas-tratadas"],
  },
  "/dashboard-iot/monitoreo/estacionamientos/sotanos": {
    type: "estacionamientos/sotanos",
    generalName: "Estacionamientos",
    validIds: ["1", "2", "3", "4"],
  },
  "/dashboard-iot/monitoreo/sistema-contra-incendios": {
    type: "sistema-contra-incendios",
    generalName: "Sistema Contra Incendios",
  },
  "/dashboard-iot/monitoreo/tableros-energia/tableros": {
    type: "tableros-energia/tableros",
    generalName: "Tableros de Energia",
    validIds: ["1"],
  },
  "/dashboard-iot/monitoreo/concentracion-cloro": {
    type: "concentracion-cloro",
    generalName: "Concentracion de Cloro Piscinas",
    validIds: ["piscinas"],
  },
  "/dashboard-iot/monitoreo/concentracion-co2": {
    type: "concentracion-co2",
    generalName: "Concentracion de Co2",
  },
  "/dashboard-iot/monitoreo/bombas-agua-chosica": {
    type: "bombas-agua-chosica",
    generalName: "Automatizacion de Bombas de Agua Chosica",
  }
};

function generatePageData(): Record<string, PageEntry> {
  const result: Record<string, PageEntry> = {};
  const endpointApiPrefix = "/api/device";
  const endpointMQTTPrefix = "dashboard-iot";

  for (const [basePath, config] of Object.entries(pagesByPath)) {
    const { type, generalName, validIds } = config;

    const buildEntry = (id?: string | number): PageEntry => {
      const path = id ? `/${id}` : "";
      const idSuffix = id ? ` ${id}` : "";
      const topic = `${endpointMQTTPrefix}/${type}${path}`;
      const baseEndpoint = `${endpointApiPrefix}/${type}${path}`;

      const entry: PageEntry = {
        mqttTopic: topic,
        name: `${generalName}${idSuffix}`,
        generalName,
        generalEndpoint: baseEndpoint,
        endpointLastValue: `${baseEndpoint}/last-value`,
      };

      // ✅ Solo agregamos endpointHistorical si el generalName está en la lista
      if (historicalValidNames.includes(generalName)) {
        entry.endpointHistorical = `${baseEndpoint}/historical`;
      }

      return entry;
    };

    if (validIds && validIds.length > 0) {
      for (const id of validIds) {
        const fullPath = `${basePath}/${id}`;
        result[fullPath] = buildEntry(id);
      }
    } else {
      result[basePath] = buildEntry();
    }
  }

  return result;
}


export const pageData: Record<string, PageEntry> = generatePageData();