"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Activity, Zap, Gauge, Battery, Thermometer, Clock, Wind } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { VariatorsType } from "@/types"

interface DataChartProps {
    data: VariatorsType[]
}

const chartConfig = {
    views: {
      label: "Page Views",
      color: "#f39c12", // Amarillo (coincide con text-yellow-500)
      icon: Wind,
      unit: "rpm",
    },
    velocidad_y_direccion: {
      label: "Velocidad y Dirección",
      color: "#3498db", // Azul (coincide con text-blue-500)
      icon: Wind,
      unit: "rpm",
    },
    frecuencia: {
      label: "Frecuencia",
      color: "#eab308", // Índigo (coincide con text-indigo-500)
      icon: Activity,
      unit: "Hz",
    },
    intensidad: {
      label: "Intensidad",
      color: "#8e44ad", // Púrpura (coincide con text-purple-500)
      icon: Zap,
      unit: "A",
    },
    potencia: {
      label: "Potencia",
      color: "#e67e22", // Naranja (coincide con text-orange-500)
      icon: Gauge,
      unit: "kW",
    },
    tension_salida: {
      label: "Tensión de Salida",
      color: "#20b2aa", // Verde azulado (coincide con text-teal-500)
      icon: Battery,
      unit: "V",
    },
    temperatura_unidad: {
      label: "Temperatura de Unidad",
      color: "#e74c3c", // Rojo (coincide con text-red-500)
      icon: Thermometer,
      unit: "°C",
    },
    tiempo_marcha: {
      label: "Tiempo de Marcha",
      color: "#6b7280", // Turquesa (coincide con text-teal-500)
      icon: Clock,
      unit: "h",
    },
  } satisfies ChartConfig;
  


const getStatusColor = (status: string): string => {
    switch (status) {
      case "velocidad_y_direccion":
        return "text-blue-500 hover:text-blue-600";
      case "frecuencia":
        return "text-yellow-500 hover:text-yellow-600";
      case "intensidad":
        return "text-purple-500 hover:text-purple-600";
      case "potencia":
        return "text-orange-500 hover:text-orange-600";
      case "tension_salida":
        return "text-teal-500 hover:text-teal-600";
      case "temperatura_unidad":
        return "text-pink-500 hover:text-pink-600";
      case "tiempo_marcha":
        return "text-gray-500 hover:text-gray-600";
      case "views":
        return "text-yellow-500 hover:text-yellow-600";
      default:
        return "text-yellow-500 hover:text-yellow-600";
    }
  };
  

export function VariatorsCharts({ data }: DataChartProps) {
    const chartData = data.map((reading) => ({
        time: new Date(reading.time).toLocaleTimeString(),
        velocidad_y_direccion: reading.data.velocidad_y_direccion,
        frecuencia: reading.data.frecuencia,
        intensidad: reading.data.intensidad,
        potencia: reading.data.potencia,
        tension_salida: reading.data.tension_salida,
        temperatura_unidad: reading.data.temperatura_unidad,
        tiempo_marcha: reading.data.tiempo_marcha,
    }))
    const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("potencia")

    const total = React.useMemo(
        () => ({
            velocidad_y_direccion: chartData.reduce((acc, curr) => acc + curr.velocidad_y_direccion, 0),
            frecuencia: chartData.reduce((acc, curr) => acc + curr.frecuencia, 0),
            intensidad: chartData.reduce((acc, curr) => acc + curr.intensidad, 0),
            potencia: chartData.reduce((acc, curr) => acc + curr.potencia, 0),
            tension_salida: chartData.reduce((acc, curr) => acc + curr.tension_salida, 0),
            temperatura_unidad: chartData.reduce((acc, curr) => acc + curr.temperatura_unidad, 0),
            tiempo_marcha: chartData.reduce((acc, curr) => acc + curr.tiempo_marcha, 0),
        }),
        [chartData],
    )

    return (
        <Card className="grid w-full">
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle className="text-center text-2xl">{data[0].data.bomba.toUpperCase()}</CardTitle>
                    <CardDescription className="text-center text-xl">{chartConfig[activeChart].label}</CardDescription>
                </div>
                <div className="flex flex-wrap">
                    {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>)
                        .filter((key) => key !== "views")
                        .map((key) => {
                            const chart = key as keyof typeof chartConfig
                            const Icon = chartConfig[chart].icon
                            return (
                                <button
                                    key={chart}
                                    data-active={activeChart === chart}
                                    className="flex flex-1 flex-col items-center justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/90 sm:border-l sm:border-t-0 sm:px-8 sm:py-6" 
                                    onClick={() => setActiveChart(chart)}
                                >
                                    <Icon className={`h-8 w-8 mb-1 ${getStatusColor(key)}`} />
                                    <span className="text-xs text-muted-foreground">{chartConfig[chart].label}</span>
                                    <div className="flex flex-wrap justify-center">

                                        <span className="text-lg font-bold leading-none">
                                            {total[key].toLocaleString()}
                                        </span>
                                        <span className="text-lg font-bold leading-none">
                                            {chartConfig[chart].unit}
                                        </span>

                                    </div>

                                </button>
                            )
                        })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">

                    {
                        chartConfig[activeChart].label === "Velocidad y Dirección" ? (
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="time" />
                                <YAxis
                                    yAxisId="left"
                                    orientation="left"
                                    stroke={`var(--color-${activeChart})`}
                                    unit={chartConfig[activeChart].unit}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />

                                <Line
                                    yAxisId="left"
                                    dataKey={activeChart}
                                    type="monotone"
                                    stroke={`var(--color-${activeChart})`}
                                    strokeWidth={2}
                                    dot={false}
                                />

                            </LineChart>

                        ) : (
                            <AreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="time" />
                                <YAxis
                                    yAxisId="left"
                                    orientation="left"
                                    stroke={`var(--color-${activeChart})`}
                                    unit={chartConfig[activeChart].unit}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area
                                        yAxisId="left"
                                        dataKey={activeChart}
                                        type="natural"
                                        fill={`var(--color-${activeChart})`}
                                        fillOpacity={0.4}
                                        stroke={`var(--color-${activeChart})`}
                                        stackId="a"
                                    />


                            </AreaChart>

                        )
                    }


                </ChartContainer>
            </CardContent>
        </Card>
    )
}



/*
{
                            chartConfig[activeChart].label === "Velocidad y Dirección" ? (
                                <Line
                                    yAxisId="left"
                                    dataKey={activeChart}
                                    type="monotone"
                                    stroke={`var(--color-${activeChart})`}
                                    strokeWidth={2}
                                    dot={false}
                                />) :
                                (
                                    <Area
                                        yAxisId="left"
                                        dataKey={activeChart}
                                        type="natural"
                                        fill={`var(--color-${activeChart})`}
                                        fillOpacity={0.4}
                                        stroke={`var(--color-${activeChart})`}
                                        stackId="a"
                                    />
                                )
                        }
*/