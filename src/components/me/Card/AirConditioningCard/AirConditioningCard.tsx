import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AirConditioningType } from '@/types'
import { Wind, Thermometer, Bell, Power, ArrowUp, ArrowDown, Search } from 'lucide-react'
import { cn } from "@/lib/utils"

export default function AirConditioningCard({ data }: { data: AirConditioningType }) {
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'run':
        return "bg-green-500 hover:bg-green-600"
      case 'stop':
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-yellow-500 hover:bg-yellow-600"
    }
  }

  const getAlarmColor = (alarmCount: number) => {
    return alarmCount > 0 ? "text-red-500" : "text-green-500"
  }

  const filteredData = data.data.filter(air => 
    air.alias.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="w-full p-4 space-y-4">
      <div className="w-full flex items-center space-x-2">
        <Search className="text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar por alias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <p className="text-sm text-muted-foreground">
          Última actualización: {new Date(data.time!).toLocaleString()}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((air, index: number) => (
          <Card key={index} className="flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 transition-all duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg font-bold">{air.alias}</span>
                <Badge 
                  variant="default"
                  className={cn("flex items-center space-x-1 text-white", getStatusColor(air.status))}
                >
                  <Power size={14} />
                  <span>{air.status}</span>
                </Badge>
              </CardTitle>
              <CardDescription className="text-sm font-medium">{air.unit_name}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wind className="text-blue-500" size={20} />
                    <span className="font-light">ID: {air.id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bell className={cn("transition-colors duration-300", getAlarmColor(parseInt(air.alarm)))} size={20} />
                    <span className={cn("font-semibold", getAlarmColor(parseInt(air.alarm)))}>
                      {parseInt(air.alarm) > 0 ? `${air.alarm} Alarmas` : "Sin Alarmas"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex flex-col items-center">
                    <Thermometer className="text-orange-500 mb-1" size={24} />
                    <span className="text-2xl font-bold">{air.temperature_indoor}°C</span>
                    <span className="text-xs text-muted-foreground">Interior</span>
                  </div>
                  <div className="flex flex-col items-center">
                    {air.temperature_setting > air.temperature_indoor ? (
                      <ArrowUp className="text-red-500 mb-1" size={24} />
                    ) : (
                      <ArrowDown className="text-blue-500 mb-1" size={24} />
                    )}
                    <span className="text-2xl font-bold">{air.temperature_setting}°C</span>
                    <span className="text-xs text-muted-foreground">Configurado</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}

