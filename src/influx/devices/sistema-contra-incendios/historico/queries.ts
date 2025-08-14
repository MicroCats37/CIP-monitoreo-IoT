import { getAggregateWindowClause } from "@/utils/influxDB/query/window";

export function sistemaContraIncendiosHistoricalQuery(
    start: string,
    stop: string,
): string {
    const bucket = "IoT Sistema Contra Incendios";

    const windowClause = getAggregateWindowClause(start, stop);

    return `
            from(bucket: "${bucket}")
            |> range(start: ${start}, stop: ${stop})
            |> filter(fn: (r) => r["_measurement"] == "Sistema Contra Incendios")
            |> filter(fn: (r) => r["name"] == "SCI")
            ${windowClause}
            |> yield(name: "historical")
            `;
}
