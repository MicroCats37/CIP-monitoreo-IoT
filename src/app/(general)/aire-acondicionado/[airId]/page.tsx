import AirConditioningContent from "@/components/Partial/Content/aire-acondicionado/AirConditioningContent";

import { redirect } from "next/navigation";
interface Props {
    params: {
      airId: string; // Parámetro dinámico
    };
  }
export default function WaterPump({ params }: Props)  {
    const validAirIds = ['1', '2'];
    const { airId } = params; // Obtener el parámetro dinámico "id"
    if (!validAirIds.includes(airId)) {
      // Redirige al usuario a la página principal
      redirect("/estacionamientos");
    }
    return(
      
        <div className="flex w-full h-full justify-center items-center">
              <AirConditioningContent id={airId}></AirConditioningContent>
        </div>
    )
} 