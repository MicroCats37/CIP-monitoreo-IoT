import { queryApi } from "../influxConfig";

interface AlarmData {
    voltage: number;
    current: number;
    frequency: number;
    custom_locked_rotor_current: number;
    user_alarm_1: boolean;
    user_alarm_2: boolean;
    user_alarm_3: boolean;
    user_alarm_4: boolean;
    user_alarm_5: boolean;
    user_alarm_6: boolean;
    user_alarm_7: boolean;
    user_alarm_8: boolean;
    user_alarm_9: boolean;
    user_alarm_10: boolean;
    user_alarm_11: boolean;
    user_alarm_12: boolean;
    user_alarm_13: boolean;
    user_alarm_14: boolean;
    user_alarm_15: boolean;
    user_alarm_16: boolean;
    user_alarm_17: boolean;
    user_alarm_18: boolean;
    user_alarm_19: boolean;
    user_alarm_20: boolean;
    time: string;
}

export const getAlarmsData = async (): Promise<AlarmData | null> => {
    const fluxQuery = `
        from(bucket: "Sistema contra Incendios")
        |> range(start: -30m)
        |> filter(fn: (r) => r["_measurement"] == "SCI")
        |> filter(fn: (r) => r["_field"] == "voltage" or r["_field"] == "current" or r["_field"] == "frequency" or r["_field"] == "custom_locked_rotor_current" or r["_field"] == "user_alarm_1" or r["_field"] == "user_alarm_2" or r["_field"] == "user_alarm_3" or r["_field"] == "user_alarm_4" or r["_field"] == "user_alarm_5" or r["_field"] == "user_alarm_6" or r["_field"] == "user_alarm_7" or r["_field"] == "user_alarm_8" or r["_field"] == "user_alarm_9" or r["_field"] == "user_alarm_10" or r["_field"] == "user_alarm_11" or r["_field"] == "user_alarm_12" or r["_field"] == "user_alarm_13" or r["_field"] == "user_alarm_14" or r["_field"] == "user_alarm_15" or r["_field"] == "user_alarm_16" or r["_field"] == "user_alarm_17" or r["_field"] == "user_alarm_18" or r["_field"] == "user_alarm_19" or r["_field"] == "user_alarm_20")
        |> last()
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> yield(name: "last")
    `;

    let alarmData: AlarmData | null = null;

    for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
        const record = tableMeta.toObject(values);
        console.log(record);

        // Solo asignamos el valor si la respuesta contiene datos
        alarmData = {
            voltage: record.voltage,
            current: record.current,
            frequency: record.frequency,
            custom_locked_rotor_current: record.custom_locked_rotor_current,
            user_alarm_1: record.user_alarm_1,
            user_alarm_2: record.user_alarm_2,
            user_alarm_3: record.user_alarm_3,
            user_alarm_4: record.user_alarm_4,
            user_alarm_5: record.user_alarm_5,
            user_alarm_6: record.user_alarm_6,
            user_alarm_7: record.user_alarm_7,
            user_alarm_8: record.user_alarm_8,
            user_alarm_9: record.user_alarm_9,
            user_alarm_10: record.user_alarm_10,
            user_alarm_11: record.user_alarm_11,
            user_alarm_12: record.user_alarm_12,
            user_alarm_13: record.user_alarm_13,
            user_alarm_14: record.user_alarm_14,
            user_alarm_15: record.user_alarm_15,
            user_alarm_16: record.user_alarm_16,
            user_alarm_17: record.user_alarm_17,
            user_alarm_18: record.user_alarm_18,
            user_alarm_19: record.user_alarm_19,
            user_alarm_20: record.user_alarm_20,
            time: record._time,
        };
    }

    return alarmData;
};
