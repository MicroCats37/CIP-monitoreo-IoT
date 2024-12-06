interface EstadoLedProps {
    state: string;
    orientation: boolean
}

export const LedCartState: React.FC<EstadoLedProps> = ({ state, orientation }) => {
    let color = '';

    // Define la imagen según el state
    switch (state) {
        case 'libre':
            color = 'bg-green-400';
            break;
        

        case 'ocupado':
            color = 'bg-red-600';
            break;
            /*
        case 'dañado':
            color = 'bg-amber-600';
            break;
        case 'reservado':
            color = 'bg-cyan-700';
            break;
            */
        default:
            color = ''; // Imagen por defecto en caso de un state inesperado
            break;
    }

    return (
        <div className={`z-100 flex justify-center items-center absolute w-[15%] aspect-square rounded-sm m-2 ${color}  ${orientation === false ? 'top-0' : 'bottom-0'}`}>

        </div>

    );
};

export default LedCartState;
