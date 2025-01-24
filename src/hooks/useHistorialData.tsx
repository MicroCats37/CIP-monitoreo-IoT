import { useEffect } from "react";
import { useHistoricalStore } from "@/store/plots";
import { PlotDataType } from "@/types";
import { areTimestampsEqual } from "@/utils/DateComparation";


export const useHistoricalData = (
    currentData: PlotDataType[] | undefined,
    topic:string,
    key?:string
) => {
    const addData = useHistoricalStore((state) => state.addData);
    const currentDataStore = useHistoricalStore((state)=> state.currentData)
    useEffect(() => {
        if (
            currentData && currentData.length > 0
            && !areTimestampsEqual(currentData, currentDataStore)
        ) {
            addData(topic,currentData,key);
        }
    }, [currentData]);
};
