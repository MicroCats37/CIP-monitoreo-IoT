import Image from "next/image";

export const SotanoImage = ({id}:{id:string}) => (
    <div className='flex w-full h-full absolute -z-10'>
  
  <Image
    src={`/assets/sotanos/sotano${id}.png`}
    alt="Estado"
    
    sizes="100vw"
    style={{
      width: '100%',
      height: 'auto',
    }}
    width={500}
    height={300}
    className="rounded-lg" // Clases de Tailwind para estilos opcionales
    priority={false}
  />
  </div>
)

