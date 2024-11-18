'use client'

import { useEffect, useState } from 'react';

const EstacionamientoPage = () => {
  const [blocks, setBlocks] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('asda')
  }, []);

  return (
    <div>
      {error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : (
        <div>
          <div className="grid grid-cols-10 gap-4 mt-4">
            <h2>Estados de los Bloques:</h2>
            <p>{blocks.length}</p>
            {blocks.map((state, index) => (
              <div
                key={index}
                className={`p-4 rounded border ${
                  state === 'vacio' ? 'bg-gray-800' : 
                  state === 'reservado' ? 'bg-yellow-600' : 
                  state === 'dañado' ? 'bg-red-600' : 
                  'bg-blue-600'
                } text-white`}
              >
                Bloque {index + 1}: {state}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EstacionamientoPage;
//sotano 1= 49
//sotano 2 = 100 
//sotano 3 = 94
//sotano 4 = 84