import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { SCIType } from "@/types"
  import { Battery, Zap, Activity, AlertTriangle, CheckCircle } from 'lucide-react'
  import { Badge } from "@/components/ui/badge"
  
  export default function BoardCard({ data }: { data: SCIType }) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Sistema Contra Incendios</span>
            <Battery className="text-green-500" />
          </CardTitle>
          <CardDescription>{data.time ? `Última actualización: ${data.time}` : 'Sin datos de tiempo'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Zap className="text-yellow-500" />
                <span className="font-semibold">{data.voltage}V</span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="text-blue-500" />
                <span className="font-semibold">{data.current}A</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{data.frequency}Hz</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{data.custom_locked_rotor_current}A LRC</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Estado de Alarmas</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(data)
                  .filter(([key, _]) => key.startsWith('user_alarm_'))
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                      <span className="text-sm">{key.replace('user_alarm_', 'Alarma ')}</span>
                      <Badge 
                        variant={value ? "destructive" : "secondary"}
                        className="flex items-center space-x-1"
                      >
                        {value ? (
                          <>
                            <AlertTriangle size={14} />
                            <span>ON</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle size={14} />
                            <span>OFF</span>
                          </>
                        )}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  