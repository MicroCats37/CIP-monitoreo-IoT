'use client'

import './Components/GridSotanos.css'
import { EstacionamientoType } from '@/validators/devices/schemas'
import { sotanosData } from './Components/GridSotanos.data'
import { TotalCarCard } from './Components/TotalCarCard'
import { contarEstados } from '@/utils/decodecEstacionamiento'
import { TableCars } from './Components/TableCars'
import { EstadoEstacionamiento, TableItemCars } from './Components/TableItemCars'
import { SotanoImage } from './Components/SotanoImage'
import CarNumber from './Components/CarNumber'
import LedCartState from './Components/LedCarState'
import CartState from './Components/CarState'

export interface SotanosStateDataType {
    id: string
    quantity: number
    order: {
        position: number,
        tag: string
        orientation: boolean
    }[]
}

interface Props {
    dataMQTT: EstacionamientoType;
}


export default function EstacionamientosCard({ dataMQTT }: Props) {
    const data=dataMQTT
    const estacionamientoData = sotanosData[data.device.name]
    const id = estacionamientoData.id
    const quantity = estacionamientoData.quantity
    const order = estacionamientoData.order
    const SotanoDataA = data.details.filter(parking => parking.data.sensor.name.includes("A"));
    const SotanoDataB = data.details.filter(parking => parking.data.sensor.name.includes("B"));
    const EstacionamientosDataA = SotanoDataA.length > 0
        ? SotanoDataA[0].data.fields
        : {};

    const EstacionamientosDataB = SotanoDataB.length > 0
        ? SotanoDataB[0].data.fields
        : {};
    let EstadosArrayA: string[] = []
    let EstadosArrayB: string[] = []
    EstadosArrayA = Object.values(EstacionamientosDataA);
    EstadosArrayB = Object.values(EstacionamientosDataB);
    const countStateCarsA = EstadosArrayA && EstadosArrayA.length > 0 ? contarEstados(EstadosArrayA) : [];
    const countStateCarsB = EstadosArrayB && EstadosArrayB.length > 0 ? contarEstados(EstadosArrayB) : [];
    
    return (
        <div className='flex-col flex-1 w-full h-full'>
            {
                (
                    <div className='flex-col flex-1 w-full h-full space-y-4 lg:pb-4'>
                        <div className='flex flex-col w-full h-[15%] gap-4 lg:flex-row'>

                            {SotanoDataA && SotanoDataA.length > 0 &&
                                (<div className='flex-col space-y-4 lg:space-y-0 lg:flex-1 '>
                                    <TotalCarCard time={SotanoDataA[0].time} sotano={SotanoDataA[0].data.sensor.name} estados={countStateCarsA}></TotalCarCard>
                                    <TableCars nombre={SotanoDataA[0].data.sensor.name}>
                                        {
                                            order.slice(0, quantity).map((p, index: number) => {
                                                if (EstacionamientosDataA[p.tag])
                                                    return (
                                                        <TableItemCars
                                                            id={p.tag.replace("E", "")}
                                                            estado={EstacionamientosDataA[p.tag] as EstadoEstacionamiento}
                                                            key={`mobile-${index}A`}
                                                        />

                                                    )
                                            })
                                        }
                                    </TableCars>
                                </div>

                                )
                            }

                            {SotanoDataB && SotanoDataB.length > 0 &&
                                (<div className='flex-col space-y-4 lg:space-y-0 lg:flex-1'>
                                    <TotalCarCard time={SotanoDataB[0].time} sotano={SotanoDataB[0].data.sensor.name} estados={countStateCarsB}></TotalCarCard>
                                    <TableCars nombre={SotanoDataA[0].data.sensor.name}>
                                        {
                                            order.slice(0, quantity).map((p, index: number) => {
                                                if (EstacionamientosDataB[p.tag])
                                                    return (
                                                        <TableItemCars
                                                            id={p.tag.replace("E", "")}
                                                            estado={EstacionamientosDataB[p.tag] as EstadoEstacionamiento}
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

                        <div className='hidden relative  lg:h-[85%] lg:flex'>
                            <SotanoImage id={id} />
                            <div className={`gridsotano gridsotano${id} w-full`}>
                                {
                                    order.slice(0, quantity).map((p, index: number) => {
                                        return (
                                            <div className={`car s${id}car${index + 1}`} key={`car-image-${index}`}>
                                                <CarNumber parking={p.tag} className={`${p.orientation === true ? 'border-t-4 border-transparent' : 'border-b-4 border-transparent'}`}>
                                                    {
                                                        // Verifica que esté usando correctamente el valor de `p.tag` para acceder a las claves
                                                        (EstacionamientosDataA[p.tag] || EstacionamientosDataB[p.tag]) ? (
                                                            <>
                                                                <div className={`flex justify-center items-center absolute h-1/6 w-[90%] text-white text-lg m-1 border  border-white rounded-lg ${p.orientation === true ? 'top-0  ' : 'bottom-0'}`}>
                                                                    {p.tag.replace("E", "")}
                                                                </div>
                                                                <LedCartState orientation={p.orientation} state={EstacionamientosDataA[p.tag] || EstacionamientosDataB[p.tag]} />
                                                                <CartState orientation={p.orientation} state={EstacionamientosDataA[p.tag] || EstacionamientosDataB[p.tag]} />
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
                    </div>)
            }
        </div>
    );
}
/*
(
                <div className='flex-col h-full w-full space-y-4 lg:pb-4'>
                    <div className='flex flex-col w-full lg:h-[15%] gap-4 lg:flex-row'>

                        {parkingDataA && parkingDataA.data.length > 0 &&
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

                        {parkingDataB && parkingDataB.data.length > 0 &&
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
                </div>)
*/