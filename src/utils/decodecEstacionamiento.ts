export const convertHexToBinary = (hex: string): string => {
    return hex.split('').map(hexDigit => 
      parseInt(hexDigit, 16).toString(2).padStart(4, '0')
    ).join('');
};

  // Función para decodificar el mensaje binario a estados de bloques
// Función para decodificar el mensaje binario a estados de bloques
export const decodeBinaryToStates = (binary: string): string[] => {
  const statesArray: string[] = [];

  // Asegúrate de que la longitud del binario sea múltiplo de 2 (para pares de bits)
  if (binary.length % 2 !== 0) {
      throw new Error('El número de bits no es par');
  }

  // Itera cada par de bits
  for (let i = 0; i < binary.length; i += 2) {
      const pair = binary.substring(i, i + 2);

      switch (pair) {
          case '00':
              statesArray.push('libre');
              break;
          case '01':
              statesArray.push('reservado');
              break;
          case '10':
              statesArray.push('dañado');
              break;
          case '11':
              statesArray.push('ocupado');
              break;
          default:
              throw new Error(`Par binario desconocido: ${pair}`);
      }
  }

  return statesArray;
};