"use client"

import type * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type QueryTimeType = "30m" | "1h" | "8h" | "1d" | "7d" | "30d" | "60d" | "90d"

const intervalos: QueryTimeType[] = ["30m", "1h", "8h", "1d", "7d", "30d", "60d", "90d"]

type TimeDictionary = {
  [key: string]: string
}

const timeDictionary: TimeDictionary = {
  "30m": "30 minutos",
  "1h": "1 hora",
  "8h": "8 horas",
  "1d": "1 día",
  "7d": "7 días",
  "30d": "30 días",
  "60d": "60 días",
  "90d": "90 días",
}

// Nuevo tipo para el objeto de tiempo
interface TimeRange {
  start: string
  stop: string
}

interface FetchingDateProps {
  timeRange: TimeRange
  setTimeRange: React.Dispatch<React.SetStateAction<TimeRange>>
  currentInterval: QueryTimeType // Para mostrar el intervalo actual seleccionado
  setCurrentInterval: React.Dispatch<React.SetStateAction<QueryTimeType>>
}

// Función para calcular el nuevo start basándose en el intervalo
const calculateStartTime = (stop: string, interval: QueryTimeType): string => {
  const stopDate = new Date(stop)
  const now = stopDate.getTime()

  let millisToSubtract = 0

  switch (interval) {
    case "30m":
      millisToSubtract = 30 * 60 * 1000 // 30 minutos
      break
    case "1h":
      millisToSubtract = 60 * 60 * 1000 // 1 hora
      break
    case "8h":
      millisToSubtract = 8 * 60 * 60 * 1000 // 8 horas
      break
    case "1d":
      millisToSubtract = 24 * 60 * 60 * 1000 // 1 día
      break
    case "7d":
      millisToSubtract = 7 * 24 * 60 * 60 * 1000 // 7 días
      break
    case "30d":
      millisToSubtract = 30 * 24 * 60 * 60 * 1000 // 30 días
      break
    case "60d":
      millisToSubtract = 60 * 24 * 60 * 60 * 1000 // 60 días
      break
    case "90d":
      millisToSubtract = 90 * 24 * 60 * 60 * 1000 // 90 días
      break
    default:
      millisToSubtract = 60 * 60 * 1000 // Default 1 hora
  }

  const startTime = new Date(now - millisToSubtract)
  return startTime.toISOString()
}

export function ButtonFechingDate({ timeRange, setTimeRange, currentInterval, setCurrentInterval }: FetchingDateProps) {
  const handleIntervalChange = (newInterval: string) => {
    const interval = newInterval as QueryTimeType
    setCurrentInterval(interval)

    // Calcular el nuevo start basándose en el stop actual y el nuevo intervalo
    const newStart = calculateStartTime(timeRange.stop, interval)

    setTimeRange({
      start: newStart,
      stop: timeRange.stop,
    })
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{timeDictionary[currentInterval]}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex-col w-56 mr-4">
          <DropdownMenuLabel>Selector de Tiempo</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={currentInterval} onValueChange={handleIntervalChange}>
            {intervalos.map((intervalo: QueryTimeType, index) => (
              <DropdownMenuRadioItem key={intervalo + index} value={intervalo}>
                {timeDictionary[intervalo]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
