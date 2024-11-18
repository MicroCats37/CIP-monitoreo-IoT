'use client'
import React, { useEffect} from 'react'
import './GridSotanos.css'
import '@/components/me/estacionamientos/estacionamientos.css'
import CartState from './CarState'
import { subscribeSotano, TOPICS, unsubscribeSotano } from '@/mqtt/topics/parkingSubscriptions'
import { useMqttStore } from '@/store/mqttStore'
import { getData, getParkingData } from '@/utils/callsApi/apiCalls'
import {  SotanosDataType } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { SotanoImage } from './SotanoImage'
import { toast, Toaster } from 'sonner'


export default function GridSotanos({sotanoData}:{sotanoData:SotanosDataType}){
  const id=sotanoData.id.toString()
  const quantity=sotanoData.quantity
  useEffect(() => {
    subscribeSotano(id);
    return () => {
      unsubscribeSotano(id);
    };
  }, []);
  const setSubsData = useMqttStore((state)=>state.setSubsData)
  const { data, error, isLoading } = useQuery<string[], Error>({ 
      queryKey: ['getParkingData', id], queryFn: () =>
      getParkingData(id),
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

  
  const parkingDataSotano = useMqttStore((state) => state.subsData[TOPICS[`sotano${id}`]]);
  if (isLoading) return <div>Cargando...</div>; 
  if (error) return <div>Error al obtener datos: {(error as Error).message}</div>
  
  return (
    <div className='flex relative'>
        <Toaster position="top-right" />
        <SotanoImage id={id}/>
        {parkingDataSotano?
            (<div className={`gridsotano gridsotano${id}`}>
                
                {
                parkingDataSotano?.slice(0, quantity).map((block:string,index:number)=>(
                        <div className={`car s${id}car${index+1}`} key={index}>
                        <CartState state={block}/>
                        </div>   
                ))
                }        
            </div>):(<div>Error</div>)
        }
        
    </div>
        );
}


/*
{
                  parkingDataSotano && (
                  <>
                    <div className="car d1">
                    <CartState state={parkingDataSotano[0]}/>
                    </div>
                    
                    <div className="car d2">
                    <CartState state={parkingDataSotano[0]}/>
                    </div>
                  </>
                  )
                }
*/