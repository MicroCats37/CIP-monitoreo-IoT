"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, Gauge, Power, Zap } from "lucide-react"
import { BombasDeAguaChosicaType } from "@/validators/devices/schemas"
import ButtonDownLinkMQTT from "@/components/Custom/ButtonDownLinkMQTT/ButtonDownLinkMQTT"

// Componente para card de Estado
function EstadoCard({
  sensorName,
  estado,
  time,
  deviceName,
}: {
  sensorName: string
  estado: number
  time: string
  deviceName: string
}) {
  const formatTime = (timeString: string) => {
    try {
      return new Date(timeString).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return timeString
    }
  }

  return (
    <Card className="flex flex-col lg:flex-row w-full justify-evenly items-center">
      <div className="flex-col justify-center items-center w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{sensorName}</CardTitle>
          <Power className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold">Estado</p>
              <Badge variant={estado ? "default" : "destructive"} className="text-xs">
                {estado ? "Tanque Lleno" : "Tanque Vacío"}
              </Badge>
            </div>
            <div className="flex items-center">
              {estado ? <Zap className="h-8 w-8 text-green-500" /> : <Power className="h-8 w-8 text-red-500" />}
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-xs text-muted-foreground">Dispositivo: {deviceName}</p>
            <p className="text-xs text-muted-foreground">Última actualización: {formatTime(time)}</p>
          </div>
        </CardContent>
      </div>

    </Card>
  )
}

// Componente para card de Presión
function PresionCard({
  sensorName,
  presion,
  time,
  deviceName,
}: {
  sensorName: string
  presion: number
  time: string
  deviceName: string
}) {
  const formatTime = (timeString: string) => {
    try {
      return new Date(timeString).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return timeString
    }
  }

  const getPresionStatus = (presion: number) => {
    if (presion < 20) return { status: "Baja", color: "destructive" as const }
    if (presion > 80) return { status: "Alta", color: "destructive" as const }
    return { status: "Normal", color: "default" as const }
  }

  const presionStatus = getPresionStatus(presion)

  return (

    <Card className="flex flex-col lg:flex-row w-full justify-evenly items-center">
      <div className="flex-col justify-center items-center">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{sensorName}</CardTitle>
          <Gauge className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold">{presion} %</p>
              <Badge variant={presionStatus.color} className="text-xs">
                {presionStatus.status}
              </Badge>
            </div>

            <div className="flex items-center">
              <Droplets className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-xs text-muted-foreground">Dispositivo: {deviceName}</p>
            <p className="text-xs text-muted-foreground">Última actualización: {formatTime(time)}</p>
          </div>

        </CardContent>
      </div>

    </Card>
  )
}

// Componente principal que decide qué card renderizar
function BombaCard({
  detail,
  deviceName,
}: {
  detail: BombasDeAguaChosicaType["details"][0]
  deviceName: string
}) {
  const { data, time } = detail
  const { sensor, fields } = data

  // Verificar qué tipo de field es
  if (sensor.name === "Bomba Almacen") {
    return <EstadoCard sensorName={sensor.name} estado={fields.estado!} time={time} deviceName={deviceName} />
  }

  if (sensor.name === "Bomba Pozo") {
    return <PresionCard sensorName={sensor.name} presion={fields.presion!} time={time} deviceName={deviceName} />
  }

  // Fallback si no se puede determinar el tipo
  return (
    <Card className="flex w-full">
      <CardContent className="pt-6">
        <p className="text-sm text-muted-foreground">Tipo de dato no reconocido</p>
      </CardContent>
    </Card>
  )
}

// Componente contenedor que renderiza todas las cards
export default function BombasDeAguaChosicaCard({ dataMQTT }: { dataMQTT: BombasDeAguaChosicaType }) {
  return (
    <div className="w-full flex ">
      <div className="flex flex-col md:flex-row w-full gap-4">
        {dataMQTT.details.map((detail, index) => (
          <BombaCard key={`${detail.data.sensor.name}-${index}`} detail={detail} deviceName={dataMQTT.device.name} />
        ))}
      </div>

    </div>
  )
}

/*
<div className="flex flex-col gap-4 order-1 md:order-2">
          <ButtonDownLinkMQTT
            label="Prender"
            topic={`application/1/device/ac1f09fffe06d196/command/down`}
            payload={{
              confirmed: false,
              data: "AA==",
              fPort: 240,
              devEui: "ac1f09fffe06d196",
            }}
          />

          <ButtonDownLinkMQTT
            label="Apagar"
            topic={`application/1/device/ac1f09fffe06d196/command/down`}
            payload={{
              confirmed: false,
              data: "AQ==",
              fPort: 240,
              devEui: "ac1f09fffe06d196",
            }}
          />

          <ButtonDownLinkMQTT
            label="Reiniciar"
            topic={`application/1/device/ac1f09fffe06d196/command/down`}
            payload={{
              confirmed: false,
              data: "Dw==",
              fPort: 240,
              devEui: "ac1f09fffe06d196",
            }}
          />

        </div>
*/