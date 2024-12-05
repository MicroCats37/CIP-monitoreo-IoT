'use client'

import { useMqttStore } from '@/store/mqttStore';
import { SCIType } from '@/types';
import { getSCIData } from '@/utils/callsApi/apiCalls';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { toast } from 'sonner';
import SCICard from '../../Card/SCICard/SCICard';
import { useSCISubscription } from '@/mqtt/topics/SCISubscriptions';

export default function SCIContent() {

      useSCISubscription();
    
      const setSubsData = useMqttStore((state) => state.setSubsData)
      const { data, error, isLoading } = useQuery<SCIType, Error>({
        queryKey: ['getSCIData'], queryFn: () =>
            getSCIData(),
        staleTime: Infinity, // Los datos permanecen frescos indefinidamente 
        refetchOnMount: true, // Los datos permanecen en caché indefinidamente 
        refetchOnWindowFocus: true,// No refetch al montar el componente refetchOnWindowFocus: false, });
      })
    
      useEffect(() => {
        if (error) {
    
          toast.success(`error al conectarse a la base de datos`);
        }
      }, [error]);
    
      useEffect(() => {
        if (data) {
          setSubsData('dashboard/sci', data);
          toast.success('Datos cargados correctamente.');
        }
      }, [data]);
      const SCIData = useMqttStore((state) => state.subsData['dashboard/sci']);
      console.log(data)
      if (isLoading) return <div>Cargando...</div>;
      if (error) return <div>Error al obtener datos: {(error as Error).message}</div>
  return (
    <div className='w-full flex relative'>
       

        {SCIData?
            (<div className='w-full'>
                <SCICard data={SCIData}></SCICard>
            </div>)
            :(<div>Error</div>)
        }
        
    </div>
  )
}
