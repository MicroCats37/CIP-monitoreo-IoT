import './GridSotanos.css'

import { sotanosData } from "./GridSotanos.data"
interface Props {
    idSotano: string // Assuming idSotano is a string that corresponds to
}

const SotanoImageCSS: React.FC<Props> = ({ idSotano }) => {
    const estacionamientoData = sotanosData[idSotano]
    const id = estacionamientoData.id
    const quantity = estacionamientoData.quantity
    const order = estacionamientoData.order
    return (
        <div className='flex-col w-full h-full relative rounded-lg border-2'>
            
                <div className='flex-col w-full h-full absolute'>
                    <div className='flex h-full'>

                        <div className={`gridsotano imagegridsotano${id} w-full`}>
                            {
                                order.slice(0, quantity).map((p, index: number) => {
                                    return (
                                        <div className={`car s${id}car${index + 1} p-[1px]  w-full h-full`} key={`car-space-${index}`}>
                                            <div className={`car s${id}car${index + 1} w-full h-full`} >
                                                <div className={`flex justify-center items-center w-[90%] aspect-square text-white text-lg  rounded-full`}>
                                                    
                                                </div>
                                            </div>
                                        </div>


                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            
            
                <div className='flex-col  w-full h-full'>
                    <div className='flex h-full rounded-lg '>

                        <div className={`imagegridsotano w-full rounded-lg `}>
                            <div className='fondo1 cemento-industrial flex w-full '></div>
                            <div className='fondo2 cemento-industrial flex w-full '></div>
                            <div className='fondo3 cemento-industrial flex w-full '></div>
                            <div className='fondo4 cemento-industrial flex w-full '></div>
                            <div className='pista1 pista flex w-full pista-gradiente'>
                            </div>
                            <div className='pista2 pista flex w-full pista-gradiente'>

                            </div>

                        </div>
                    </div>
                </div>
            
        </div>

    )
}

export default SotanoImageCSS;