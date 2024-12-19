'use client'
import PumpCard from "@/components/Partial/Card/PumpCard/PumpCard";
import { useMqttStore } from "@/mqtt/store/mqttStore";
import { WaterPumpType } from "@/types";
import { getWaterPumpData } from "@/utils/callsApi/apiCalls";
import { useQuery } from "@tanstack/react-query";
import { useResponseData } from "@/hooks/useResponseData";
import { useTopicsSubcriptions } from "@/mqtt/topics/useTopicsSubscriptions";
import { TOPICS } from "@/mqtt/topics/topics.data";

export default function WaterPumpContent({ id }: { id: string }) {
  const sentId = id.replaceAll('-', '')
  useTopicsSubcriptions(TOPICS[`bomba${sentId}`])
  useTopicsSubcriptions(TOPICS[`variador${sentId}`])
  const { data, error, isLoading } = useQuery<WaterPumpType[], Error>({
    queryKey: ['getWaterPumpData', id], queryFn: () =>
      getWaterPumpData(id),
    staleTime: 0, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })

  useResponseData(TOPICS[`bomba${sentId}`], error, data);

  const WaterPumpData = useMqttStore((state) => state.subsData[TOPICS[`bomba${sentId}`]]) as WaterPumpType[];

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al obtener datos: </div>
  return (
    <div className='w-full h-full flex items-center justify-center'>
      {WaterPumpData ?
        (<div className='w-full flex-col space-y-4 items-center justify-center'>
          <PumpCard data={WaterPumpData }></PumpCard>
        </div>) : (<div>Error</div>)
      }
    </div>
  )
}
