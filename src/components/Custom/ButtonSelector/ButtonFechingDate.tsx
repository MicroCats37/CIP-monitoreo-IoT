"use client"

import * as React from "react"

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

export type QueryTimeType = "30m" | "1h" | "8h" | "1d" | "7d" | "30d";
const intervalos: QueryTimeType[] = ["30m", "1h", "8h", "1d", "7d","30d"];
type TimeDictionary = {
  [key: string]: string;
};
const timeDictionary: TimeDictionary = {
  "30m": "30 minutos",
  "1h": "1 hora",
  "8h": "8 horas",
  "1d": "1 día",
  "7d": "7 días",
  "30":"30 dias"
};

interface FetchingDateProps {// Tipado del array de intervalos
  intervalo:string
  setIntervalo: React.Dispatch<React.SetStateAction<string>>; // setIntervalo directamente
}
export function ButtonFechingDate({setIntervalo,intervalo}:FetchingDateProps) {
  

  return (
    <div className="flex justify-end">
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{timeDictionary[intervalo]}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex-col w-56 mr-4">
        <DropdownMenuLabel>Selector de Tiempo</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={intervalo} onValueChange={setIntervalo}>
          {
            intervalos.map((intervalo:QueryTimeType,index)=>(
              <DropdownMenuRadioItem key={intervalo+index} value={intervalo}>{intervalo}</DropdownMenuRadioItem>
            ))
          }
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
    
  )
}
