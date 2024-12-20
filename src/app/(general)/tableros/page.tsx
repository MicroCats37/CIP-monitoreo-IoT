import { AreasData } from "@/components/Partial/Content/content.data";
import BoardsContent from "@/components/Partial/Content/tableros/BoardsContent";
import { AreaData } from "@/types";

export default function Tableros() {
  const data=AreasData['Tableros Electricos'] as AreaData
  return (
    <div className="flex w-full h-full justify-center items-center">
        <BoardsContent contentData={data}></BoardsContent>
    </div>
  )
}
