'use client'
import PumpCard from "@/components/me/Card/PumpCard/PumpCard";
import { TOPICS, useWaterPumpSubscription } from "@/mqtt/topics/BombasSubscriptions";
import { useMqttStore } from "@/store/mqttStore";
import { VariatorsType, WaterPumpType } from "@/types";
import { getVariatorData, getWaterPumpData } from "@/utils/callsApi/apiCalls";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import VariatorCard from "../../Card/VariatorCard/VariatorCard";
import { TOPICS as TOPICSV, useVariatorsSubscription } from "@/mqtt/topics/VariadoresSubscriptions";

export default function WaterPumpContent({ id }: { id: string }) {
  const sentId = id.replaceAll('-', '')
  useWaterPumpSubscription('bomba' + sentId);
  useVariatorsSubscription('variador' + sentId)
  const setSubsData = useMqttStore((state) => state.setSubsData)

  const { data, error, isLoading } = useQuery<WaterPumpType[], Error>({
    queryKey: ['getWaterPumpData', id], queryFn: () =>
      getWaterPumpData(id),
    staleTime: 0, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: true, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })

  const { data: datav, error: errorv, isLoading: isLoadingv } = useQuery<VariatorsType[], Error>({
    queryKey: ['getVariatorData', id], queryFn: () =>
      getVariatorData(id),
    staleTime: 0, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: true, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })

  useEffect(() => {
    if (error) {
      toast.success(`error al conectarse a la base de datos`);
    }
  }, [error]);

  useEffect(() => {
    if (errorv) {

      toast.success(`error al conectarse a la base de datos`);
    }
  }, [errorv]);

  useEffect(() => {
    if (data) {
      setSubsData(TOPICS[`bomba${sentId}`], data);
      toast.success('Datos cargados correctamente.');
    }
  }, [data]);

  useEffect(() => {
    if (datav) {
      setSubsData(TOPICSV[`variador${sentId}`], datav);
      toast.success('Datos cargados correctamente.');
    }
  }, [datav]);

  const WaterPumpData = useMqttStore((state) => state.subsData[TOPICS[`bomba${sentId}`]]) as WaterPumpType[];
  const VariatorData = useMqttStore((state) => state.subsData[TOPICSV[`variador${sentId}`]])  as VariatorsType[];

  if (isLoading || isLoadingv) return <div>Cargando...</div>;
  if (error || errorv) return <div>Error al obtener datos: </div>
  return (
    <div className='w-full h-full flex items-center justify-center'>
      {WaterPumpData && VariatorData ?
        (<div className='w-full flex-col space-y-4 items-center justify-center'>
          <PumpCard data={WaterPumpData }></PumpCard>
          <VariatorCard data={VariatorData}></VariatorCard>
        </div>) : (<div>Error</div>)
      }
    </div>
  )
}
