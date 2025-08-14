import React from 'react'
import { Car, CheckCircle, Clock, AlertTriangle, ParkingMeter } from 'lucide-react'
import { TableCell, TableRow } from "@/components/ui/table"

export type EstadoEstacionamiento = 'ocupado' | 'libre' | 'dañado' | 'reservado'

interface TableItemCarsProps {
  id: string;
  estado: EstadoEstacionamiento;
}

const obtenerIconoEstado = (estado: EstadoEstacionamiento) => {
  switch (estado) {
    case 'ocupado':
      return <Car className="h-5 w-5 text-blue-500" />
    case 'libre':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'dañado':
      return <AlertTriangle className="h-5 w-5 text-red-500" />
    case 'reservado':
      return <Clock className="h-5 w-5 text-yellow-500" />
  }
}

const obtenerColorEstado = (estado: EstadoEstacionamiento) => {
  switch (estado) {
    case 'ocupado':
      return "bg-blue-100 text-blue-700 dark:bg-blue-700/20 dark:text-blue-300"
    case 'libre':
      return "bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-300"
    case 'dañado':
      return "bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-300"
    case 'reservado':
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-700/20 dark:text-yellow-300"
  }
}

const obtenerTextoEstado = (estado: EstadoEstacionamiento) => {
  switch (estado) {
    case 'ocupado':
      return 'Ocupado'
    case 'libre':
      return 'Libre'
    case 'dañado':
      return 'Dañado'
    case 'reservado':
      return 'Reservado'
  }
}

export const TableItemCars: React.FC<TableItemCarsProps> = ({ id, estado }) => (
  <TableRow className='w-full'>
    <TableCell className="font-medium text-center">{id}</TableCell>
    <TableCell>
      <div className="flex items-center space-x-2">
        <ParkingMeter className="h-5 w-5 text-gray-500" />
        {obtenerIconoEstado(estado)}
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${obtenerColorEstado(estado)}`}>
          {obtenerTextoEstado(estado)}
        </span>
      </div>
    </TableCell>
  </TableRow>
)

