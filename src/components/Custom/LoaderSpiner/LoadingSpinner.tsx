interface LoaderProps {
  message?: string
}

export default function LoadingSpinner({ message = "Cargando..." }: LoaderProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 w-full">
      <div className="relative h-20 w-20">
        {/* Anillo exterior */}
        <div className="absolute inset-0 animate-[spin_3s_ease-in-out_infinite] rounded-full border-[4px] border-transparent border-t-red-600 border-r-yellow-500 shadow-lg" />

        {/* Anillo interior */}
        <div className="absolute inset-2 animate-[spin_2s_ease-in-out_infinite] rounded-full border-[4px] border-transparent border-t-yellow-500 border-r-red-600 shadow-md" />

        {/* Efecto de brillo */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-red-600/10 to-yellow-500/10 blur-sm" />
      </div>

      {/* Texto animado */}
      <div className="flex flex-col items-center gap-1">
        <p className="animate-pulse text-lg font-medium text-gray-700">{message}</p>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-red-600"
              style={{
                animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  )
}
