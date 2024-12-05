'use client'
import React, { useEffect } from 'react'
import { TOPICS,  useAirConditioningSubscription} from '@/mqtt/topics/AireAcondicionadoSubscriptions'
import { useMqttStore } from '@/store/mqttStore'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AirConditioningType } from '@/types'
import { getAirConditioningData } from '@/utils/callsApi/apiCalls'
import AirConditioningCard from '../../Card/AirConditioningCard/AirConditioningCard'



export default function AirConditioningContent({ id }: { id: string }) {
  useAirConditioningSubscription(`${id}`)
  const setSubsData = useMqttStore((state) => state.setSubsData)
  const { data, error, isLoading } = useQuery<AirConditioningType, Error>({
    queryKey: ['getAirConditioningData', `${id}`], queryFn: () =>
      getAirConditioningData(`${id}`),
    staleTime: Infinity, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: true, // Los datos permanecen en caché indefinidamente 
    refetchOnWindowFocus: true,// No refetch al montar el componente refetchOnWindowFocus: false, });
  })


  useEffect(() => {
    if (error) {

      toast.error(`${error}`);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setSubsData(TOPICS[`dashboard/aire${id}`], data);
      toast.success('Datos cargados correctamente.');
    }
  }, [data]);

  const airData= useMqttStore((state) => state.subsData[TOPICS[`dashboard/aire${id}`]]);
  console.log(airData)
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al obtener datos</div>

  return (
    
    <div className='w-full h-full'>
        {
            airData && <AirConditioningCard data={airData}></AirConditioningCard>
        }
        
    </div>
  );
}
