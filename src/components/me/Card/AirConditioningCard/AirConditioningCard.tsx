import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Badge } from "@/components/ui/badge"
  import { AirConditioningProps } from "./AirConditioningCard.type"
  import { Wind, Thermometer, Bell, Power } from 'lucide-react'
  
  export default function AirConditioningCard({ data }: { data: AirConditioningProps }) {
    return (
      <div className="flex w-full flex-wrap p-4 gap-4">
        {data.data.map((air, index: number) => (
          <Card key={index} className="flex flex-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{air.unit_name}</span>
                <Badge 
                  variant={air.status === 'ON' ? "default" : "secondary"}
                  className={`flex items-center space-x-1 ${air.status === 'ON' ? "bg-green-500" : ""}`}
                >
                  <Power size={14} />
                  <span>{air.status}</span>
                </Badge>
              </CardTitle>
              <CardDescription>{air.alias}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wind className="text-blue-500" />
                    <span className="font-semibold">ID: {air.id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Bell className={air.alarm > 0 ? "text-red-500" : "text-green-500"} />
                    <span className="font-semibold">
                      {air.alarm > 0 ? `${air.alarm} Alarmas` : "Sin Alarmas"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <Thermometer className="text-orange-500 mr-2" size={24} />
                  <span className="text-2xl font-bold">
                    {/* Aquí podrías agregar la temperatura si estuviera disponible en los datos */}
                    -- °C
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  
  