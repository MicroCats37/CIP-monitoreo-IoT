'use client'
import PumpCard from "@/components/Partial/Card/PumpCard/PumpCard";
import { useMqttStore } from "@/mqtt/store/mqttStore";
import { AreaData, DataPlotStaked, WaterPumpType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useResponseData } from "@/hooks/useResponseData";
import { useTopicsSubcriptions } from "@/mqtt/topics/useTopicsSubscriptions";
import { TOPICS } from "@/mqtt/topics/topics.data";
import { getBombasAction } from "@/influxDB/actions/BombasAction";
import { getBombasHistoricoAction } from "@/influxDB/actions-plots/HistoricoBombasActions";
import { useInitialHistoricalData } from "@/hooks/useInitialHistoricalData";
import { useHistoricalData } from "@/hooks/useHistorialData";
import { useHistoricalStore } from "@/store/plots";
import { ButtonFechingDate, QueryTimeType } from "@/components/Custom/ButtonSelector/ButtonFechingDate";
import { useEffect, useState } from "react";
import { StakedSingleChart } from "../../Plot/general/StackedSingleChart";
import { MultipleSingleCharts } from "../../Plot/general/MultipleSingleCharts";
import { WaterPumpDataPlotFormatted, WaterPumpMultipleChartFormatted } from "./WaterPumpFormattedDataPlot";
import { ErrorCard } from "@/components/Custom/ErrorCard/ErrorCard";
import LoadingSpinner from "@/components/Custom/LoaderSpiner/LoadingSpinner";
import { RealTimeCondition } from "@/utils/validatorRealTimePlot";
import { ButtonRangeDate } from "@/components/Custom/ButtonRangeDate/ButtonRangeDate";
import { ButtonDownloadCSV } from "@/components/Custom/ButtonDownloadCSV/ButtonDownloadCSV";
import { DateRange } from "react-day-picker";


export default function WaterPumpContent({ contentData }: { contentData: AreaData }) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setHours(new Date().getHours() - 1)), // 1 hora antes
    to: new Date(),
  });
  const endTime = dateRange.to?.toISOString() ? dateRange.to?.toISOString():new Date().toISOString(); // Resta 1 hora
  const startTime = dateRange.from?.toISOString() ?  dateRange.from?.toISOString():new Date(new Date(endTime).getTime() - 60 * 60 * 1000).toISOString();
  const [intervalo, setIntervalo] = useState<string>("30m");

  const topic = TOPICS[contentData.topickey]
  const id = contentData.id!
  let plotData: WaterPumpType[][] = []
  useTopicsSubcriptions(topic)

  const { data: h_data, error: h_error, isLoading: h_isLoading, refetch: h_refetch } = useQuery<WaterPumpType[][], Error>({
    queryKey: ['getBombasHistoricoAction', id],
    queryFn: () => getBombasHistoricoAction(id, intervalo),
    staleTime: Infinity,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (intervalo) {
      h_refetch(); // Refetch solo si intervalo tiene un valor
    }
  }, [intervalo]);

  const { data, error, isLoading } = useQuery<WaterPumpType[], Error>({
    queryKey: ['getBombasAction', id],
    queryFn: () => getBombasAction(id),
    staleTime: 30000,
    refetchOnMount: false,
  });

  useInitialHistoricalData(h_data, topic)
  useResponseData(topic, error, data);



  const WaterPumpData = useMqttStore((state) => state.subsData[topic]) as WaterPumpType[];
  useHistoricalData(WaterPumpData, topic, RealTimeCondition(intervalo as QueryTimeType), 'bomba')
  plotData = useHistoricalStore((state) => state.historicalData[topic]) as WaterPumpType[][];
  const { chartData, chartConfig, YAxisFormatter } = WaterPumpDataPlotFormatted(plotData)
  const { chartDataM, chartConfigM, YAxisFormatterM } = WaterPumpMultipleChartFormatted(plotData)
  if (isLoading) return <LoadingSpinner></LoadingSpinner>
  if (error) return <ErrorCard message={error.message}></ErrorCard>
  return (
    <div className="w-full h-full m-auto">
      <div className='w-full flex-col items-center justify-center pb-4 gap-4 space-y-4'>
        <div className='w-full flex gap-4 justify-between flex-wrap'>
          <div className='flex gap-4 flex-wrap'>
            <ButtonRangeDate dateRange={dateRange} setDateRange={setDateRange}></ButtonRangeDate>
            <ButtonDownloadCSV
              fileName={'Bombas de Agua'}
              endpoint={contentData.download!}
              startTime={startTime}
              endTime={endTime}
              query={`bomba=${id}`}
            />

          </div>

          <ButtonFechingDate setIntervalo={setIntervalo} intervalo={intervalo}></ButtonFechingDate>
        </div>
        <div className='w-full h-full flex-col space-y-4 items-center justify-center'>
          {WaterPumpData ?
            (
              <PumpCard data={WaterPumpData}></PumpCard>
            ) : (<div>Error</div>)
          }
          {chartData.length >= 0 && <StakedSingleChart timeRange={intervalo as QueryTimeType} YAxisFormatter={YAxisFormatter} chartData={chartData} chartConfig={chartConfig} plotType="linear"></StakedSingleChart>}
          {chartDataM && chartDataM.length >= 0 && <MultipleSingleCharts YAxisFormatter={YAxisFormatterM} chartData={chartDataM} chartConfig={chartConfigM} plotType="linear" timeRange={intervalo as QueryTimeType}></MultipleSingleCharts>}
        </div>

      </div>
    </div>

  )
}
