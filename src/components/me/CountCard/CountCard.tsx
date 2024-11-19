import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CountCardProps } from './CountCard.types'

interface CountCardComponentProps {
    data: CountCardProps[];
    className?: string; // Agregamos una propiedad opcional para las clases
  }

export default function CountCard({ data, className }: CountCardComponentProps) {
  return (
    <div className={`${className}`}>
        {
                data.map((cars, index: number) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>Estacionamientos {`${cars.state}s`}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>cantidad</CardDescription>
                            {`${cars.count}`} 
                        </CardContent>
                    </Card>
                ))
            }
      
    </div>
  )
}
