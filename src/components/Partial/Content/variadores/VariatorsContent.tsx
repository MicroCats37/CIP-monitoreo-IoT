
'use client'

import { useMqttStore } from '@/mqtt/store/mqttStore';
import { VariatorsType } from '@/types';
import { getVariatorData } from '@/utils/callsApi/apiCalls';
import { useQuery } from '@tanstack/react-query';
import { useResponseData } from '@/hooks/useResponseData';
import { useTopicsSubcriptions } from '@/mqtt/topics/useTopicsSubscriptions';
import { TOPICS } from '@/mqtt/topics/topics.data';
import VariatorCard from '../../Card/VariatorCard/VariatorCard';

export default function VariatorsContent({ id }: { id: string }) {

    const sentId = id.replaceAll('-', '')
    useTopicsSubcriptions(TOPICS[`variador${sentId}`])
    const { data, error, isLoading } = useQuery<VariatorsType[], Error>({
        queryKey: ['getVariatorData', id], queryFn: () =>
            getVariatorData(id),
        staleTime: 0, // Los datos permanecen frescos indefinidamente 
        refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
    })

    useResponseData(TOPICS[`variador${sentId}`], error, data);
    const VariatorData = useMqttStore((state) => state.subsData[TOPICS[`variador${sentId}`]]) as VariatorsType[];
    if (isLoading) return <div>Cargando...</div>;
    if (error) return <div>Error al obtener datos: </div>
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
