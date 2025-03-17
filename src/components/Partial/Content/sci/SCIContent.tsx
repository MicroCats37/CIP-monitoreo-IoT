'use client'

import { useMqttStore } from '@/mqtt/store/mqttStore';
import { AreaData, SCISimplifiedType, SCIType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import SCICard from '../../Card/SCICard/SCICard';
import { useResponseData } from '@/hooks/useResponseData';
import { useTopicsSubcriptions } from '@/mqtt/topics/useTopicsSubscriptions';
import { TOPICS } from '@/mqtt/topics/topics.data';
import { getSCIAction } from '@/influxDB/actions/SCIAction';
import { getHistoricoSCIAction } from '@/influxDB/actions-plots/HistoricoSCIActions';
import { useInitialHistoricalData } from '@/hooks/useInitialHistoricalData';
import { useHistoricalData } from '@/hooks/useHistorialData';
import { useHistoricalStore } from '@/store/plots';
import { useEffect, useState } from 'react';
import { ButtonFechingDate, QueryTimeType } from '@/components/Custom/ButtonSelector/ButtonFechingDate';
import { CSIMultipleChartFormatted } from './SCIFormattedDataPlot';
import { MultipleSingleCharts } from '../../Plot/general/MultipleSingleCharts';
import LoadingSpinner from '@/components/Custom/LoaderSpiner/LoadingSpinner';
import { ErrorCard } from '@/components/Custom/ErrorCard/ErrorCard';
import { RealTimeCondition } from '@/utils/validatorRealTimePlot';
import { DateRange } from 'react-day-picker';
import { ButtonRangeDate } from '@/components/Custom/ButtonRangeDate/ButtonRangeDate';
import { ButtonDownloadCSV } from '@/components/Custom/ButtonDownloadCSV/ButtonDownloadCSV';

export default function SCIContent({ contentData }: { contentData: AreaData }) {

  const [intervalo, setIntervalo] = useState<string>("30m");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setHours(new Date().getHours() - 1)), // 1 hora antes
    to: new Date(),
  });
  const endTime = dateRange.to?.toISOString() ? dateRange.to?.toISOString() : new Date().toISOString(); // Resta 1 hora
  const startTime = dateRange.from?.toISOString() ? dateRange.from?.toISOString() : new Date(new Date(endTime).getTime() - 60 * 60 * 1000).toISOString();

  const topic = TOPICS[contentData.topickey]
  useTopicsSubcriptions(topic)
  let plotData: SCISimplifiedType[][] = []
  const { data: h_data, error: h_error, isLoading: h_isLoading, refetch: h_refetch } = useQuery<SCISimplifiedType[][], Error>({
    queryKey: ['getHistoricoSCIAction'], queryFn: () =>
      getHistoricoSCIAction(intervalo),
    staleTime: Infinity, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })

  useEffect(() => {
    if (intervalo) {
      h_refetch(); // Refetch solo si intervalo tiene un valor
    }
  }, [intervalo]);

  const { data, error, isLoading } = useQuery<SCIType, Error>({
    queryKey: ['getSCIAction'], queryFn: () =>
      getSCIAction(),
    staleTime: 30000, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })

  useInitialHistoricalData(h_data, topic)
  useResponseData(topic, error, data);
  const SCIData = useMqttStore((state) => state.subsData[topic]) as SCIType;
  const simplifiedData = SCIData ? {
    time: SCIData.time,
    data: {
      voltage: SCIData.data.voltage,
      current: SCIData.data.current,
      frequency: SCIData.data.frequency,
      custom_locked_rotor_current: SCIData.data.custom_locked_rotor_current,
    },
  } : undefined;
  useHistoricalData(simplifiedData ? [simplifiedData as SCISimplifiedType] : undefined, topic, RealTimeCondition(intervalo as QueryTimeType))
  plotData = useHistoricalStore((state) => state.historicalData[topic]) as SCISimplifiedType[][];
  const { chartDataM, chartConfigM } = CSIMultipleChartFormatted(plotData)
  if (isLoading) return <LoadingSpinner></LoadingSpinner>
  if (error) return <ErrorCard message={error.message}></ErrorCard>
  return (
    <div className='w-full h-full m-auto'>

      <div className='w-full flex-col items-center justify-center pb-4 gap-4 space-y-4'>
        <div className='w-full flex gap-4 justify-between flex-wrap'>
          <div className='flex gap-4 flex-wrap'>
            <ButtonRangeDate dateRange={dateRange} setDateRange={setDateRange}></ButtonRangeDate>
            <ButtonDownloadCSV
              fileName={'Sistema Contra Incendios'}
              endpoint={contentData.download!}
              startTime={startTime}
              endTime={endTime}
            />
          </div>
          <ButtonFechingDate setIntervalo={setIntervalo} intervalo={intervalo}></ButtonFechingDate>
        </div>
        <div className='w-full h-full flex-col space-y-4 items-center justify-center'>
          {
            SCIData ? (
              <SCICard data={SCIData}></SCICard>
            ) : (<div>Error</div>)
          }
          {chartDataM && chartDataM.length >= 0 && <MultipleSingleCharts chartData={chartDataM} chartConfig={chartConfigM} plotType="linear" timeRange={intervalo as QueryTimeType}></MultipleSingleCharts>}

        </div>

      </div>


    </div>
  )
}
