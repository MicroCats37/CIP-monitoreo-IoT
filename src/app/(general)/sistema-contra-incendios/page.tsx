import { AreasData } from "@/components/Partial/Content/content.data";
import SCIContent from "@/components/Partial/Content/sci/SCIContent";
import { AreaData } from "@/types";

export default function Sci() {
  const data=AreasData['Sistema contra Incendios'] as AreaData
  return (
    <div className="flex w-full h-full justify-center items-center">
        <SCIContent contentData={data}></SCIContent>
    </div>
  )
}
