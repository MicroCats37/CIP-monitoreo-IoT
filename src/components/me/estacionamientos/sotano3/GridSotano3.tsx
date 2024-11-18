'use client'
import React, { useEffect} from 'react'
import './GridSotano3.css'
import '@/components/me/estacionamientos/estacionamientos.css'
import CartState from '../CarState'

import { subscribeSotano, TOPICS, unsubscribeSotano} from '@/mqtt/topics/parkingSubscriptions'
import { useMqttStore } from '@/store/mqttStore'
import { convertHexToBinary, decodeBinaryToStates } from '@/utils/decodecEstacionamiento'
import { getData, getParkingData } from '@/utils/callsApi/apiCalls'
import { SotanosType } from '@/types'
import { useQuery } from '@tanstack/react-query'
export default function GridSotano3(){
  
  const id='3'
  const setSubsData = useMqttStore((state)=>state.setSubsData)
  const { data, error, isLoading } = useQuery<string[], Error>({ 
      queryKey: ['getParkingData', id], queryFn: () =>
      getParkingData(id),
      staleTime: Infinity, // Los datos permanecen frescos indefinidamente 
      refetchOnMount: false, // Los datos permanecen en caché indefinidamente 
      refetchOnWindowFocus: true,// No refetch al montar el componente refetchOnWindowFocus: false, });
    })
  useEffect(() => {
    if (data) {
      setSubsData(TOPICS[`sotano${id}`],data);
    }
  }, [isLoading]);
  useEffect(() => {
    subscribeSotano(id);
    return () => {
      unsubscribeSotano(id);
    };
  }, []);
  const parkingDataSotano = useMqttStore((state) => state.subsData[TOPICS[`sotano${id}`]]);
  if (isLoading) return <div>Cargando...</div>; 
  if (error) return <div>Error al obtener datos: {(error as Error).message}</div>
  return (
        <div className="gridestacionamiento3 gridestacionamiento">

        {
            parkingDataSotano?.slice(0, 93).map((block:string,index:number)=>(
                <div className={`car car${index+1}`} key={index}>
                    <CartState state={block}/>
                </div>   
            ))
        }
        
        {parkingDataSotano &&
          <>
          <div className="car d1">
            <CartState state={parkingDataSotano[0]}/>
        </div>
        
        <div className="car d2">
            <CartState state={parkingDataSotano[0]}/>
        </div>
                
        <div className="car d3">
            <CartState state={parkingDataSotano[0]}/>
        </div>
        </>

        }
        
                
            </div>
        )
}
