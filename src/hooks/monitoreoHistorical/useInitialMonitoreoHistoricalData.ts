import { useMonitoreoHistoricalStore } from "@/store/storages/monitoreoPlots.store";
import { MonitoreoPlotGeneralType } from "@/types";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export const useInitialMonitoreoHistoricalData = (
    topic: string,
    historicalData: MonitoreoPlotGeneralType | undefined,

) => {
    const initializeData = useMonitoreoHistoricalStore(useShallow((state) => state.initializeData));
    useEffect(() => {
        if (historicalData) {
            initializeData(topic, historicalData);
        }
    }, [historicalData]);
};
