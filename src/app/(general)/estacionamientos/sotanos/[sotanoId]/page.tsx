import GridSotanos from "@/components/Partial/Content/estacionamientos/GridSotanos"
import { redirect } from "next/navigation";
interface Props {
    params: {
      sotanoId: string; // Parámetro dinámico
    };
  }
import { sotanosData } from "@/components/Partial/Content/estacionamientos/GridSotanos.data";

export default function Sotano({ params }: Props)  {
  const validPages = ["1", "2", "3", "4"];
    const { sotanoId } = params; // Obtener el parámetro dinámico "id"
    if (!validPages.includes(sotanoId)) {
      // Redirige al usuario a la página principal
      redirect("/estacionamientos");
    }
    const sotanoData = sotanosData.find(sotano=>sotano.id===sotanoId)
    return(
      
        <div className="flex w-full h-full justify-center items-center">
            <GridSotanos sotanoData={sotanoData!}></GridSotanos>
        </div>
    )
} 