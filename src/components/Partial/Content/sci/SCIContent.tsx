'use client'

import { useMqttStore } from '@/mqtt/store/mqttStore';
import { AreaData, SCIType } from '@/types';
import { getSCIData } from '@/utils/callsApi/apiCalls';
import { useQuery } from '@tanstack/react-query';
import SCICard from '../../Card/SCICard/SCICard';
import { useResponseData } from '@/hooks/useResponseData';
import {  useTopicsSubcriptions } from '@/mqtt/topics/useTopicsSubscriptions';
import { TOPICS } from '@/mqtt/topics/topics.data';

export default function SCIContent({ contentData }: { contentData: AreaData }) {
  const topic = TOPICS[contentData.topickey]
  useTopicsSubcriptions(topic)
  const { data, error, isLoading } = useQuery<SCIType, Error>({
    queryKey: ['getSCIData'], queryFn: () =>
      getSCIData(),
    staleTime: 0, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })

  useResponseData(topic, error, data);
  const SCIData = useMqttStore((state) => state.subsData[topic]) as SCIType;
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al obtener datos: {(error as Error).message}</div>
  return (
    <div className='w-full flex relative'>


      {SCIData &&
        (<div className='w-full h-full'>
          <SCICard data={SCIData}></SCICard>
        </div>)

      }

    </div>
  )
}
