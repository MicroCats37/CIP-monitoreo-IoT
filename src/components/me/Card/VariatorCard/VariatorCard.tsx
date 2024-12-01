import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { VariatorProps } from "./Variator.type"

export default function VariatorCard({ data }: { data: VariatorProps }) {
    return (
        <div className="flex justify-evenly w-full">
            {
                data.map((pump, index: number) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>Bomba {`${pump.bomba}`}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Estado</CardDescription>
                            <p>{`${pump.bomba}`}</p>
                            <CardDescription>Frequencia</CardDescription>
                            <p>{`${pump.frecuencia}`}</p>
                            <CardDescription>Intensidad</CardDescription>
                            <p>{`${pump.intensidad}`}</p>
                            <CardDescription>Potencia</CardDescription>
                            <p>{`${pump.potencia}`}</p>
                            <CardDescription>Temperatura</CardDescription>
                            <p>{`${pump.temperatura_unidad}`}</p>
                            <CardDescription>Tension de Salida</CardDescription>
                            <p>{`${pump.tension_salida}`}</p>
                            <CardDescription>Tiempo en Marcha</CardDescription>
                            <p>{`${pump.tiempo_marcha}`}</p>
                            <CardDescription>Velocidad y direccion</CardDescription>
                            <p>{`${pump.velocidad_y_direccion}`}</p>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    )
}