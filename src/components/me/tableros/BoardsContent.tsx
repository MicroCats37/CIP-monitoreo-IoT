'use client'
import { subscribeBoards, unsubscribeBoards } from '@/mqtt/topics/TablerosSubscriptions';
import { useMqttStore } from '@/store/mqttStore';
import { BoardType } from '@/types';
import { getBoardData } from '@/utils/callsApi/apiCalls';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { toast, Toaster } from 'sonner';

export default function BoardsContent() {

    useEffect(() => {
        subscribeBoards();
        return () => {
          unsubscribeBoards();
        };
      }, []);
    
      const setSubsData = useMqttStore((state) => state.setSubsData)
      const { data, error, isLoading } = useQuery<BoardType[], Error>({
        queryKey: ['getBoardData'], queryFn: () =>
          getBoardData(),
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
          setSubsData('tableros', data);
          toast.success('Datos cargados correctamente.');
        }
      }, [data]);
      const BoardsData = useMqttStore((state) => state.subsData['tableros']);
      console.log(BoardsData)
      if (isLoading) return <div>Cargando...</div>;
      if (error) return <div>Error al obtener datos: {(error as Error).message}</div>
  return (
    <div className='flex relative'>
        <Toaster position="top-right" />

        {BoardsData?
            (<div >
                
                {
                BoardsData.map((pump:BoardType,index:number)=>(
                        <div className="" key={index}>
                          {pump.potencia}:{pump.value}
                        </div>   
                ))
                }        
            </div>):(<div>Error</div>)
        }
        
    </div>
  )
}
