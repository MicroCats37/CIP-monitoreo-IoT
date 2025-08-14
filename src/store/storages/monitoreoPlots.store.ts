import { MonitoreoPlotGeneralType } from "@/types";
import { create } from "zustand";

interface MonitoreoPlotsState {
    historicalData: { [topic: string]: MonitoreoPlotGeneralType };
}

interface MonitoreoPlotsActions {
    updateData: (topic: string, updateData: MonitoreoPlotGeneralType) => void;
    initializeData: (topic: string, initialData: MonitoreoPlotGeneralType) => void;
}

type MonitoreoPlotsType = MonitoreoPlotsState & MonitoreoPlotsActions;

export const useMonitoreoHistoricalStore = create<MonitoreoPlotsType>()((set) => ({
    historicalData: {},
    updateData: (topic: string, currentData: MonitoreoPlotGeneralType) =>
        set((state) => ({
            historicalData: {
                ...state.historicalData,
                [topic]: currentData
            }
        })),

    initializeData: (topic: string, initialData: MonitoreoPlotGeneralType) =>
        set((state) => ({
            historicalData: {
                ...state.historicalData,
                [topic]: initialData
            }
        }))
}))

