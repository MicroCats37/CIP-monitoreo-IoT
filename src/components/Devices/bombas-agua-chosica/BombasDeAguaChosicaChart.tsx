"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts"
import { formatChartConfigSimpleDetailsArrayArray } from "@/utils/Devices/PlotFormat/general"
import { BombasDeAguaChosicaHistoricalType } from "@/validators/devices/schemas"
import { ChartStakedDataSimpleSchema, type ChartStakedDataSimple, type ChartStakedData } from "@/validators/schemas"
import { formatDateTimeByDiff } from "@/utils/Devices/PlotFormat/ToolTip/formatDateRealTime"
import { formatDateTime } from "@/utils/Devices/PlotFormat/ToolTip/formatDateTime"
import { getLabel } from "@/utils/Devices/PlotFormat/LabelandUnits"
import { CurveType } from "recharts/types/shape/Curve"

interface Props {
    timeRange: number
    dataHistorical: BombasDeAguaChosicaHistoricalType
}

export default function BombasDeAguaChosicaChart({ timeRange, dataHistorical }: Props) {
    // 1. Damos formato usando la función global (Simple separa cada field del sensor en un array distinto)
    const { data: chartDataRaw, chartConfig } = formatChartConfigSimpleDetailsArrayArray(
        dataHistorical.device.name,
        dataHistorical
    )

    // Validamos el nivel del json de los datos: es un ChartStakedDataSimple 
    const isSimple = ChartStakedDataSimpleSchema.safeParse(chartDataRaw).success
    const chartData = chartDataRaw as ChartStakedDataSimple

    // Formateador personalizado para la automatización (0=Off, 1=On)
    const yAxisFormatterEstado = (value: number) => {
        return value === 0 ? "Off" : value === 1 ? "On" : "";
    }

    if (!isSimple || !chartData) {
        return (
            <div className="text-sm font-semibold p-4 text-red-500 bg-red-50 rounded-lg border border-red-200">
                ⚠️ Formato de datos históricos no válido o vacío.
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full gap-6">
            {Object.entries(chartData).map(([sensorName, sensorValue], index0) =>
                Object.entries(sensorValue as ChartStakedData).map(([fieldName, sensorData], index) => {

                    // Comprobamos si el field actual incluye texto de estado o de presion
                    const isEstado = fieldName.toLowerCase().includes('estado')
                    const isPresion = fieldName.toLowerCase().includes('presion')

                    // Para el titulo combinamos el sensor y el field
                    const dynamicLabel = `${getLabel(sensorName, dataHistorical.device.name)} - ${getLabel(fieldName, dataHistorical.device.name)}`

                    return (
                        <Card key={`${sensorName}_${fieldName}_simple_${index}`} className="w-full shadow-lg border-border/60 transition-all hover:shadow-xl">
                            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b py-5 bg-gradient-to-r from-muted/30 to-transparent">
                                <div className="grid gap-1.5 text-left">
                                    <CardTitle className="text-xl font-bold text-foreground">
                                        Analítica de {dynamicLabel}
                                    </CardTitle>
                                    <CardDescription className="text-muted-foreground/80 font-medium">
                                        Métricas históricas y ciclo de trabajo en tiempo real
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="px-2 pt-8 sm:px-6">
                                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                    <AreaChart
                                        data={sensorData}
                                        margin={{ top: 10, right: 30, left: 10, bottom: 15 }}
                                    >
                                        <defs>
                                            <linearGradient key={`grad-${String(fieldName)}`} id={`fill-${String(fieldName).replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={chartConfig[fieldName]?.color || "hsl(var(--primary))"} stopOpacity={0.8} />
                                                <stop offset="95%" stopColor={chartConfig[fieldName]?.color || "hsl(var(--primary))"} stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />

                                        <XAxis
                                            dataKey="timestamp"
                                            type="number"
                                            scale="time"
                                            tickMargin={12}
                                            minTickGap={32}
                                            domain={["dataMin", "dataMax"]}
                                            tickFormatter={(value) => formatDateTimeByDiff(new Date(value).toISOString(), timeRange)}
                                            stroke="hsl(var(--muted-foreground))"
                                            fontSize={12}
                                            tickLine={false}
                                        />

                                        <YAxis
                                            yAxisId="left"
                                            domain={isEstado ? [-0.2, 1.2] : ["auto", "auto"]}
                                            ticks={isEstado ? [0, 1] : undefined}
                                            orientation="left"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={10}
                                            tickFormatter={isEstado ? yAxisFormatterEstado : (value) => `${value} %`}
                                            stroke="hsl(var(--muted-foreground))"
                                            fontSize={12}
                                        />

                                        <ChartTooltip
                                            cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                                            content={
                                                <ChartTooltipContent
                                                    className="w-auto shadow-xl bg-background/95 backdrop-blur-md rounded-xl"
                                                    labelFormatter={(label, payload) => {
                                                        if (payload && payload.length > 0 && payload[0].payload) {
                                                            const timestamp = payload[0].payload.timestamp
                                                            if (!timestamp || isNaN(Number(timestamp))) return "Tiempo no disponible"
                                                            return formatDateTime(new Date(Number(timestamp)).toISOString())
                                                        }
                                                        return "Tiempo no disponible"
                                                    }}
                                                />
                                            }
                                        />

                                        <Area
                                            yAxisId="left"
                                            type={isEstado ? "stepAfter" : "monotone" as CurveType}
                                            dataKey={fieldName}
                                            connectNulls={true}
                                            stroke={chartConfig[fieldName]?.color || 'hsl(var(--primary))'}
                                            dot={false}
                                            activeDot={{ r: 5, strokeWidth: 2 }}
                                            strokeWidth={2}
                                            fill={`url(#fill-${String(fieldName).replace(/\s+/g, '')})`}
                                            fillOpacity={0.5}
                                            className="transition-opacity duration-300 hover:opacity-80"
                                        />

                                    </AreaChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    )
                })
            )}
        </div>
    )
}