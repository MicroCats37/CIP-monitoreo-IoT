"use client"

import { useMemo, useState } from "react"
import type { FilterStatus } from "@/components/Custom/FilterAir/FilterMenu"
import { DateRange } from "react-day-picker"
import { AireAcondicionadoCard } from "./AireAcondicionadoCard"
import { type AireAcondicionadoType } from "@/validators/devices/schemas"
import { PageEntry } from "@/utils/Devices/Data/data.pages.monitoreo"
import { Power, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FilterDialog } from "@/components/Custom/FilterAir/FilterDialog"
import { Badge } from "@/components/ui/badge"


interface AirConditioningCardProps {
  dataMQTT: AireAcondicionadoType;
  dataConfig: PageEntry
}
export interface Stats {
  total: number;
  running: number;
  stopped: number;
}

export default function AireAcondicionadoContainerCard({ dataMQTT, dataConfig }: AirConditioningCardProps) {
  const data = dataMQTT
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [minIndoorTemp, setMinIndoorTemp] = useState(0);
  const [minSettingTemp, setMinSettingTemp] = useState(0);
  const filteredAndSortedData = useMemo(() => {
    return data.details.data
      .filter(
        (air) =>
          air.fields.alias.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (filterStatus === "all" ||
            (filterStatus === "on" && air.fields.status === 1) ||
            (filterStatus === "off" && air.fields.status === 0)) &&
          air.fields.temperature_indoor >= minIndoorTemp &&
          air.fields.temperature_setting >= minSettingTemp,
      )
      .sort((a, b) => Number.parseInt(a.fields.id) - Number.parseInt(b.fields.id))
  }, [data, searchTerm, filterStatus, minIndoorTemp, minSettingTemp])

  // Calcular estadísticas
  const stats: Stats = useMemo(() => {
    const total = data.details.data.length
    const running = data.details.data.filter((air) => air.fields.status === 1).length
    const stopped = total - running
    return { total, running, stopped }
  }, [data])

  return (
    <div className="w-full flex-col space-y-4">
      <div className="flex items-center gap-4 flex-wrap min-w-72">
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
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
          <span className="border-l pl-4">Última actualización: {new Date(data.details.time).toLocaleString()}</span>
        </div>
        <div className='flex gap-4 flex-wrap'>
          <FilterDialog
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            minIndoorTemp={minIndoorTemp}
            setMinIndoorTemp={setMinIndoorTemp}
            minSettingTemp={minSettingTemp}
            setMinSettingTemp={setMinSettingTemp}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedData.map((air) => (
          // Usar el ID del aire acondicionado como key para asegurar la unicidad
          <AireAcondicionadoCard
            data={air}
            key={`${air.fields.id}-${air.fields.status}-${air.fields.temperature_setting}`}
            controller={data.device.name}
            dataConfig={dataConfig}
          />
        ))}
      </div>

    </div>
  );
}

/*
"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import type { AirConditioningType, AreaData } from "@/types0"
import { Search, Power } from "lucide-react"
import type { FilterStatus } from "@/components/Custom/FilterAir/FilterMenu"
import { FilterDialog } from "@/components/Custom/FilterAir/FilterDialog"
import { AirConditioningUnitCard } from "./AirConditioningUnitCard"
import { Badge } from "@/components/ui/badge"
import { DateRange } from "react-day-picker"
import { ButtonRangeDate } from "@/components/Custom/ButtonRangeDate/ButtonRangeDate"
import { ButtonDownloadCSV } from "@/components/Custom/ButtonDownloadCSV/ButtonDownloadCSV"

export default function AirConditioningCard({ data, controller,contentData }: { data: AirConditioningType; controller: string,contentData:AreaData }) {
  const [intervalo, setIntervalo] = useState<string>("30m");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setHours(new Date().getHours() - 1)), // 1 hora antes
    to: new Date(),
  });
  const endTime = dateRange.to?.toISOString() ? dateRange.to?.toISOString() : new Date().toISOString(); // Resta 1 hora
  const startTime = dateRange.from?.toISOString() ? dateRange.from?.toISOString() : new Date(new Date(endTime).getTime() - 60 * 60 * 1000).toISOString();


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
        <div className='w-full flex gap-4 justify-between flex-wrap'>
          <div className="flex items-center gap-4 flex-wrap min-w-72">
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
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
          </div>
          <div className='flex gap-4 flex-wrap'>
            <ButtonRangeDate dateRange={dateRange} setDateRange={setDateRange}></ButtonRangeDate>
            <ButtonDownloadCSV
              fileName={`Aire Acondicionado ${contentData.id} `}
              endpoint={contentData.download!}
              startTime={startTime}
              endTime={endTime}
              query={`port=${controller}`}
            />
            <FilterDialog
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              minIndoorTemp={minIndoorTemp}
              setMinIndoorTemp={setMinIndoorTemp}
              minSettingTemp={minSettingTemp}
              setMinSettingTemp={setMinSettingTemp}
            />
          </div>
        </div>





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


*/