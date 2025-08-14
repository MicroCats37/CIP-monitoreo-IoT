import { z } from "zod";

const estacionamientosDetailsShema = z.array(
  z.object({
    data: z.object({
      sensor: z.object({
        name: z.string(),
      }),
      fields: z.record(z.string()),
    }),
    time: z.string(),
  })
)

export const estacionamientoSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: estacionamientosDetailsShema
});

export const estacionamientoHistoricalSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.array(estacionamientosDetailsShema)
});

export type EstacionamientoType = z.infer<typeof estacionamientoSchema>;


// Subschema para los fields de tableros de energía
const tablerosDeEnergiaFieldsSchema = z.object({
  activa: z.number().optional(),
  reactiva: z.number().optional(),
  aparente: z.number().optional(),
});

// Subschema para details
const tablerosDeEnergiaDetailsSchema =
  z.object({
    data: z.object({
      sensor: z.object({
        name: z.string(),
      }),
      fields: tablerosDeEnergiaFieldsSchema,
    }),
    time: z.string(),
  })
  ;

// Schema completo del objeto MQTT
export const tablerosDeEnergiaSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: tablerosDeEnergiaDetailsSchema,
});


export const tablerosDeEnergiaHistoricalSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.array(tablerosDeEnergiaDetailsSchema),
});

// Tipo inferido
export type TablerosDeEnergiaType = z.infer<typeof tablerosDeEnergiaSchema>;
export type TablerosDeEnergiaHistoricalType = z.infer<typeof tablerosDeEnergiaHistoricalSchema>;

// Subschema para los fields de estado de bombas de agua
const bombasDeAguaEstadoFieldsSchema = z.object({
  estado: z.number().optional(),
});

// Subschema para details
const bombasDeAguaEstadoDetailsSchema = z.array(
  z.object({
    data: z.object({
      sensor: z.object({
        name: z.string(), // Ej: "Bomba Q1", "Bomba Q2"
      }),
      fields: bombasDeAguaEstadoFieldsSchema,
    }),
    time: z.string(),
  })
);

// Schema completo del objeto MQTT
export const bombasDeAguaEstadoSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: bombasDeAguaEstadoDetailsSchema,
});

export const bombasDeAguaEstadoHistoricalSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.array(bombasDeAguaEstadoDetailsSchema),
});

export type BombasDeAguaEstadoHistoricalType = z.infer<typeof bombasDeAguaEstadoHistoricalSchema>;
export type BombasDeAguaEstadoType = z.infer<typeof bombasDeAguaEstadoSchema>;

// Subschema para los fields de variadores de bombas de agua
const bombasDeAguaVariadoresFieldsSchema = z.object({
  velocidad_y_direccion: z.number().optional(),
  frecuencia: z.number().optional(),
  intensidad: z.number().optional(),
  potencia: z.number().optional(),
  tension_salida: z.number().optional(),
  temperatura_unidad: z.number().optional(),
  tiempo_marcha: z.number().optional(),
});

// Subschema para details
const bombasDeAguaVariadoresDetailsSchema = z.array(
  z.object({
    data: z.object({
      sensor: z.object({
        name: z.string(),
      }),
      fields: bombasDeAguaVariadoresFieldsSchema,
    }),
    time: z.string(),
  })
);

// Schema completo del objeto MQTT
export const bombasDeAguaVariadoresSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: bombasDeAguaVariadoresDetailsSchema,
});

export const bombasDeAguaVariadoresHistoricalSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.array(bombasDeAguaVariadoresDetailsSchema),
});

export type BombasDeAguaVariadoresHistoricalType = z.infer<typeof bombasDeAguaVariadoresHistoricalSchema>;
export type BombasDeAguaVariadoresType = z.infer<typeof bombasDeAguaVariadoresSchema>;

// Subschema para los fields de concentración de CO₂
const concentracionCo2FieldsSchema = z.object({
  co2: z.number().optional(),
});

// Subschema para details
const concentracionCo2DetailsSchema = z.array(
  z.object({
    data: z.object({
      sensor: z.object({
        name: z.string(), // e.g. "CIP"
      }),
      fields: concentracionCo2FieldsSchema,
    }),
    time: z.string(),
  })
);

// Schema completo del objeto MQTT
export const concentracionCo2Schema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: concentracionCo2DetailsSchema,
});

export const concentracionCo2HistoricalSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.array(concentracionCo2DetailsSchema),
});


// Tipos inferidos
export type ConcentracionCo2Type = z.infer<typeof concentracionCo2Schema>;
export type ConcentracionCo2HistoricalType = z.infer<typeof concentracionCo2HistoricalSchema>;

// Schema Zod para Sistema Contra Incendios

export const sistemaContraIncendiosFieldsSchema = z.object({
  voltage: z.number().optional(),
  current: z.number().optional(),
  frequency: z.number().optional(),
  custom_locked_rotor_current: z.number().optional(),
  line_voltage_l12: z.number().optional(),
  line_voltage_l23: z.number().optional(),
  line_voltage_l31: z.number().optional(),
  current_l1: z.number().optional(),
  current_l2: z.number().optional(),
  current_l3: z.number().optional(),
  system_pressure: z.number().optional(),
  suction_pressure: z.number().optional(),
  start_count: z.number().optional(),
  run_time: z.number().optional(),
  hours_since_last_run: z.number().optional(),
  cut_in: z.number().optional(),
  cut_out: z.number().optional(),
  alarms_count: z.number().optional(),
  alarms: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
    })
  ).optional(),
})

export const sistemaContraIncendiosSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.object({
    data: z.object({
      sensor: z.object({
        name: z.string(),
      }),
      fields: sistemaContraIncendiosFieldsSchema
    }),
    time: z.string()
  })

})

export const sistemaContraIncendiosHistoricalSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.array(z.object({
    data: z.object({
      sensor: z.object({
        name: z.string(),
      }),
      fields:
        z.object({
          voltage: z.number().optional(),
          current: z.number().optional(),
          frequency: z.number().optional(),
          custom_locked_rotor_current: z.number().optional(),
          line_voltage_l12: z.number().optional(),
          line_voltage_l23: z.number().optional(),
          line_voltage_l31: z.number().optional(),
          current_l1: z.number().optional(),
          current_l2: z.number().optional(),
          current_l3: z.number().optional(),
          system_pressure: z.number().optional(),
          suction_pressure: z.number().optional(),
          start_count: z.number().optional(),
          run_time: z.number().optional(),
          hours_since_last_run: z.number().optional(),
          cut_in: z.number().optional(),
          cut_out: z.number().optional(),
          alarms_count: z.number().optional()
        })
    }),
    time: z.string()
  }))
})


export type SistemaContraIncendiosType = z.infer<typeof sistemaContraIncendiosSchema>;
export type SistemaContraIncendiosHistoricalType = z.infer<typeof sistemaContraIncendiosHistoricalSchema>;
// Schema Zod para Concentración de Cloro en Piscinas

// Subschema para los fields de concentración de cloro
const concentracionCloroFieldsSchema = z.object({
  cloro: z.number().optional(),
});

// Subschema para details
const concentracionCloroDetailsSchema = z.array(
  z.object({
    data: z.object({
      sensor: z.object({
        name: z.string(),
      }),
      fields: concentracionCloroFieldsSchema,
    }),
    time: z.string(),
  })
);

// Schema completo del objeto MQTT
export const concentracionCloroSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: concentracionCloroDetailsSchema,
});

export const concentracionCloroHistoricalSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.array(concentracionCloroDetailsSchema),
});


// Tipos inferidos
export type ConcentracionCloroType = z.infer<typeof concentracionCloroSchema>;
export type ConcentracionCloroHistoricalType = z.infer<typeof concentracionCloroHistoricalSchema>;



// Subschema de los datos individuales del aire acondicionado
const aireAcondicionadoDataSchema = z.object({
  sensor: z.object({
    name: z.string(),
  }),
  fields: z.object({
    id: z.string(),
    bus: z.string(),
    alias: z.string(),
    status: z.number(),
    alarm: z.number(),
    temperature_setting: z.number(),
    temperature_indoor: z.number(),
    errors: z.array(
      z.object({
        label: z.string(),
        value: z.number(),
      })
    ),
  }),
});

const aireAcondicionadoUnitDataSchema = z.object({
  sensor: z.object({
    name: z.string(),
  }),
  fields: z.object({
    status: z.number().optional(),
    alarm: z.number().optional(),
    temperature_setting: z.number().optional(),
    temperature_indoor: z.number().optional(),
  }).catchall(z.number()), // permite otros campos numéricos dinámicos
});

// Subschema de `details`
const aireAcondicionadoDetailsSchema = z.object({
  data: z.array(aireAcondicionadoDataSchema),
  time: z.string(),
});

const aireAcondicionadoUnitDetailsSchema = z.object({
  data: (aireAcondicionadoUnitDataSchema),
  time: z.string(),
});

// Schema completo del objeto MQTT
export const aireAcondicionadoSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: aireAcondicionadoDetailsSchema,
});
export const aireAcondicionadoUnitHistoricalSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.array(aireAcondicionadoUnitDetailsSchema),
});

export type AireAcondicionadoUnitHistoricalType = z.infer<typeof aireAcondicionadoUnitHistoricalSchema>;
export type AireAcondicionadoFieldsType = z.infer<typeof aireAcondicionadoDataSchema>;
export type AireAcondicionadoType = z.infer<typeof aireAcondicionadoSchema>;





export const bombasDeAguaChosicaFieldsSchema = z.object({
  presion: z.number().optional(),
  estado: z.number().optional(),
});

// Subschema para details
const bombasDeAguaChosicaDetailsSchema = z.array(
  z.object({
    data: z.object({
      sensor: z.object({
        name: z.string(), // Ej: "Bomba Q1", "Bomba Q2"
      }),
      fields: bombasDeAguaChosicaFieldsSchema,
    }),
    time: z.string(),
  })
);

// Schema completo del objeto MQTT
export const bombasDeAguaChosicaSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: bombasDeAguaChosicaDetailsSchema,
});

export const bombasDeAguaChosicaHistoricalSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.array(bombasDeAguaChosicaDetailsSchema),
});

export type BombasDeAguaChosicaHistoricalType = z.infer<typeof bombasDeAguaChosicaHistoricalSchema>;
export type BombasDeAguaChosicaType = z.infer<typeof bombasDeAguaChosicaSchema>;