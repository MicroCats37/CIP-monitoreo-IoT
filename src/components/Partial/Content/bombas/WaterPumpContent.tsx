'use client'
import PumpCard from "@/components/Partial/Card/PumpCard/PumpCard";
import { useMqttStore } from "@/mqtt/store/mqttStore";
import { AreaData, WaterPumpType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useResponseData } from "@/hooks/useResponseData";
import { useTopicsSubcriptions } from "@/mqtt/topics/useTopicsSubscriptions";
import { TOPICS } from "@/mqtt/topics/topics.data";
import { getBombasAction } from "@/influxDB/actions/BombasAction";
import { getBombasHistoricoAction } from "@/influxDB/actions-plots/HistoricoBombasActions";
import PumpPlots from "../../Plot/bombas/PumpPlots";
import { useInitialHistoricalData } from "@/hooks/useInitialHistoricalData";
import { useHistoricalData } from "@/hooks/useHistorialData";
import { useHistoricalStore } from "@/store/plots";
import { WaterPumpCharts } from "../../Plot/bombas/WaterPumpCharts";
import { ButtonFechingDate } from "@/components/Custom/ButtonSelector/ButtonFechingDate";
import { useState } from "react";


export default function WaterPumpContent({ contentData }: { contentData: AreaData }) {
  const [intervalo, setIntervalo] = useState<string>("30m");

  const topic = TOPICS[contentData.topickey]
  const id = contentData.id!
  let plotData: WaterPumpType[][] = []
  useTopicsSubcriptions(topic)

  const { data: h_data, error: h_error, isLoading: h_isLoading } = useQuery<WaterPumpType[][], Error>({
    queryKey: ['getBombasHistoricoAction', id],
    queryFn: () => getBombasHistoricoAction(id,intervalo),
    staleTime: Infinity,
    refetchOnMount: false,
  });

  const { data, error, isLoading } = useQuery<WaterPumpType[], Error>({
    queryKey: ['getBombasAction', id],
    queryFn: () => getBombasAction(id),
    staleTime: 30000,
    refetchOnMount: false,
  });

  useInitialHistoricalData(h_data, topic)
  useResponseData(topic, error, data);



  const WaterPumpData = useMqttStore((state) => state.subsData[topic]) as WaterPumpType[];
  useHistoricalData(WaterPumpData, topic, 'bomba')
  plotData = useHistoricalStore((state) => state.historicalData[topic]) as WaterPumpType[][];


  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al obtener datos: {(error as Error).message}</div>
  return (
    <div className="w-full h-full m-auto">



      <div className='w-full flex-col items-center justify-center pb-4 gap-4 space-y-4'>
        <ButtonFechingDate setIntervalo={setIntervalo} intervalo={intervalo}></ButtonFechingDate>
        <div className='w-full h-full flex-col space-y-4 items-center justify-center'>
          {WaterPumpData ?
            (

              <PumpCard data={WaterPumpData}></PumpCard>
            ) : (<div>Error</div>)
          }

          {plotData && (<PumpPlots pumpData={plotData} />)}
          {plotData && (<WaterPumpCharts pumpData={plotData} />)}


        </div>

      </div>
    </div>

  )
}
