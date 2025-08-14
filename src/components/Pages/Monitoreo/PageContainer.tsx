import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useMqttStore } from "@/store/storages/mqtt.store";
import { GeneralMQTTObjectType } from "@/types";
import { useMqttSubcriptions } from "@/hooks/mqtt/useMqttSubscriptions";
import { useGenericFetchApi } from "@/hooks/fetchApiQuery/useGenericFetchApi";
import { useShallow } from "zustand/react/shallow";
import { PageEntry } from "@/utils/Devices/Data/data.pages.monitoreo";
import { generalMQTTObjectSchema, MonitoreoPlotGeneralMessageType, MonitoreoPlotGeneralSchema } from "@/validators/schemas";
import { useMonitoreoHistoricalStore } from "@/store/storages/monitoreoPlots.store";
import { useInitialMonitoreoHistoricalData } from "@/hooks/monitoreoHistorical/useInitialMonitoreoHistoricalData";
import { useAddHistoricalData } from "@/hooks/monitoreoHistorical/useAddHistoricalData";
import { useMqttinitialData } from "@/hooks/mqtt/useMqttInitialData";
import DeviceContentChartWrapper from "@/components/Custom/Loaders/DeviceContentChartWrapper";
import DeviceContentCardWrapper from "@/components/Custom/Loaders/DeviceContentCardWrapper";
import { ButtonFechingDate, QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate";
import { diffTimeMs } from "@/utils/Devices/PlotFormat/ToolTip/diffTime";

export interface PageContainerProps {
    data: PageEntry;
    children?: ReactNode;
}

interface TimeRange {
    start: string
    stop: string
}

const PageContainer = ({ data }: PageContainerProps) => {
    // ── Destructuring  ──────────────────────────────────────────────────────────
    const { mqttTopic: topic, generalName, name, endpointLastValue, endpointHistorical } = data;
    const type = data.generalName
    // ── Suscripción MQTT ────────────────────────────────────────────────────────
    useMqttSubcriptions(topic, name);
    const dataMQTT: GeneralMQTTObjectType = useMqttStore((state) => state.subsData[topic]);

    // ── Rango de tiempo ─────────────────────────────────────────────────────────
    const DateTime = (new Date());
    const [timeRange, setTimeRange] = useState<TimeRange>(() => ({
        start: new Date(DateTime.getTime() - 60 * 60 * 1000).toISOString(), // 1h atrás
        stop: new Date().toISOString(), // ahora
    }));

    const [currentInterval, setCurrentInterval] = useState<QueryTimeType>("1h");

    // Calcular diffTime sólo cuando cambie el rango
    const diffTime = diffTimeMs(timeRange.start, timeRange.stop)

    // ── Params y keys MEMOIZADOS para requests ──────────────────────────────────
    // ⚠️ Sólo depende de start
    const shouldFetchLastValue = useMemo(
        () => !dataMQTT, // o: !dataMQTT || diffTime >= 90 * 60 * 1000
        [dataMQTT]       // (+ diffTime si lo usas)
    );

    // 2) Params: sólo crea el objeto cuando realmente vas a fetchear
    const queryParamsL = useMemo(
        () => (shouldFetchLastValue ? { start: timeRange.start } : undefined),
        [shouldFetchLastValue, timeRange.start]
    );

    // Envía objeto estable a menos que cambie start/stop
    const queryParamsH = { start: timeRange.start, stop: timeRange.stop };

    // Keys estables y descriptivas
    const queryKeyL = useMemo(
        () => [
            "lastValue",
            generalName,
            name,
            endpointLastValue,
            shouldFetchLastValue ? timeRange.start : "frozen" // <- no varía mientras uses MQTT
        ],
        [generalName, name, endpointLastValue, timeRange.start, shouldFetchLastValue]
    );

    const queryKeyH = ["historical", topic, generalName, endpointHistorical, queryParamsH.start, queryParamsH.stop]


    // ── Fetchers ────────────────────────────────────────────────────────────────
    const {
        data: data_l,
        error: error_l,
        isLoading: isLoading_l,
        refetch: refetch_l,
    } = useGenericFetchApi<GeneralMQTTObjectType>({
        url: endpointLastValue,
        queryParams: queryParamsL,
        queryKey: queryKeyL,
        schema: generalMQTTObjectSchema,
        apiOptions: { staleTime: Infinity, refetchOnMount: false, enabled: shouldFetchLastValue },
    });

    const {
        data: data_h,
        error: error_h,
        isLoading: isLoading_h,
        refetch: refetch_h,
    } = useGenericFetchApi<MonitoreoPlotGeneralMessageType>({
        url: endpointHistorical,
        queryParams: queryParamsH,
        queryKey: queryKeyH,
        schema: MonitoreoPlotGeneralSchema,
        apiOptions: { staleTime: Infinity, refetchOnMount: false },
    });
    useEffect(() => {
        refetch_h
    }, [timeRange])
    // ── Integración datos en stores ─────────────────────────────────────────────
    // Prefiere MQTT si el rango es menor a 90 min; evita recomputar
    const dataLastvalue = (diffTime < 90 * 60 * 1000 ? (dataMQTT ?? data_l) : undefined);

    useMqttinitialData(topic, error_l, data_l);
    useInitialMonitoreoHistoricalData(topic, data_h);
    useAddHistoricalData(topic, dataLastvalue);

    const dataHistorical: MonitoreoPlotGeneralMessageType = useMonitoreoHistoricalStore(
        useShallow((s) => s.historicalData[topic])
    );

    return (
        <div className="flex-col p-4 w-screen md:w-full h-full">
            <div className="flex-col flex-1 w-full h-full">
                <div className="flex-col  w-full h-full gap-4 space-y-4">
                    {
                        data.endpointHistorical ? (
                            <div className="flex w-full flex-1 flex-col space-y-4">
                                <div className='w-full flex gap-4 justify-end flex-wrap'>
                                    <ButtonFechingDate
                                        timeRange={timeRange}
                                        setTimeRange={setTimeRange}
                                        currentInterval={currentInterval}
                                        setCurrentInterval={setCurrentInterval}
                                    />
                                </div>
                                <div className="flex-col w-full space-y-4">
                                    <DeviceContentCardWrapper
                                        data={data}
                                        dataMQTT={dataMQTT ? dataMQTT : data_l}
                                        type={type}
                                        isLoading={isLoading_l}
                                        error={error_l}
                                        onRetry={refetch_l}
                                    />
                                    <DeviceContentChartWrapper
                                        timeRange={diffTime}
                                        dataHistorical={dataHistorical}
                                        type={type}
                                        isLoading={isLoading_h}
                                        error={error_h}
                                        onRetry={refetch_h}

                                    />
                                </div>
                            </div>
                        ) : (
                            <DeviceContentCardWrapper
                                data={data}
                                dataMQTT={dataMQTT ? dataMQTT : data_l}
                                type={type}
                                isLoading={isLoading_l}
                                error={error_l}
                                onRetry={refetch_l}
                            />
                        )
                    }
                </div>
            </div>

        </div>

    )
}

export default PageContainer