'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"

type PowerData = {
    data: { potencia: string; value: number };
    time: string;
}[]

interface IndividualPowerChartsProps {
    powerData: PowerData[]
}

function SinglePowerChart({ data, powerType, color }: { data: any[], powerType: string, color: string }) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Potencia {powerType.charAt(0).toUpperCase() + powerType.slice(1)}</CardTitle>
                <CardDescription>Mediciones en {powerType ==='activa'? 'KW':(powerType ==='aparente'? 'VA': 'KVAR')}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        [powerType]: {
                            label: `Potencia ${powerType}`,
                            color: color,
                        },
                    }}
                    className="h-[200px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="time"
                                tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                            />
                            <YAxis />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        formatter={(value) => [`${Number(value).toFixed(2)} kW`, `Potencia ${powerType}`]}
                                        labelFormatter={(label) => new Date(label).toLocaleString()}
                                    />
                                }
                            />
                            <Line
                                type="monotone"
                                dataKey={powerType}
                                stroke={color}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default function BoardsPlots({ powerData }: IndividualPowerChartsProps) {
    const [timeRange, setTimeRange] = useState('3h')

    const chartData = useMemo(() => {
        const allTimes = new Set<string>()
        const powerValues: { [key: string]: { [key: string]: number } } = {}

        powerData.forEach(powerSeries => {
            const powerType = powerSeries[0].data.potencia
            powerSeries.forEach(entry => {
                allTimes.add(entry.time)
                if (!powerValues[entry.time]) {
                    powerValues[entry.time] = {}
                }
                powerValues[entry.time][powerType] = entry.data.value
            })
        })

        return Array.from(allTimes).sort().map(time => ({
            time,
            ...powerValues[time]
        }))
    }, [powerData])

    const filteredData = useMemo(() => {
        const now = new Date()
        const timeRangeInHours = parseInt(timeRange.slice(0, -1))
        const cutoffTime = new Date(now.getTime() - timeRangeInHours * 60 * 60 * 1000)
        return chartData.filter(entry => new Date(entry.time) >= cutoffTime)
    }, [chartData, timeRange])

    const powerTypes = ['activa', 'aparente', 'reactiva']
    const colors = {
        activa: "hsl(var(--chart-1))",
        aparente: "hsl(var(--chart-2))",
        reactiva: "hsl(var(--chart-3))"
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Mediciones de Potencia</h2>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar rango" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="3h">Últimas 3 horas</SelectItem>
                        <SelectItem value="6h">Últimas 6 horas</SelectItem>
                        <SelectItem value="12h">Últimas 12 horas</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className='flex w-full justify-between flex-wrap gap-4'>
                {powerTypes.map((powerType) => (
                    <div className='flex flex-1' key={powerType}>
                        <SinglePowerChart
                            
                            data={filteredData}
                            powerType={powerType}
                            color={colors[powerType as keyof typeof colors]}
                        />

                    </div>

                ))}
            </div>

        </div>
    )
}

