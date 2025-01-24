'use client'

import { useMqttStore } from '@/mqtt/store/mqttStore';
import { AreaData, BoardType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import BoardCard from '../../Card/BoardCard/BoardCard';
import { useResponseData } from '@/hooks/useResponseData';
import { useTopicsSubcriptions } from '@/mqtt/topics/useTopicsSubscriptions';
import { TOPICS } from '@/mqtt/topics/topics.data';
import { getTableroAction } from '@/influxDB/actions/TablerosAction';
import { getHistoricoTablerosAction } from '@/influxDB/actions-plots/HistoricoTablerosActions';
import { useHistoricalStore } from '@/store/plots';
import { useState } from 'react';
import { useInitialHistoricalData } from '@/hooks/useInitialHistoricalData';
import { useHistoricalData } from '@/hooks/useHistorialData';
import { useShallow } from 'zustand/react/shallow'
import { BoardCharts } from '../../Plot/tableros/BoardCharts';
import { ButtonFechingDate } from '@/components/Custom/ButtonSelector/ButtonFechingDate';
export default function BoardsContent({ contentData }: { contentData: AreaData }) {
  const [intervalo, setIntervalo] = useState<string>("30m");


  const topic = TOPICS[contentData.topickey]
  let plotData: BoardType[][] = []
  useTopicsSubcriptions(topic)

  const { data: h_data, error: h_error, isLoading: h_isLoading } = useQuery<BoardType[][], Error>({
    queryKey: ['getHistoricoTablerosAction'],
    queryFn: () => getHistoricoTablerosAction(intervalo),
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const { data, error, isLoading } = useQuery<BoardType[], Error>({
    queryKey: ['getTableroAction'], queryFn: () =>
      getTableroAction(),
    staleTime: 30000, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })


  useInitialHistoricalData(h_data, topic)
  useResponseData(topic, error, data);
  const BoardsData = useMqttStore((state) => state.subsData[topic]) as BoardType[];
  useHistoricalData(BoardsData, topic, 'potencia')
  plotData = useHistoricalStore(useShallow((state) => state.historicalData[topic])) as BoardType[][];
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al obtener datos: {(error as Error).message}</div>
  return (
    <div className='w-full h-full m-auto'>
      <div className='w-full flex-col items-center justify-center pb-4 gap-4 space-y-4'>
        <ButtonFechingDate setIntervalo={setIntervalo} intervalo={intervalo}></ButtonFechingDate>
        <div className='w-full h-full flex-col space-y-4 items-center justify-center'>
          {BoardsData ?
            (
              <BoardCard data={BoardsData}></BoardCard>
            )
            : (<div>Error</div>)
          }
          {plotData && <BoardCharts powerData={plotData} />}
        </div>
      </div>
    </div>
  )
}
