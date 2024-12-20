import { AreasData } from "@/components/Partial/Content/content.data";
import VariatorsContent from "@/components/Partial/Content/variadores/VariatorsContent";
import { AreaData  } from "@/types";
import { redirect } from "next/navigation";
interface Props {
    params: {
      variadorId: string; // Parámetro dinámico
    };
  }
export default function WaterPump({ params }: Props)  {
    const validVariadorIds = ['agua-potable', 'aguas-tratadas', 'aguas-grises'];
    const { variadorId } = params; // Obtener el parámetro dinámico "id"
    if (!validVariadorIds.includes(variadorId)) {
      // Redirige al usuario a la página principal
      redirect("/estacionamientos");
    }

    const data = (AreasData['Variadores'] as { [param: string]: AreaData })[variadorId];
    return(
      
        <div className="flex w-full h-full justify-center items-center">
              <VariatorsContent contentData={data}></VariatorsContent>
        </div>
    )
} 