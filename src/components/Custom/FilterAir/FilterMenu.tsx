import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Filter, Power, Thermometer, ArrowUpDown } from 'lucide-react'


export type FilterStatus = 'all' | 'on' | 'off'

interface FilterMenuProps {
  filterStatus: FilterStatus
  setFilterStatus: (value: FilterStatus) => void
  minIndoorTemp: number
  setMinIndoorTemp: (value: number) => void
  minSettingTemp: number
  setMinSettingTemp: (value: number) => void
}

export function FilterMenu({
  filterStatus,
  setFilterStatus,
  minIndoorTemp,
  setMinIndoorTemp,
  minSettingTemp,
  setMinSettingTemp
}: FilterMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[180px]">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto block">
        <DropdownMenuLabel>Opciones de filtrado</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center mb-2">
            <Power className="mr-2 h-4 w-4 text-primary" />
            Estado
          </label>
          <RadioGroup 
            defaultValue="all" 
            value={filterStatus}
            onValueChange={(value) => setFilterStatus(value as FilterStatus)}
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
        <DropdownMenuSeparator />
        <div className="p-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center mb-2">
            <Thermometer className="mr-2 h-4 w-4 text-orange-500" />
            Temperatura interior mínima: {minIndoorTemp}°C
          </label>
          <Slider
            defaultValue={[minIndoorTemp]}
            max={40}
            step={1}
            onValueChange={(value) => setMinIndoorTemp(value[0])}
            className="mt-2"
          />
        </div>
        <DropdownMenuSeparator />
        <div className="p-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center mb-2">
            <Thermometer className="mr-2 h-4 w-4 text-blue-500" />
            Temperatura configurada mínima: {minSettingTemp}°C
          </label>
          <Slider
            defaultValue={[minSettingTemp]}
            max={40}
            step={1}
            onValueChange={(value) => setMinSettingTemp(value[0])}
            className="mt-2"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

