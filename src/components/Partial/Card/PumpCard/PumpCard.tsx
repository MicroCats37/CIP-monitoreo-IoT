import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cable  as PumpIcon } from 'lucide-react'
import { PumpCardProps } from "./PumpCard.type"
import { cn } from "@/lib/utils"

export default function PumpCard({ data }: { data: PumpCardProps }) {
  return (
    <div className="flex gap-4 w-full flex-col lg:flex-row">
      {data.map((pump, index: number) => (
        <Card key={index} className={cn(
          "w-full transition-all duration-300",
          pump.data.estado 
            ? "bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20" 
            : "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-medium">
              <span>Bomba {pump.data.bomba}</span>
              <PumpIcon className={cn(
                "h-5 w-5 transition-all duration-300",
                pump.data.estado 
                  ? "text-green-500 animate-pulse" 
                  : "text-red-500"
              )} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={pump.data.estado ? "default" : "secondary"}
              className={cn(
                "w-full justify-center py-1 text-xs font-normal transition-all duration-300",
                pump.data.estado 
                  ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-700/30 dark:text-green-300" 
                  : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-700/30 dark:text-red-300"
              )}
            >
              {pump.data.estado ? 'Operativo' : 'No Operativo'}
            </Badge>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground text-center">
              Última actualización: {new Date(pump.time!).toLocaleString()}
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

