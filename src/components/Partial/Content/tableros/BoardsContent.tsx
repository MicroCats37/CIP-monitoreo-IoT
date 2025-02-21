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
import { useEffect, useState } from 'react';
import { useInitialHistoricalData } from '@/hooks/useInitialHistoricalData';
import { useHistoricalData } from '@/hooks/useHistorialData';
import { useShallow } from 'zustand/react/shallow'
import { ButtonFechingDate, QueryTimeType } from '@/components/Custom/ButtonSelector/ButtonFechingDate';
import { BoardMultipleChartFormatted } from './BoardFormattedDataPlot';
import { MultipleSingleCharts } from '../../Plot/general/MultipleSingleCharts';
import LoadingSpinner from '@/components/Custom/LoaderSpiner/LoadingSpinner';
import { ErrorCard } from '@/components/Custom/ErrorCard/ErrorCard';
import { RealTimeCondition } from '@/utils/validatorRealTimePlot';
export default function BoardsContent({ contentData }: { contentData: AreaData }) {
  const [intervalo, setIntervalo] = useState<string>("30m");


  const topic = TOPICS[contentData.topickey]
  let plotData: BoardType[][] = []
  useTopicsSubcriptions(topic)

  const { data: h_data, error: h_error, isLoading: h_isLoading, refetch: h_refetch } = useQuery<BoardType[][], Error>({
    queryKey: ['getHistoricoTablerosAction'],
    queryFn: () => getHistoricoTablerosAction(intervalo),
    staleTime: Infinity,
    refetchOnMount: false,
  });


  useEffect(() => {
    if (intervalo) {
      h_refetch(); // Refetch solo si intervalo tiene un valor
    }
  }, [intervalo]);

  const { data, error, isLoading } = useQuery<BoardType[], Error>({
    queryKey: ['getTableroAction'], queryFn: () =>
      getTableroAction(),
    staleTime: 30000, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })


  useInitialHistoricalData(h_data, topic)
  useResponseData(topic, error, data);
  const BoardsData = useMqttStore((state) => state.subsData[topic]) as BoardType[];
  useHistoricalData(BoardsData, topic,RealTimeCondition(intervalo as QueryTimeType), 'potencia')
  plotData = useHistoricalStore(useShallow((state) => state.historicalData[topic])) as BoardType[][];
  const { chartDataM, chartConfigM } = BoardMultipleChartFormatted(plotData)
  if (isLoading) return <LoadingSpinner></LoadingSpinner>
  if (error) return <ErrorCard message={error.message}></ErrorCard>
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
          {chartDataM && chartDataM.length >= 0 && <MultipleSingleCharts chartData={chartDataM} chartConfig={chartConfigM} plotType="linear" timeRange={intervalo as QueryTimeType}></MultipleSingleCharts>}
        </div>
      </div>
    </div>
  )
}
