'use client'
import './GridSotanos.css'

import CartState from './CarState'
import { useMqttStore } from '@/mqtt/store/mqttStore'
import { ParkingType, SotanosStateDataType } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { SotanoImage } from './SotanoImage'
import { contarEstados } from '@/utils/decodecEstacionamiento'
import { ParkingCard } from '../../Card/ParkingCard/ParkingCard'
import CarNumber from './CarNumber'
import LedCartState from './LedCarState'
import { TableCars } from './TableCars'
import { EstadoEstacionamiento, TableItemCars } from './TableItemCars'
import { useResponseData } from '@/hooks/useResponseData'
import { useTopicsSubcriptions } from '@/mqtt/topics/useTopicsSubscriptions'
import { TOPICS } from '@/mqtt/topics/topics.data'
import { getSotanoAction } from '@/influxDB/actions/EstacionamientoAction'
import LoadingSpinner from '@/components/Custom/LoaderSpiner/LoadingSpinner'
import { ErrorCard } from '@/components/Custom/ErrorCard/ErrorCard'


export default function GridSotanos({ sotanoData }: { sotanoData: SotanosStateDataType }) {
  const id = sotanoData.id.toString()
  const quantity = sotanoData.quantity
  const order = sotanoData.order

  useTopicsSubcriptions(TOPICS[`estacionamiento sotano ${id}a`])
  useTopicsSubcriptions(TOPICS[`estacionamiento sotano ${id}b`])


  const { data: data_a, error: error_a, isLoading: isLoading_a } = useQuery<ParkingType, Error>({
    queryKey: ['getSotanoAction', `${id}a`], queryFn: () =>
      getSotanoAction(`${id}a`),
    staleTime: 30000, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })

  const { data: data_b, error: error_b, isLoading: isLoading_b } = useQuery<ParkingType, Error>({
    queryKey: ['getSotanoAction', `${id}b`], queryFn: () =>
      getSotanoAction(`${id}b`),
    staleTime: 30000, // Los datos permanecen frescos indefinidamente 
    refetchOnMount: false, // No refetch al montar el componente refetchOnWindowFocus: false, });
  })

  useResponseData(TOPICS[`estacionamiento sotano ${id}a`], error_a, data_a);
  useResponseData(TOPICS[`estacionamiento sotano ${id}b`], error_b, data_b);

  const parkingDataA= useMqttStore((state) => state.subsData[TOPICS[`estacionamiento sotano ${id}a`]]) as ParkingType;
  const parkingDataB = useMqttStore((state) => state.subsData[TOPICS[`estacionamiento sotano ${id}b`]]) as ParkingType;
  const EstadosArrayA: string[] = [];
  const EstadosArrayB: string[] = [];
  const SensorA: { [key: string]: string } = {};
  const SensorB: { [key: string]: string } = {};
  // Definimos Sensor como un objeto con keys de tipo string (estacionamiento) y valores de tipo string

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

  if (isLoading_a || isLoading_b) return <LoadingSpinner></LoadingSpinner>
  if (error_a || error_b) return <ErrorCard message={(error_a?.message || error_b?.message) || ''}></ErrorCard>


  return (
    <div className='w-full  h-full'>
      {(
        <div className='flex-col h-full w-full space-y-4 lg:pb-4'>
          <div className='flex flex-col w-full lg:h-[15%] gap-4 lg:flex-row'>

            {parkingDataA && parkingDataA.data.length > 0 && parkingDataA.time &&
              (<div className='flex-col space-y-4 lg:space-y-0 lg:flex-1 '>
                <ParkingCard time={parkingDataA.time} sotano={`${id}A`} estados={countStateCarsA}></ParkingCard>
                <TableCars nombre={`Sotano ${id}A`}>
                  {
                    order.slice(0, quantity).map((p, index: number) => {
                      if (SensorA[p.tag])
                        return (
                          <TableItemCars
                            id={p.tag.replace("E", "")}
                            estado={SensorA[p.tag] as EstadoEstacionamiento}
                            key={`mobile-${index}A`}
                          />

                        )
                    })
                  }
                </TableCars>
              </div>

              )
            }

            {parkingDataB && parkingDataB.data.length > 0 && parkingDataB.time &&
              (<div className='flex-col space-y-4 lg:space-y-0 lg:flex-1 pb-4 lg:pb-0'>
                <ParkingCard time={parkingDataB.time} sotano={`${id}B`} estados={countStateCarsB}></ParkingCard>
                <TableCars nombre={`Sotano ${id}B`}>
                  {
                    order.slice(0, quantity).map((p, index: number) => {
                      if (SensorB[p.tag])
                        return (
                          <TableItemCars
                            id={p.tag.replace("E", "")}
                            estado={SensorB[p.tag] as EstadoEstacionamiento}
                            key={`mobile-${index}B`}
                          />
                        )
                    })
                  }
                </TableCars>
              </div>

              )
            }
          </div>

          <div className='hidden relative h-[85%] lg:flex'>
            <SotanoImage id={id} />
            <div className={`gridsotano gridsotano${id} w-full`}>
              {
                order.slice(0, quantity).map((p, index: number) => {
                  return (
                    <div className={`car s${id}car${index + 1}`} key={`car-image-${index}`}>
                      <CarNumber parking={p.tag} className={`${p.orientation === true ? 'border-t-4 border-transparent' : 'border-b-4 border-transparent'}`}>
                        {
                          // Verifica que esté usando correctamente el valor de `p.tag` para acceder a las claves
                          (SensorA[p.tag] || SensorB[p.tag]) ? (
                            <>
                              <div className={`flex justify-center items-center absolute h-1/6 w-[90%] text-white text-lg m-1 border  border-white rounded-lg ${p.orientation === true ? 'top-0  ' : 'bottom-0'}`}>
                                {p.tag.replace("E", "")}
                              </div>
                              <LedCartState orientation={p.orientation} state={SensorA[p.tag] || SensorB[p.tag]} />
                              <CartState orientation={p.orientation} state={SensorA[p.tag] || SensorB[p.tag]} />
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
