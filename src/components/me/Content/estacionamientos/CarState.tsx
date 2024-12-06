import Image from 'next/image';
import React from 'react';



interface EstadoImagenProps {
  state: string;
  orientation: boolean
}

export const CartState: React.FC<EstadoImagenProps> = ({ state,orientation }) => {
  let src = '';

  // Define la imagen según el state
  switch (state) {
    case 'libre':
      src = '/assets/cart-states/libre.webp';
      break;
    case 'reservado':
      src = '/assets/cart-states/reservado.png';
      break;
    case 'dañado':
      src = '/assets/cart-states/dañado.webp';
      break;
    case 'ocupado':
      src = '/assets/cart-states/ocupado.webp';
      break;
    default:
      src = '/assets/cart-states/dañado.png'; // Imagen por defecto en caso de un state inesperado
      break;
  }

  return (
    <Image
    src={src}
    alt={`Estado ${state}`}
    sizes="100vw"
    style={{
      width: '100%',
      height: 'auto',
    }}
    width={500}
    height={300}
    className={`${ state!=='ocupado' ? 'p-':''} ${orientation ===false && state==='ocupado' ? 'rotate-180 h-100%':''} ${state==='ocupado' ? 'p-1':''}`}
  />
        
  );
};

export default CartState;
