'use client'

import { useMqttStore } from '@/mqtt/store/mqttStore';
import { AreaData, CO2Type} from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useResponseData } from '@/hooks/useResponseData';
import { useTopicsSubcriptions } from '@/mqtt/topics/useTopicsSubscriptions';
import { TOPICS } from '@/mqtt/topics/topics.data';

import { useInitialHistoricalData } from '@/hooks/useInitialHistoricalData';
import { useHistoricalData } from '@/hooks/useHistorialData';
import { useHistoricalStore } from '@/store/plots';
import { useEffect, useState } from 'react';
import { ButtonFechingDate, QueryTimeType } from '@/components/Custom/ButtonSelector/ButtonFechingDate';
import { MultipleSingleCharts } from '../../Plot/general/MultipleSingleCharts';
import LoadingSpinner from '@/components/Custom/LoaderSpiner/LoadingSpinner';
import { ErrorCard } from '@/components/Custom/ErrorCard/ErrorCard';
import { RealTimeCondition } from '@/utils/validatorRealTimePlot';
import { DateRange } from 'react-day-picker';
import { ButtonRangeDate } from '@/components/Custom/ButtonRangeDate/ButtonRangeDate';
import { ButtonDownloadCSV } from '@/components/Custom/ButtonDownloadCSV/ButtonDownloadCSV';

import { CO2ChartFormatted } from './CO2FormattedDataPlot';
import CO2Card from '../../Card/CO2Card/CO2Card';
import { getCO2Action } from '@/influxDB/actions/CO2Action';
import { getHistoricoCO2Action } from '@/influxDB/actions-plots/HistoricoCO2Actions';


export default function CO2Content({ contentData }: { contentData: AreaData }) {

  const [intervalo, setIntervalo] = useState<string>("30m");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setHours(new Date().getHours() - 1)), // 1 hora antes
    to: new Date(),
  });
  const endTime = dateRange.to?.toISOString() ? dateRange.to?.toISOString() : new Date().toISOString(); // Resta 1 hora
  const startTime = dateRange.from?.toISOString() ? dateRange.from?.toISOString() : new Date(new Date(endTime).getTime() - 60 * 60 * 1000).toISOString();

  const topic = TOPICS[contentData.topickey]
  useTopicsSubcriptions(topic)
  let plotData: CO2Type[][] = []
  const { data: h_data, error: h_error, isLoading: h_isLoading, refetch: h_refetch } = useQuery<CO2Type[][], Error>({
    queryKey: ['getHistoricoCO2Action'], queryFn: () =>
      getHistoricoCO2Action(intervalo),
    staleTime: Infinity, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })

  useEffect(() => {
    if (intervalo) {
      h_refetch(); // Refetch solo si intervalo tiene un valor
    }
  }, [intervalo]);
  
  const { data, error, isLoading } = useQuery<CO2Type, Error>({
    queryKey: ['getCO2Action'], queryFn: () =>
      getCO2Action(),
    staleTime: 30000, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })
  
  useInitialHistoricalData(h_data, topic)
  useResponseData(topic, error, data);
  const CO2Data = useMqttStore((state) => state.subsData[topic]) as CO2Type;
  useHistoricalData(CO2Data ? [CO2Data as CO2Type] : undefined, topic, RealTimeCondition(intervalo as QueryTimeType))
  plotData = useHistoricalStore((state) => state.historicalData[topic]) as CO2Type[][];
  const { chartDataM, chartConfigM } = CO2ChartFormatted(plotData)
  if (isLoading) return <LoadingSpinner></LoadingSpinner>
  if (error) return <ErrorCard message={error.message}></ErrorCard>
  return (
    <div className='w-full h-full m-auto'>
      <div className='w-full flex-col items-center justify-center pb-4 gap-4 space-y-4'>
        <div className='w-full flex gap-4 justify-between flex-wrap'>
          <div className='flex gap-4 flex-wrap'>
            <ButtonRangeDate dateRange={dateRange} setDateRange={setDateRange}></ButtonRangeDate>
            <ButtonDownloadCSV
              fileName={'Concentracion de CO2 '}
              endpoint={contentData.download!}
              startTime={startTime}
              endTime={endTime}
            />
          </div>
          <ButtonFechingDate setIntervalo={setIntervalo} intervalo={intervalo}></ButtonFechingDate>
        </div>
        <div className='w-full h-full flex-col space-y-4 items-center justify-center'>
          {
            CO2Data ? (
              <CO2Card data={[CO2Data]}></CO2Card>
            ) : (<div>Error</div>)
          }
          {chartDataM && chartDataM.length >= 0 && <MultipleSingleCharts chartData={chartDataM} chartConfig={chartConfigM} plotType="linear" timeRange={intervalo as QueryTimeType}></MultipleSingleCharts>}

        </div>

      </div>


    </div>
  )
}
