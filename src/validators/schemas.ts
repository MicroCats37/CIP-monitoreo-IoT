import { z } from "zod";


const MQTTDataSchema = z.object({
  sensor: z.object({
    name: z.string(),
  }),
  fields: z.record(
    z.string(),
    z.union([
      z.number().optional(),
      z.string().optional(),
      z.boolean().optional(),
      z.array(
        z.object({
          label: z.string(),
          value: z.union([z.number(), z.string(), z.boolean()]),
        })
      ).optional()
    ])
  ),
})
export const MQTTDetailsDataSchema = z.union([
  z.array(MQTTDataSchema),
  MQTTDataSchema
])

export const MQTTDetailsSchema = z.object({
  data: MQTTDetailsDataSchema,
  time: z.string(),
})


export type MQTTDetailsDataType = z.infer<typeof MQTTDataSchema>
/*
const MQTTmessageSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.union([MQTTDetailsSchema, z.array(MQTTDetailsSchema)]),
})
*/
export const MonitoreoPlotGeneralMessageDetailsObjectSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.array(z.object({
    data: z.union([
      z.array(MQTTDataSchema),
      MQTTDataSchema
    ]),
    time: z.string(),
  }))
})
export const MonitoreoPlotGeneralMessageDetailsArraySchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.array(z.array(z.object({
    data: MQTTDataSchema,
    time: z.string(),
  })))
})

export type MonitoreoPlotGeneralMessageDetailsArrayType = z.infer<typeof MonitoreoPlotGeneralMessageDetailsArraySchema>
export type MonitoreoPlotGeneralMessageDetailsObjectType = z.infer<typeof MonitoreoPlotGeneralMessageDetailsObjectSchema>
export const MonitoreoPlotGeneralSchema = z.union([
  MonitoreoPlotGeneralMessageDetailsObjectSchema,
  MonitoreoPlotGeneralMessageDetailsArraySchema
])
export type MonitoreoPlotGeneralMessageType = z.infer<typeof MonitoreoPlotGeneralSchema>


export const MQTTmessageWhenDetailsIsObjectSchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.object({
    data: z.union([
      z.array(MQTTDataSchema),
      MQTTDataSchema
    ]),
    time: z.string(),
  })
})

export type MQTTmessageWhenDetailsIsObjectType = z.infer<typeof MQTTmessageWhenDetailsIsObjectSchema>

export const MQTTmessageWhenDetailsIsArraySchema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.array(z.object({
    data: MQTTDataSchema,
    time: z.string(),
  }))
})


export const MQTTmessageType2Schema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.object({
    data: z.array(MQTTDataSchema),
    time: z.string(),
  })
})
export const MQTTmessageType1Schema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.object({
    data: MQTTDataSchema,
    time: z.string(),
  })
})
export const MQTTmessageType3Schema = z.object({
  device: z.object({
    name: z.string(),
  }),
  details: z.array(z.object({
    data: MQTTDataSchema,
    time: z.string(),
  }))
})




export type MQTTmessageWhenDetailsIsArrayType = z.infer<typeof MQTTmessageWhenDetailsIsArraySchema>

export const generalMQTTObjectSchema = z.union(
  [MQTTmessageWhenDetailsIsArraySchema,
    MQTTmessageWhenDetailsIsObjectSchema,
    MQTTmessageType1Schema,
    MQTTmessageType2Schema,
    MQTTmessageType3Schema
  ])

// Serie individual (timestamp + campos)
export const ChartSeriesDataSchema = (z.object({
  timestamp: z.number(),
}).catchall(z.union([z.number().optional(), z.string().optional()])))

export const ChartSeriesDataArraySchema = z.array(z.object({
  timestamp: z.number(),
}).catchall(z.union([z.number().optional(), z.string().optional()])))
// Todos los fields de un solo sensor (ChartStakedData)
export const ChartStakedDataSchema = z.record(
  z.array(ChartSeriesDataSchema)
);

// Versión agrupada por sensor y luego por field (ChartStakedDataSimple)
export const ChartStakedDataSimpleSchema = z.record(
  ChartStakedDataSchema
);

// Unión de ambos (ChartData)
export const ChartDataSchema = z.union([
  ChartStakedDataSchema,
  ChartStakedDataSimpleSchema,
]);

export type ChartSeriesData = z.infer<typeof ChartSeriesDataSchema>;
export type ChartSeriesDataArray = z.infer<typeof ChartSeriesDataArraySchema>;
export type ChartStakedData = z.infer<typeof ChartStakedDataSchema>;
export type ChartStakedDataSimple = z.infer<typeof ChartStakedDataSimpleSchema>;
export type ChartData = z.infer<typeof ChartDataSchema>;
