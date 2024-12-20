'use client'

import { useMqttStore } from '@/mqtt/store/mqttStore';
import { AreaData, BoardType } from '@/types';
import { getBoardData } from '@/utils/callsApi/apiCalls';
import { useQuery } from '@tanstack/react-query';
import BoardCard from '../../Card/BoardCard/BoardCard';
import { useResponseData } from '@/hooks/useResponseData';
import { useTopicsSubcriptions } from '@/mqtt/topics/useTopicsSubscriptions';
import { TOPICS } from '@/mqtt/topics/topics.data';

export default function BoardsContent({ contentData }: { contentData: AreaData }) {
  const topic = TOPICS[contentData.topickey]
  useTopicsSubcriptions(topic)
  const { data, error, isLoading } = useQuery<BoardType[], Error>({
    queryKey: ['getBoardData'], queryFn: () =>
      getBoardData(),
    staleTime: 0, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })
  useResponseData(topic, error, data);
  const BoardsData = useMqttStore((state) => state.subsData[topic]) as BoardType[];
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al obtener datos: {(error as Error).message}</div>
  return (
    <div className='w-full flex relative'>
      {BoardsData ?
        (<div className='w-full'>
          <BoardCard data={BoardsData}></BoardCard>
        </div>)
        : (<div>Error</div>)
      }
    </div>
  )
}
