'use client'
import React, { useEffect } from 'react'
import './GridSotanos.css'
import '@/components/me/estacionamientos/estacionamientos.css'
import CartState from './CarState'
import { subscribeSotano, TOPICS, unsubscribeSotano } from '@/mqtt/topics/parkingSubscriptions'
import { useMqttStore } from '@/store/mqttStore'
import { getData, getParkingData } from '@/utils/callsApi/apiCalls'
import { SotanosDataType } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { SotanoImage } from './SotanoImage'
import { toast, Toaster } from 'sonner'
import { contarEstados, Estado } from '@/utils/decodecEstacionamiento'
import CountCard from '../CountCard/CountCard'


export default function GridSotanos({ sotanoData }: { sotanoData: SotanosDataType }) {
  const id = sotanoData.id.toString()
  const quantity = sotanoData.quantity
  useEffect(() => {
    subscribeSotano(id);
    return () => {
      unsubscribeSotano(id);
    };
  }, []);
  const setSubsData = useMqttStore((state) => state.setSubsData)
  const { data, error, isLoading } = useQuery<string[], Error>({
    queryKey: ['getParkingData', id], queryFn: () =>
      getParkingData(id),
    staleTime: Infinity, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: true, // Los datos permanecen en caché indefinidamente 
    refetchOnWindowFocus: true,// No refetch al montar el componente refetchOnWindowFocus: false, });
  })

  useEffect(() => {
    if (error) {

      toast.error(`error al conectarse a la base de datos`);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setSubsData(TOPICS[`sotano${id}`], data);
      toast.success('Datos cargados correctamente.');
    }
  }, [data]);


  const parkingDataSotano = useMqttStore((state) => state.subsData[TOPICS[`sotano${id}`]]);


  const countStateCar = parkingDataSotano ? contarEstados(parkingDataSotano) : [];

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al obtener datos: {(error as Error).message}</div>

  return (
    <div className='flex-col w-full flex-shrink h-full'>
 
      {countStateCar.length > 0 && countStateCar && (
        <div className='h-screen'>
      <CountCard className='flex w-full gap-4 flex-shrink h-[15%]' data={countStateCar}></CountCard>
      <div className='flex relative flex-shrink object-contain h-[85%]'>
        <SotanoImage id={id} />
        {parkingDataSotano ?
          (
            <div className={`gridsotano gridsotano${id} `}>
              {
                parkingDataSotano?.slice(0, quantity).map((block: string, index: number) => (
                  <div className={`car s${id}car${index + 1}`} key={index}>
                    <CartState state={block} />
                  </div>
                ))
              }
            </div>

          ) : (<div>Error</div>)
        }
      </div>
      </div>)}
    </div>
  );
}
