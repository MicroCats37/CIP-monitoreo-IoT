'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Filter, Power, Thermometer, ArrowUpDown } from 'lucide-react'

export type FilterStatus = 'all' | 'on' | 'off'

interface FilterDialogProps {
  filterStatus: FilterStatus
  setFilterStatus: (value: FilterStatus) => void
  minIndoorTemp: number
  setMinIndoorTemp: (value: number) => void
  minSettingTemp: number
  setMinSettingTemp: (value: number) => void
}

export function FilterDialog({
  filterStatus,
  setFilterStatus,
  minIndoorTemp,
  setMinIndoorTemp,
  minSettingTemp,
  setMinSettingTemp
}: FilterDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilterStatus, setLocalFilterStatus] = useState<FilterStatus>(filterStatus)
  const [localMinIndoorTemp, setLocalMinIndoorTemp] = useState(minIndoorTemp)
  const [localMinSettingTemp, setLocalMinSettingTemp] = useState(minSettingTemp)

  useEffect(() => {
    setLocalFilterStatus(filterStatus)
    setLocalMinIndoorTemp(minIndoorTemp)
    setLocalMinSettingTemp(minSettingTemp)
  }, [filterStatus, minIndoorTemp, minSettingTemp])

  const handleApplyFilters = () => {
    setFilterStatus(localFilterStatus)
    setMinIndoorTemp(localMinIndoorTemp)
    setMinSettingTemp(localMinSettingTemp)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className='lg:ml-auto'>
        <Button variant="outline" className="w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] flex-col lg:w-auto">
        <DialogHeader>
          <DialogTitle>Opciones de filtrado</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4  lg:max-w-4xl lg:mx-auto">
          <div className="space-y-2">
            <h4 className="font-medium leading-none flex items-center">
              <Power className="mr-2 h-4 w-4 text-primary" />
              Estado
            </h4>
            <RadioGroup 
              value={localFilterStatus}
              onValueChange={(value) => setLocalFilterStatus(value as FilterStatus)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="flex items-center">
                  <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
                  Todos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="on" id="on" />
                <Label htmlFor="on" className="flex items-center">
                  <Power className="mr-2 h-4 w-4 text-green-500" />
                  Encendidos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="off" id="off" />
                <Label htmlFor="off" className="flex items-center">
                  <Power className="mr-2 h-4 w-4 text-red-500" />
                  Apagados
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium leading-none flex items-center">
              <Thermometer className="mr-2 h-4 w-4 text-orange-500" />
              Temperatura interior mínima: {localMinIndoorTemp}°C
            </h4>
            <Slider
              value={[localMinIndoorTemp]}
              max={40}
              step={1}
              onValueChange={(value) => setLocalMinIndoorTemp(value[0])}
            />
          </div>
          <div className="space-y-2">
            <h4 className="font-medium leading-none flex items-center">
              <Thermometer className="mr-2 h-4 w-4 text-blue-500" />
              Temperatura configurada mínima: {localMinSettingTemp}°C
            </h4>
            <Slider
              value={[localMinSettingTemp]}
              max={40}
              step={1}
              onValueChange={(value) => setLocalMinSettingTemp(value[0])}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleApplyFilters}>Aplicar filtros</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

