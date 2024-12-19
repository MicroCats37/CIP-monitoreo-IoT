'use client'
import React, { useEffect } from 'react'
import { useMqttStore } from '@/mqtt/store/mqttStore'
import { useQuery } from '@tanstack/react-query'
import { AirConditioningType } from '@/types'
import { getAirConditioningData } from '@/utils/callsApi/apiCalls'
import AirConditioningCard from '../../Card/AirConditioningCard/AirConditioningCard'
import { useResponseData } from '@/hooks/useResponseData'
import { useTopicsSubcriptions } from '@/mqtt/topics/useTopicsSubscriptions'
import { TOPICS } from '@/mqtt/topics/topics.data'



export default function AirConditioningContent({ id }: { id: string }) {
  const topic = TOPICS[`aire${id}`]
  useTopicsSubcriptions(topic)
  const { data, error, isLoading } = useQuery<AirConditioningType, Error>({
    queryKey: ['getAirConditioningData', `${id}`], queryFn: () =>
      getAirConditioningData(`${id}`),
    staleTime: 0, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })

  useResponseData(topic, error, data);

  const airData = useMqttStore((state) => state.subsData[topic]) as AirConditioningType;
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al obtener datos</div>

  return (
    <div className='w-full h-full'>
      {
        airData && <AirConditioningCard data={airData}></AirConditioningCard>
      }
    </div>
  );
}
