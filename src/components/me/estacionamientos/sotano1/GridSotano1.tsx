'use client'
import React, { useEffect, useState } from 'react'
import './GridSotano1.css'
import '@/components/me/estacionamientos/estacionamientos.css'
import CartState from '../CarState'
import { useMqttStore } from '@/store/mqttStore'
import { subscribeSotano, TOPICS, unsubscribeSotano } from '@/mqtt/topics/parkingSubscriptions'
import { useQuery } from '@tanstack/react-query'
import { getParkingData } from '@/utils/callsApi/apiCalls'
import { Toaster, toast } from 'sonner'
export default function GridSotano1() {
  const id='1'
  const setSubsData = useMqttStore((state)=>state.setSubsData)
  const { data, error, isLoading } = useQuery<string[], Error>({ 
      queryKey: ['getParkingData', id], queryFn: () =>
      getParkingData(id),
      retry: 1, // Evita que vuelva a intentar en caso de error
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
      setSubsData(TOPICS[`sotano${id}`],data);
      toast.success('Datos cargados correctamente.');
    }
  }, [data]);

  useEffect(() => {
    subscribeSotano(id);
    return () => {
      unsubscribeSotano(id);
    };
  }, []);
  const parkingDataSotano = useMqttStore((state) => state.subsData[TOPICS[`sotano${id}`]]);
  return (
    <div className='flex-col'>
      <Toaster position="top-right" />
      { parkingDataSotano?  
        (<div className="gridestacionamiento1 gridestacionamiento">            
        {
          parkingDataSotano?.slice(0, 49).map((block: string, index: number) => (
            <div className={`car car${index + 1}`} key={index}>
              <CartState state={block} />
            </div>
          ))
        }
        {
          parkingDataSotano && (
            <>
              <div className="car d1">
                <CartState state={parkingDataSotano[0]} />
              </div>
  
              <div className="car d2">
                <CartState state={parkingDataSotano[0]} />
              </div>
            </>
          )
        }
        </div>
        ):(
          <div>Cargando</div>
        )
      }
    </div>
    
  );
}

/*
<div className='flex gap-1 w-full flex-wrap'>
      <ToastContainer/>
        {parkingDataSotano?.map((e,index)=>(
          <div key={index}>
            parking{index+1}:{e}
          </div>
        ))}
      </div>
*/