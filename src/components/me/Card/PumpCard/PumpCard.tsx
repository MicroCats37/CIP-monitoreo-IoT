import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Badge } from "@/components/ui/badge"
  import { PinIcon as PumpIcon } from 'lucide-react'
  import { PumpCardProps } from "./PumpCard.type"
  import { cn } from "@/lib/utils"
  
  export default function PumpCard({ data }: { data: PumpCardProps }) {
    return (
      <div className="flex gap-4 w-full p-4">
        {data.map((pump, index: number) => (
          <Card key={index} className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm font-medium">
                <span>Bomba {pump.bomba}</span>
                <PumpIcon className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge 
                variant={pump.estado ? "default" : "secondary"}
                className={cn(
                  "w-full justify-center py-1 text-xs font-normal",
                  pump.estado ? "bg-primary/10 text-primary hover:bg-primary/20" : "bg-muted text-muted-foreground"
                )}
              >
                {pump.estado ? 'Operativo' : 'No Operativo'}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  
  