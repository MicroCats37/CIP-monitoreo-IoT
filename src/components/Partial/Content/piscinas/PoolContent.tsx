'use client'

import { useMqttStore } from '@/mqtt/store/mqttStore'
import { useQuery } from '@tanstack/react-query'
import { PoolType, AreaData } from '@/types'
import { useResponseData } from '@/hooks/useResponseData'
import { useTopicsSubcriptions } from '@/mqtt/topics/useTopicsSubscriptions'
import { TOPICS } from '@/mqtt/topics/topics.data'
import { getPiscinasAction } from '@/influxDB/actions/PiscinasAction'
import PoolCard from '../../Card/PoolCard/PoolCard'
import { useEffect, useState } from 'react'
import { getPiscinasHistoricoAction } from '@/influxDB/actions-plots/HisctoricoPiscinasActions'
import { useInitialHistoricalData } from '@/hooks/useInitialHistoricalData'
import { useHistoricalStore } from '@/store/plots'
import { useHistoricalData } from '@/hooks/useHistorialData'
import { PoolDataPlotFormatted, PoolMultipleChartFormatted } from './PoolFormattedDataPlot'
import { StakedSingleChart } from '../../Plot/general/StackedSingleChart'
import { MultipleSingleCharts } from '../../Plot/general/MultipleSingleCharts'
import { ButtonFechingDate, QueryTimeType } from '@/components/Custom/ButtonSelector/ButtonFechingDate'
import LoadingSpinner from '@/components/Custom/LoaderSpiner/LoadingSpinner'
import { ErrorCard } from '@/components/Custom/ErrorCard/ErrorCard'
import { RealTimeCondition } from '@/utils/validatorRealTimePlot'
import { DateRange } from 'react-day-picker'
import { ButtonRangeDate } from '@/components/Custom/ButtonRangeDate/ButtonRangeDate'
import { ButtonDownloadCSV } from '@/components/Custom/ButtonDownloadCSV/ButtonDownloadCSV'

export default function PoolContent({ contentData }: { contentData: AreaData }) {
  const [intervalo, setIntervalo] = useState<string>("30m");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setHours(new Date().getHours() - 1)), // 1 hora antes
    to: new Date(),
  });
  const endTime = dateRange.to?.toISOString() ? dateRange.to?.toISOString() : new Date().toISOString(); // Resta 1 hora
  const startTime = dateRange.from?.toISOString() ? dateRange.from?.toISOString() : new Date(new Date(endTime).getTime() - 60 * 60 * 1000).toISOString();
  let data1: PoolType | undefined = undefined
  let data2: PoolType | undefined = undefined
  let plotData: PoolType[][] = []

  let CardData: PoolType[] = []
  const topic1 = TOPICS["concentracion de cloro piscina 1"]
  const topic2 = TOPICS["concentracion de cloro piscina 2"]
  useTopicsSubcriptions(topic1)
  useTopicsSubcriptions(topic2)


  const { data: h_data, error: h_error, isLoading: h_isLoading, refetch: h_refetch } = useQuery<PoolType[][], Error>({
    queryKey: ['getBombasHistoricoAction'],
    queryFn: () => getPiscinasHistoricoAction(intervalo),
    staleTime: Infinity,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (intervalo) {
      h_refetch(); // Refetch solo si intervalo tiene un valor
    }
  }, [intervalo]);


  const { data, error, isLoading } = useQuery<PoolType[], Error>({
    queryKey: ['getPiscinaAction'], queryFn: () =>
      getPiscinasAction(),
    staleTime: 30000, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })


  useInitialHistoricalData(h_data, 'dashboard/piscinas')


  if (data) {
    data1 = data.find(d => d.data.piscina === 'Piscina 1')
    data2 = data.find(d => d.data.piscina === 'Piscina 2')
  }
  useResponseData(topic1, error, data1);
  useResponseData(topic2, error, data2);

  const poolData1 = useMqttStore((state) => state.subsData[topic1]) as PoolType;
  const poolData2 = useMqttStore((state) => state.subsData[topic2]) as PoolType;
  CardData = [poolData1, poolData2].filter(Boolean);
  useHistoricalData(CardData, 'dashboard/piscinas', RealTimeCondition(intervalo as QueryTimeType), 'piscina')
  plotData = useHistoricalStore((state) => state.historicalData['dashboard/piscinas']) as PoolType[][];
  const { chartDataM, chartConfigM, YAxisFormatterM } = PoolMultipleChartFormatted(plotData)


  if (isLoading) return <LoadingSpinner></LoadingSpinner>
  if (error) return <ErrorCard message={error.message}></ErrorCard>
  return (
    <div className="w-full h-full m-auto">
      <div className='w-full flex-col items-center justify-center pb-4 gap-4 space-y-4'>
        <div className='w-full flex gap-4 justify-between flex-wrap'>
          <div className='flex gap-4 flex-wrap'>
            <ButtonRangeDate dateRange={dateRange} setDateRange={setDateRange}></ButtonRangeDate>
            <ButtonDownloadCSV
              fileName={'Concentracion de Cloro Pisicinas '}
              endpoint={contentData.download!}
              startTime={startTime}
              endTime={endTime}
            />

          </div>

          <ButtonFechingDate setIntervalo={setIntervalo} intervalo={intervalo}></ButtonFechingDate>
        </div>
        <div className='w-full h-full flex-col space-y-4 items-center justify-center'>
          {
            CardData.length > 0 && <PoolCard data={CardData}></PoolCard>
          }
          {chartDataM && chartDataM.length >= 0 && <MultipleSingleCharts chartData={chartDataM} chartConfig={chartConfigM} plotType="linear" timeRange={intervalo as QueryTimeType}></MultipleSingleCharts>}
        </div>

      </div>
    </div>

  )
}
