'use client'
import React, { useEffect } from 'react'
import './GridSotanos.css'

import CartState from './CarState'
import { TOPICS, useParkingSubscription } from '@/mqtt/topics/ParkingSubscriptions'
import { useMqttStore } from '@/store/mqttStore'
import { getParkingData } from '@/utils/callsApi/apiCalls'
import { ParkingType, SotanosStateDataType } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { SotanoImage } from './SotanoImage'
import { toast } from 'sonner'
import { contarEstados, type Estados } from '@/utils/decodecEstacionamiento'
import { ParkingCard } from '../../Card/ParkingCard/ParkingCard'
import CarNumber from './CarNumber'
import { useShallow } from 'zustand/react/shallow'
import { FormattedDate } from '../../Utils/FormattedDate'

export default function GridSotanos({ sotanoData }: { sotanoData: SotanosStateDataType }) {
  const id = sotanoData.id.toString()
  const quantity = sotanoData.quantity
  const order = sotanoData.order
  useParkingSubscription(`${id}a`);
  useParkingSubscription(`${id}b`)
  const setSubsData = useMqttStore((state) => state.setSubsData)

  const { data: data_a, error: error_a, isLoading: isLoading_a } = useQuery<ParkingType, Error>({
    queryKey: ['getParkingData', `${id}A`], queryFn: () =>
      getParkingData(`${id}A`),
    staleTime: Infinity, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: true, // Los datos permanecen en caché indefinidamente 
    refetchOnWindowFocus: true,// No refetch al montar el componente refetchOnWindowFocus: false, });
  })
  const { data: data_b, error: error_b, isLoading: isLoading_b } = useQuery<ParkingType, Error>({
    queryKey: ['getParkingData', `${id}B`], queryFn: () =>
      getParkingData(`${id}B`),
    staleTime: Infinity, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: true, // Los datos permanecen en caché indefinidamente 
    refetchOnWindowFocus: true,// No refetch al montar el componente refetchOnWindowFocus: false, });
  })

  useEffect(() => {
    if (error_a) {

      toast.error(`${error_a}`);
    }
  }, [error_a]);

  useEffect(() => {
    if (data_a) {
      setSubsData(TOPICS[`sotano${id}a`], data_a);
      toast.success('Datos cargados correctamente.');
    }
  }, [data_a]);


  useEffect(() => {
    if (error_b) {

      toast.error(`error al conectarse a la base de datos`);
    }
  }, [error_b]);

  useEffect(() => {
    if (data_b) {
      setSubsData(TOPICS[`sotano${id}b`], data_b);
      toast.success('Datos cargados correctamente.');
    }
  }, [data_b]);

  const parkingDataA: ParkingType = useMqttStore((state) => state.subsData[TOPICS[`sotano${id}a`]]);
  const parkingDataB: ParkingType = useMqttStore((state) => state.subsData[TOPICS[`sotano${id}b`]]);
  let EstadosArrayA: string[] = [];
  let EstadosArrayB: string[] = [];
  let SensorA: { [key: string]: string } = {};
  let SensorB: { [key: string]: string } = {}; // Definimos Sensor como un objeto con keys de tipo string (estacionamiento) y valores de tipo string

  if (!parkingDataA || !parkingDataB) return; // Salimos si no existen los datos

  // Llenamos los arreglos de estados con los datos de A
  parkingDataA.data.forEach(item => {
    SensorA[item.estacionamiento] = item.estado; // Asociamos cada estacionamiento con su estado
    EstadosArrayA.push(item.estado); // Agregamos el estado al arreglo correspondiente
  });

  // Llenamos los arreglos de estados con los datos de B
  parkingDataB.data.forEach(item => {
    SensorB[item.estacionamiento] = item.estado; // Asociamos cada estacionamiento con su estado
    EstadosArrayB.push(item.estado); // Agregamos el estado al arreglo correspondiente
  });

  // Contamos los estados de A
  const countStateCarsA = EstadosArrayA && EstadosArrayA.length > 0 ? contarEstados(EstadosArrayA) : [];

  // Contamos los estados de B
  const countStateCarsB = EstadosArrayB && EstadosArrayB.length > 0 ? contarEstados(EstadosArrayB) : [];

  if (isLoading_a || isLoading_b) return <div>Cargando...</div>;
  if (error_a || error_b) return <div>Error al obtener datos</div>

  return (
    <div className='w-full  h-full '>

      {(
        <div className='flex-col flex-wrap h-full justify-between items-center space-y-4 p-4 pb-8'>
          <div className='flex w-full h-[15%] gap-4'>

            {parkingDataA && parkingDataA.data.length > 0 && parkingDataA.time &&
              (<>

                <ParkingCard time={parkingDataA.time} sotano={`${id}A`} estados={countStateCarsA}></ParkingCard>
              </>

              )
            }

            {parkingDataB && parkingDataB.data.length > 0 && parkingDataB.time &&
              (<>

                <ParkingCard time={parkingDataB.time} sotano={`${id}B`} estados={countStateCarsB}></ParkingCard>
              </>

              )
            }
          </div>

          <div className='flex relative flex-shrink object-contain h-[85%]'>
            <SotanoImage id={id} />
            <div className={`gridsotano gridsotano${id} w-full`}>
              {
                order.slice(0, quantity).map((p, index: number) => {
                  return (
                    <div className={`car s${id}car${index + 1}`} key={index}>
                      <CarNumber parking={p.tag}>
                        {
                          // Verifica que esté usando correctamente el valor de `p.tag` para acceder a las claves
                          (SensorA[p.tag] || SensorB[p.tag]) ? (
                            <>
                              <div className='flex justify-center items-center absolute top-0 h-1/6 w-[90%] text-white text-sm m-1 border  border-white rounded-sm'>
                                  {p.tag.replace("E", "")}
                              </div>
                              <CartState state={SensorA[p.tag] || SensorB[p.tag]} />
                            </>

                          ) : (
                            null // Cuando no haya coincidencia
                          )
                        }
                      </CarNumber>
                    </div>
                  );
                })
              }

            </div>
          </div>
        </div>)}
    </div>
  );
}
