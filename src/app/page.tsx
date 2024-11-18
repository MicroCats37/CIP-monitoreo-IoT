'use client'

import { useEffect, useState } from 'react';

import Image from 'next/image';

const EstacionamientoPage = () => {
  return (


    <div>


<Image
    src='/assets/cart-states/reservado.jpg'
    alt={`Estado `}
    sizes="100vw"
    width={500}
    height={300}
  />
    </div>
  );
};

export default EstacionamientoPage;
