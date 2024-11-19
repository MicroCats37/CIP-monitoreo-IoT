import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { BoardCardProps } from "./BoardCard.type"

export default function BoardCard({data}:{data:BoardCardProps}) {
    return (
        <div className="flex justify-evenly w-full">
            {
                data.map((board, index: number) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>Tablero de potencia {`${board.potencia}`}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Consumo</CardDescription>
                            {`${board.value}`} <strong>{`${board.potencia === 'activa' ? 'W' :board.potencia === 'reactiva' ? 'VAR' : 'VA'}`}</strong>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    )
}
