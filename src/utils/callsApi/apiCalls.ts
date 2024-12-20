import {
  AirConditioningTypeSchema,
  BoardTypeSchema,
  ParkingTypeSchema,
  SCITypeSchema,
  VariatorsTypeSchema,
  WaterPumpTypeSchema,
} from "@/validators/schemas";

import type {
  AirConditioningType,
  BoardType,
  ParkingType,
  SCIType,
  VariatorsType,
  WaterPumpType,
} from "@/types";
import { fetchData } from "@/validators/functions/validatorschema";
import { z } from "zod";

// Obtener datos de estacionamiento
export const getParkingData = (id: string) =>
  fetchData<ParkingType>(`/sotanos/${id}`, ParkingTypeSchema);

// Obtener datos de bombas de agua
export const getWaterPumpData = (id: string) =>
  fetchData<WaterPumpType[]>(`/bombas/${id}`, z.array(WaterPumpTypeSchema));

// Obtener datos de tableros
export const getBoardData = () =>
  fetchData<BoardType[]>(`/tableros`, z.array(BoardTypeSchema));

// Obtener datos de variadores
export const getVariatorData = (id: string) =>
  fetchData<VariatorsType[]>(`/variadores/${id}`, z.array(VariatorsTypeSchema));

// Obtener datos de alarmas (SCI)
export const getSCIData = () =>
  fetchData<SCIType>(`/sci`, SCITypeSchema);

// Obtener datos de aire acondicionado
export const getAirConditioningData = (port: string) =>
  fetchData<AirConditioningType>(`/aire-acondicionado/${port}`, AirConditioningTypeSchema);
