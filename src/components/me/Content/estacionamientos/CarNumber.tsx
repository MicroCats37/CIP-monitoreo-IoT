interface CarNumberProps {
  parking: string;
  children?: React.ReactNode; // Agregamos children opcional
}

export default function CarNumber({ parking, children }: CarNumberProps) {
  return (
    <div className="flex w-full h-full justify-center items-center relative">
      <div className="flex w-full aspect-square rounded-full border-2 border-x-neutral-50 font-bold text-white text-center justify-center items-center">
        {parking}
      </div>
      {children && (
        <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
}



