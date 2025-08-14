"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getClient } from "@/mqtt/mqttClient"
import { Zap, ZapOff, Wifi, WifiOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  label?: string
  topic: string
  payload: object | string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  icon?: "pump" | "power" | "custom"
  className?: string
}

export default function ButtonDownLinkMQTT({
  topic,
  payload,
  label = "Controlar Bomba",
  variant = "default",
  size = "default",
  icon = "pump",
  className,
}: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [lastAction, setLastAction] = useState<string | null>(null)

  const client = getClient()
  const isConnected = client?.connected || false

  const handleSend = async () => {
    if (!isConnected) {
      console.error("MQTT no conectado")
      return
    }

    setIsLoading(true)

    try {
      const body = typeof payload === "string" ? payload : JSON.stringify(payload)

      client.publish(topic, body, { qos: 1, retain: false }, (err) => {
        if (err) {
          console.error("Error enviando downlink:", err.message || err)
          setLastAction("error")
        } else {
          console.log("Downlink publicado ✅")
          setLastAction("success")
        }
        setIsLoading(false)

        // Limpiar el estado después de 2 segundos
        setTimeout(() => setLastAction(null), 2000)
      })
    } catch (error) {
      console.error("Error:", error)
      setIsLoading(false)
      setLastAction("error")
      setTimeout(() => setLastAction(null), 2000)
    }
  }

  const getIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />

    switch (icon) {
      case "pump":
        return isConnected ? <Zap className="h-4 w-4" /> : <ZapOff className="h-4 w-4" />
      case "power":
        return isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />
      default:
        return null
    }
  }

  const getButtonVariant = () => {
    if (lastAction === "error") return "destructive"
    if (lastAction === "success") return "default"
    if (!isConnected) return "outline"
    return variant
  }

  const getButtonText = () => {
    if (isLoading) return "Enviando..."
    if (lastAction === "success") return "¡Enviado!"
    if (lastAction === "error") return "Error"
    if (!isConnected) return "Desconectado"
    return label
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={handleSend}
        disabled={!isConnected || isLoading}
        variant={getButtonVariant()}
        size={size}
        className={cn(
          "transition-all duration-200 font-medium",
          "hover:scale-105 active:scale-95",
          !isConnected && "opacity-60 cursor-not-allowed",
          lastAction === "success" && "bg-green-600 hover:bg-green-700",
          lastAction === "error" && "bg-red-600 hover:bg-red-700",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          {getIcon()}
          <span>{getButtonText()}</span>
        </div>
      </Button>
    </div>
  )
}
