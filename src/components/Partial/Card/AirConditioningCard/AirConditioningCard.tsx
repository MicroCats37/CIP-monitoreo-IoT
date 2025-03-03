"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import type { AirConditioningType } from "@/types"
import { Search, Power } from "lucide-react"
import type { FilterStatus } from "@/components/Custom/FilterAir/FilterMenu"
import { FilterDialog } from "@/components/Custom/FilterAir/FilterDialog"
import { AirConditioningUnitCard } from "./AirConditioningUnitCard"
import { Badge } from "@/components/ui/badge"

export default function AirConditioningCard({ data, controller }: { data: AirConditioningType; controller: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [minIndoorTemp, setMinIndoorTemp] = useState(0)
  const [minSettingTemp, setMinSettingTemp] = useState(0)

  const filteredAndSortedData = useMemo(() => {
    return data.data
      .filter(
        (air) =>
          air.alias.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (filterStatus === "all" ||
            (filterStatus === "on" && air.status === "run") ||
            (filterStatus === "off" && air.status === "stop")) &&
          air.temperature_indoor >= minIndoorTemp &&
          air.temperature_setting >= minSettingTemp,
      )
      .sort((a, b) => Number.parseInt(a.id) - Number.parseInt(b.id))
  }, [data.data, searchTerm, filterStatus, minIndoorTemp, minSettingTemp])

  // Calcular estadísticas
  const stats = useMemo(() => {
    const total = data.data.length
    const running = data.data.filter((air) => air.status === "run").length
    const stopped = total - running
    return { total, running, stopped }
  }, [data.data])

  return (
    <div className="w-full flex-col">
      <div className="w-full flex items-center flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-72">
          <Search className="text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar por alias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300">
              <Power className="w-3 h-3 mr-1" />
              {stats.running} Encendidos
            </Badge>
            <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300">
              <Power className="w-3 h-3 mr-1" />
              {stats.stopped} Apagados
            </Badge>
          </div>
          <span className="border-l pl-4">Última actualización: {new Date(data.time!).toLocaleString()}</span>
        </div>

        <FilterDialog
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          minIndoorTemp={minIndoorTemp}
          setMinIndoorTemp={setMinIndoorTemp}
          minSettingTemp={minSettingTemp}
          setMinSettingTemp={setMinSettingTemp}
        />
      </div>

      <div className="w-full h-4"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedData.map((air) => (
          // Usar el ID del aire acondicionado como key para asegurar la unicidad
          <AirConditioningUnitCard
            air={air}
            key={`${air.id}-${air.status}-${air.temperature_setting}`}
            controller={controller}
          />
        ))}
      </div>

      <div className="w-full h-4"></div>
    </div>
  )
}

