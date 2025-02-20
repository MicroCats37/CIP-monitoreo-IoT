import { AreasData } from "@/components/Partial/Content/content.data";
import PoolContent from "@/components/Partial/Content/piscinas/PoolContent";
import { AreaData } from "@/types";

export default function Sci() {
  const data=AreasData['Piscinas'] as AreaData
  return (
    <div className="flex w-full h-full justify-center items-center">
        <PoolContent contentData={data}></PoolContent>
    </div>
  )
}
