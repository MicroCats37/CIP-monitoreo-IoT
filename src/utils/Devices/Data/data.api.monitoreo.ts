
export const apiToIdMap: {
  [endpointBase: string]: {
    id?: {
      valId: string[];
      idKey: { [key: string]: string };
    }

    error404: string;
    error400: string;
    error500: string;
    nombre: string;
  };
} = {
  "/api/device/aire-acondicionado/": {
    id: {
      valId: ["1", "2"],
      idKey: {
        "1": "Controlador 1",
        "2": "Controlador 2",
      }
    },
    error400: "Solicitud malformada: parámetros inválidos para el Controlador de Aire Acondicionado.",
    error404: "No se encontraron datos para el Controlador de Aire Acondicionado.",
    error500: "Error interno al consultar datos de Aire Acondicionado en InfluxDB.",
    nombre: "Aire Acondicionado",
  },
  "/api/device/bombas-agua/estado/": {
    id: {
      valId: ["agua-potable", "aguas-tratadas", "aguas-grises"],
      idKey: {
        "agua-potable": "Estado de Bombas - Agua Potable",
        "aguas-tratadas": "Estado de Bombas - Aguas Tratadas",
        "aguas-grises": "Estado de Bombas - Aguas Grises",
      }
    },
    error404: "Estado de Bombas de Agua no encontrado.",
    error400: "Solicitud incorrecta para Estado de Bombas de Agua.",
    error500: "Error interno del servidor de Estado de Bombas de Agua.",

    nombre: "Estado Bombas de Agua",
  },
  "/api/device/bombas-agua/variadores/": {
    id: {
      valId: ["agua-potable", "agua-potable-2", "aguas-tratadas"],
      idKey: {
        "agua-potable": "Variadores de Bombas - Agua Potable",
        "agua-potable-2": "Variadores de Bombas - Agua Potable 2",
        "aguas-tratadas": "Variadores de Bombas - Aguas Tratadas",
      },
    },
    error404: "Variador de Bombas de Agua no encontrado.",
    error400: "Solicitud incorrecta para Variador de Bombas de Agua.",
    error500: "Error interno del servidor de Variador de Bombas de Agua.",

    nombre: "Variadores Bombas de Agua",
  },
  "/api/device/estacionamientos/sotanos/": {
    id: {
      valId: ["1", "2", "3", "4"],
      idKey: {
        "1": "Estacionamiento Sotano 1",
        "2": "Estacionamiento Sotano 2",
        "3": "Estacionamiento Sotano 3",
        "4": "Estacionamiento Sotano 4",
      },
    },
    error404: "Estacionamiento no encontrado.",
    error400: "Solicitud incorrecta para Estacionamiento.",
    error500: "Error interno del servidor de Estacionamientos.",

    nombre: "Estacionamientos",
  },
  "/api/device/sistema-contra-incendios": {
    error404: "Sistema Contra Incendios no encontrado.",
    error400: "Solicitud incorrecta para Sistema Contra Incendios.",
    error500: "Error interno del servidor de Sistema Contra Incendios.",

    nombre: "Sistema Contra Incendios",
  },
  "/api/device/tableros-energia/tableros/": {
    id: {
      valId: ["1"],
      idKey: {
        "1": "Tablero 1",
      },
    },
    error404: "Tablero de Energía no encontrado.",
    error400: "Solicitud incorrecta para Tablero de Energía.",
    error500: "Error interno del servidor de Tableros de Energía.",
 
    nombre: "Tableros de Energia",
  },
  "/api/device/concentracion-cloro/piscinas": {
    error404: "Concentración de Cloro en Piscinas no encontrada.",
    error400: "Solicitud incorrecta para Concentración de Cloro en Piscinas.",
    error500: "Error interno del servidor de Concentración de Cloro en Piscinas.",
 
    nombre: "Concentración de Cloro",
  },
  "/api/device/concentracion-co2": {
    error404: "Concentración de CO2 no encontrada.",
    error400: "Solicitud incorrecta para Concentración de CO2.",
    error500: "Error interno del servidor de Concentración de CO2.",

    nombre: "Concentracion de CO2",
  },
  "/api/device/bombas-agua-chosica": {
    error404: "Estado de Bombas de Agua no encontrado.",
    error400: "Solicitud incorrecta para Estado de Bombas de Agua Chosica.",
    error500: "Error interno del servidor de Estado de Bombas de Agua Chosica.",

    nombre: "Automatizacion de Bombas de Agua Chosica",
  }
};
