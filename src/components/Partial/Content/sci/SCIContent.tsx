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
import { SCIAllCharts } from '../../Plot/sci/SCIAllCharts';
import { useEffect, useState } from 'react';
import { ButtonFechingDate } from '@/components/Custom/ButtonSelector/ButtonFechingDate';

export default function SCIContent({ contentData }: { contentData: AreaData }) {

  const [intervalo, setIntervalo] = useState<string>("30m");

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
  useHistoricalData(simplifiedData ? [simplifiedData as SCISimplifiedType] : undefined, topic)
  plotData = useHistoricalStore((state) => state.historicalData[topic]) as SCISimplifiedType[][];
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al obtener datos: {(error as Error).message}</div>
  return (
    <div className='w-full h-full m-auto'>

      <div className='w-full flex-col items-center justify-center pb-4 gap-4 space-y-4'>
        <ButtonFechingDate setIntervalo={setIntervalo} intervalo={intervalo}></ButtonFechingDate>
        <div className='w-full h-full flex-col space-y-4 items-center justify-center'>
          {
            SCIData ? (
              <SCICard data={SCIData}></SCICard>
            ) : (<div>Error</div>)
          }
          {
            plotData && <SCIAllCharts data={plotData}></SCIAllCharts>
          }

        </div>

      </div>


    </div>
  )
}
