import { useHistoricalStore } from "@/store/plots";
import { PlotDataType } from "@/types";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export const useInitialHistoricalData = (

  historicalData: PlotDataType[][] | undefined,
  topic:string
) => {
  const initializeData = useHistoricalStore(useShallow((state) => state.initializeData));
  useEffect(() => {
    if (historicalData) {
      initializeData(topic,historicalData);
    }
  }, [historicalData]);



};
