"use server";
import { CO2Type } from "@/types";
import { queryApi } from "../influxConfig";
import { fetchDataAction } from "@/utils/ServerActions/validator";
import { CO2TypeSchema } from "@/validators/schemas";

export const getCO2ActionData = async (): Promise<CO2Type> => {
  const fluxQuery = `
       from(bucket: "Sensor CO2")
        |> range(start: -7d)
        |> filter(fn: (r) => r["_measurement"] == "Sensor CO2")
        |> filter(fn: (r) => r["_field"] == "value")
        |> last()
  `;

  const rows: CO2Type = {
    data: {} as CO2Type["data"],
    time: "",
  };

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const record = tableMeta.toObject(values);
    if (!rows.time) {
      rows.time = record._time;
    }

    rows.data = {
      lugar: "Sotanos",
      co2: Number(record["_value"]),
    }
  }
  return rows;
};

export const getCO2Action = async (): Promise<CO2Type> => {
  return fetchDataAction(getCO2ActionData, CO2TypeSchema);
};
