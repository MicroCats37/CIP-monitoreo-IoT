
import { getAggregateWindowClause } from "@/utils/influxDB/query/window";


export function concentracionCo2HistoricalQuery(
    start: string,
    stop: string,
): string {
    const bucket = "IoT Concentracion de CO2";

    const windowClause = getAggregateWindowClause(start, stop);


    return `
            from(bucket: "${bucket}")
            |> range(start: ${start}, stop: ${stop})
            |> filter(fn: (r) => r["_measurement"] == "Concentracion de Co2")
            |> filter(fn: (r) => r["name"] == "C.I.P. Sotanos")
            ${windowClause}
            |> yield(name: "historical")
            `;
}
