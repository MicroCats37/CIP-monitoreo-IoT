'use client'

import { useMqttStore } from '@/store/mqttStore';
import { BoardType } from '@/types';
import { getBoardData } from '@/utils/callsApi/apiCalls';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import { toast } from 'sonner';
import BoardCard from '../../Card/BoardCard/BoardCard';
import { useBoardSubscription } from '@/mqtt/topics/TablerosSubscriptions';

export default function BoardsContent() {

  useBoardSubscription();

  const setSubsData = useMqttStore((state) => state.setSubsData)
  const { data, error, isLoading } = useQuery<BoardType[], Error>({
    queryKey: ['getBoardData'], queryFn: () =>
      getBoardData(),
    staleTime: 0, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: true, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })

  useEffect(() => {
    if (error) {

      toast.success(`error al conectarse a la base de datos`);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setSubsData('dashboard/tableros', data);
      toast.success('Datos cargados correctamente.');
    }
  }, [data]);
  const BoardsData = useMqttStore((state) => state.subsData['dashboard/tableros']) as BoardType[];
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al obtener datos: {(error as Error).message}</div>
  return (
    <div className='w-full flex relative'>


      {BoardsData ?
        (<div className='w-full'>
          <BoardCard data={BoardsData}></BoardCard>
        </div>)
        : (<div>Error</div>)
      }

    </div>
  )
}
