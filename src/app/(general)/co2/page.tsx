import CO2Content from "@/components/Partial/Content/co2/CO2content";
import { AreasData } from "@/components/Partial/Content/content.data";
import { AreaData } from "@/types";

export default function CO2() {
  const data=AreasData['Concentracion de CO2'] as AreaData
  return (
    <div className="flex w-full h-full justify-center items-center">
        <CO2Content contentData={data}></CO2Content>
    </div>
  )
}
