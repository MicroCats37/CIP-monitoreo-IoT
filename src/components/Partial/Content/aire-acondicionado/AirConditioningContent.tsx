'use client'

import { useMqttStore } from '@/mqtt/store/mqttStore'
import { useQuery } from '@tanstack/react-query'
import { AirConditioningType, AreaData } from '@/types'
import AirConditioningCard from '../../Card/AirConditioningCard/AirConditioningCard'
import { useResponseData } from '@/hooks/useResponseData'
import { useTopicsSubcriptions } from '@/mqtt/topics/useTopicsSubscriptions'
import { TOPICS } from '@/mqtt/topics/topics.data'
import { getAireAcondicionadoAction } from '@/influxDB/actions/AireAcondicionadoAction'
import LoadingSpinner from '@/components/Custom/LoaderSpiner/LoadingSpinner'
import { ErrorCard } from '@/components/Custom/ErrorCard/ErrorCard'




export default function AirConditioningContent({ contentData }: { contentData: AreaData }) {
  const topic = TOPICS[contentData.topickey]
  const id = contentData.id
  useTopicsSubcriptions(topic)
  const { data, error, isLoading } = useQuery<AirConditioningType, Error>({
    queryKey: ['getAireAcondicionadoAction', `${id}`], queryFn: () =>
      getAireAcondicionadoAction(`${id}`),
    staleTime: 30000, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })

  useResponseData(topic, error, data);

  const airData = useMqttStore((state) => state.subsData[topic]) as AirConditioningType;
  if (isLoading) return <LoadingSpinner></LoadingSpinner>
  if (error) return <ErrorCard message={error.message}></ErrorCard>

  return (
    <div className='w-full h-full'>
      {
        airData && <AirConditioningCard data={airData} controller={id==='1'? '55':'56'}></AirConditioningCard>
      }
    </div>
  );
}
