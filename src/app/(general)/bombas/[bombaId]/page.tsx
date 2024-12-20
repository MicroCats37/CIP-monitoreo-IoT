import WaterPumpContent from "@/components/Partial/Content/bombas/WaterPumpContent";
import { AreasData } from "@/components/Partial/Content/content.data";
import { AreaData } from "@/types";

import { redirect } from "next/navigation";
interface Props {
    params: {
      bombaId: string; // Parámetro dinámico
    };
  }
export default function WaterPump({ params }: Props)  {
    const validBombasIds = ['agua-potable', 'aguas-tratadas', 'aguas-grises'];
    const { bombaId } = params; // Obtener el parámetro dinámico "id"
    if (!validBombasIds.includes(bombaId)) {
      // Redirige al usuario a la página principal
      redirect("/estacionamientos");
    }
    const data = (AreasData['Bombas'] as { [param: string]: AreaData })[bombaId];
    return(
      
        <div className="flex w-full h-full justify-center items-center">
              <WaterPumpContent contentData={data}></WaterPumpContent>
        </div>
    )
} 