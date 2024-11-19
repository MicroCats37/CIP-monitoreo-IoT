import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { PumpCardProps } from "./PumpCard.type"

export default function PumpCard({ data }: { data: PumpCardProps }) {
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
                            <p>{`${pump.estado? ('operativo'):('no operativo')}`}</p>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    )
}
