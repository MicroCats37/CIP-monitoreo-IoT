interface CarNumberProps {
  className?:string,
  parking: string;
  children?: React.ReactNode; // Agregamos children opcional
}

export default function CarNumber({ parking, children,className}: CarNumberProps) {
  return (
    <div className={`flex w-full h-full justify-center items-center relative ${className}`}>
      <div className={`flex w-full aspect-square rounded-full border-2 m-1 border-x-neutral-50 text-sm text-white text-center justify-center items-center `}>
        {parking.replace("E", "")}
      </div>
      {children && (
        <div className={`absolute  flex justify-center items-center w-full h-full  `} >
          {children}
        </div>
      )}
    </div>
  );
}



