'use client'
import PumpCard from "@/components/Partial/Card/PumpCard/PumpCard";
import { useMqttStore } from "@/mqtt/store/mqttStore";
import { AreaData, WaterPumpType } from "@/types";
import { getWaterPumpData } from "@/utils/callsApi/apiCalls";
import { useQuery } from "@tanstack/react-query";
import { useResponseData } from "@/hooks/useResponseData";
import { useTopicsSubcriptions } from "@/mqtt/topics/useTopicsSubscriptions";
import { TOPICS } from "@/mqtt/topics/topics.data";

export default function WaterPumpContent({ contentData }: { contentData: AreaData }) {
  const topic = TOPICS[contentData.topickey]
  const id = contentData.id!
  
  useTopicsSubcriptions(topic)

  const { data, error, isLoading } = useQuery<WaterPumpType[], Error>({
    queryKey: ['getWaterPumpData', id], queryFn: () =>
      getWaterPumpData(id),
    staleTime: 0, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })

  useResponseData(topic, error, data);

  const WaterPumpData = useMqttStore((state) => state.subsData[topic]) as WaterPumpType[];

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al obtener datos: {(error as Error).message}</div>
  return (
    <div className='w-full h-full flex items-center justify-center'>
      {WaterPumpData ?
        (<div className='w-full flex-col space-y-4 items-center justify-center'>
          <PumpCard data={WaterPumpData}></PumpCard>
        </div>) : (<div>Error</div>)
      }
    </div>
  )
}
