import { AireAcondicionadoType } from "@/validators/devices/schemas";
import AireAcondicionadoContainerCard from "./AireAcondicionadoContainerCard";
import { PageEntry } from "@/utils/Devices/Data/data.pages.monitoreo";


interface Props {
  data:PageEntry
  dataMQTT?:AireAcondicionadoType;
}

const AireAcondicionadoContent: React.FC<Props> = ({ data,dataMQTT }) => {
  return (
    <div>
      {dataMQTT ? (
        <AireAcondicionadoContainerCard dataMQTT={dataMQTT} dataConfig={data}/>
      ) : (
        <p className="text-gray-500">No hay datos disponibles para el aire acondicionado.</p>
      )}
    </div>
    
  )
};
export default AireAcondicionadoContent;