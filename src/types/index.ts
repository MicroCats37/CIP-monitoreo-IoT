import { generalMQTTObjectSchema, MonitoreoPlotGeneralSchema, MQTTDetailsSchema } from "@/validators/schemas";
import { z } from "zod";

export type GeneralMQTTObjectType = z.infer<typeof generalMQTTObjectSchema>;

export type MonitoreoPlotGeneralType = z.infer <typeof MonitoreoPlotGeneralSchema> 

export type MonitoreoLastValueGeneralType = GeneralMQTTObjectType

export type  MQTTDetailsType=z.infer <typeof MQTTDetailsSchema>