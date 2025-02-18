
'use client'

import { useMqttStore } from '@/mqtt/store/mqttStore';
import { AreaData, VariatorsType } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useResponseData } from '@/hooks/useResponseData';
import { useTopicsSubcriptions } from '@/mqtt/topics/useTopicsSubscriptions';
import { TOPICS } from '@/mqtt/topics/topics.data';
import VariatorCard from '../../Card/VariatorCard/VariatorCard';
import { getVariadoresAction } from '@/influxDB/actions/VariadoresAction';
import { getVariadoresHistoricoAction } from '@/influxDB/actions-plots/HistoricoVariadoresActions';
import { useInitialHistoricalData } from '@/hooks/useInitialHistoricalData';
import { useHistoricalData } from '@/hooks/useHistorialData';
import { useHistoricalStore } from '@/store/plots';
import { VariatorAllCharts } from '../../Plot/variadores/VariatorAllCharts';
import { ButtonFechingDate } from '@/components/Custom/ButtonSelector/ButtonFechingDate';
import { useEffect, useState } from 'react';
import { VariatorMultipleChartFormatted } from './VariatorsFormattedDataPlot';
import { SelectorInteractiveCharts } from '../../Plot/general/SelectorInteractiveCharts';
import { MultipleSelectorInteractiveCharts } from '../../Plot/general/MultipleSelectorInteractiveCharts';

export default function VariatorsContent({ contentData }: { contentData: AreaData }) {

  const [intervalo, setIntervalo] = useState<string>("30m");

  const topic = TOPICS[contentData.topickey]
  const id = contentData.id!
  let plotData: VariatorsType[][] = []
  useTopicsSubcriptions(topic)
  useTopicsSubcriptions(TOPICS[topic])

  const { data: h_data, error: h_error, isLoading: h_isLoading, refetch: h_refetch } = useQuery<VariatorsType[][], Error>({
    queryKey: ['getVariadoresHistoricoAction', id], queryFn: () =>
      getVariadoresHistoricoAction(id, intervalo),
    staleTime: Infinity, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })

  useEffect(() => {
    if (intervalo) {
      h_refetch(); // Refetch solo si intervalo tiene un valor
    }
  }, [intervalo]);


  const { data, error, isLoading } = useQuery<VariatorsType[], Error>({
    queryKey: ['getVariadoresAction', id], queryFn: () =>
      getVariadoresAction(id),
    staleTime: 30000, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })
  useInitialHistoricalData(h_data, topic)
  useResponseData(topic, error, data);
  const VariatorData = useMqttStore((state) => state.subsData[topic]) as VariatorsType[];
  useHistoricalData(VariatorData, topic, 'bomba')
  plotData = useHistoricalStore((state) => state.historicalData[topic]) as VariatorsType[][];
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al obtener datos: {(error as Error).message}</div>
  return (
    <div className='h-full w-full m-auto'>
      <div className='w-full flex-col items-center justify-center pb-4 gap-4 space-y-4'>
        <ButtonFechingDate setIntervalo={setIntervalo} intervalo={intervalo}></ButtonFechingDate>
        <div className='w-full h-full flex-col space-y-4 items-center justify-center'>
          {VariatorData ?
            (
              <VariatorCard data={VariatorData}></VariatorCard>

            ) : (<div>Error</div>)
          }

          { plotData &&
            <MultipleSelectorInteractiveCharts chartsData={plotData} dataKey='bomba'></MultipleSelectorInteractiveCharts>
          }
        </div>
      </div>
    </div>
  )
}
