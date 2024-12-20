
'use client'

import { useMqttStore } from '@/mqtt/store/mqttStore';
import { AreaData, VariatorsType } from '@/types';
import { getVariatorData } from '@/utils/callsApi/apiCalls';
import { useQuery } from '@tanstack/react-query';
import { useResponseData } from '@/hooks/useResponseData';
import { useTopicsSubcriptions } from '@/mqtt/topics/useTopicsSubscriptions';
import { TOPICS } from '@/mqtt/topics/topics.data';
import VariatorCard from '../../Card/VariatorCard/VariatorCard';

export default function VariatorsContent({ contentData }: { contentData: AreaData }) {

  const topic = TOPICS[contentData.topickey]
  const id = contentData.id!
  useTopicsSubcriptions(topic)
    useTopicsSubcriptions(TOPICS[topic])
    const { data, error, isLoading } = useQuery<VariatorsType[], Error>({
        queryKey: ['getVariatorData', id], queryFn: () =>
            getVariatorData(id),
        staleTime: 0, // Los datos permanecen frescos indefinidamente 
        refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
    })

    useResponseData(topic, error, data);
    const VariatorData = useMqttStore((state) => state.subsData[topic]) as VariatorsType[];
    if (isLoading) return <div>Cargando...</div>;
    if (error) return <div>Error al obtener datos: {(error as Error).message}</div>
    return (
        <div className='w-full h-full flex items-center justify-center'>
              {VariatorData ?
                (<div className='w-full flex-col space-y-4 items-center justify-center'>
                  <VariatorCard data={VariatorData}></VariatorCard>
                </div>) : (<div>Error</div>)
              }
            </div>
    )
}
