'use client'
import { subscribeWaterPump, TOPICS, unsubscribeWaterPump } from "@/mqtt/topics/BombasSubscriptions";
import { useMqttStore } from "@/store/mqttStore";
import { WaterPumpType } from "@/types";
import {  getWaterPumpData } from "@/utils/callsApi/apiCalls";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast, Toaster } from "sonner";

export default function WaterPumpContent({ id }: { id: string }) {
  const sentId=id.replaceAll('-', '')
  useEffect(() => {
    subscribeWaterPump(sentId);
    return () => {
      unsubscribeWaterPump(sentId);
    };
  }, []);

  const setSubsData = useMqttStore((state) => state.setSubsData)
  const { data, error, isLoading } = useQuery<WaterPumpType[], Error>({
    queryKey: ['getWaterPumpData', id], queryFn: () =>
      getWaterPumpData(id),
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
      setSubsData(TOPICS[`${sentId}`], data);
      toast.success('Datos cargados correctamente.');
    }
  }, [data]);
  const WaterPumpData= useMqttStore((state) => state.subsData[TOPICS[`${sentId}`]]);
  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al obtener datos: {(error as Error).message}</div>
  return (
    <div className='flex relative'>
        <Toaster position="top-right" />

        {WaterPumpData?
            (<div >
                
                {
                WaterPumpData.map((pump:WaterPumpType,index:number)=>(
                        <div className="" key={index}>
                          {pump.bomba}:{pump.estado? ("activado"):("desactivado")}
                        </div>   
                ))
                }        
            </div>):(<div>Error</div>)
        }
        
    </div>
  )
}
