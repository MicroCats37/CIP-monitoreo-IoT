
import AireAcondicionadoContainerCard from "@/components/Devices/aire-acondicionado/AireAcondicionadoContainerCard";
import BombasDeAguaChosicaCard from "@/components/Devices/bombas-agua-chosica/BombasDeAguaChosicaCard";
import Prisma3D from "@/components/Devices/bombas-agua-chosica/BombasDeAguaChosicaCard";
import BombasDeAguaEstadoCard from "@/components/Devices/bombas-agua/estado/BombasDeAguaEstadoCard";
import BombasDeAguaVariadoresCard from "@/components/Devices/bombas-agua/variadores/BombasDeAguaVariadoresCard";
import ConcentracionCloroCard from "@/components/Devices/concentracion-cloro/ConcentracionCloroCard";
import ConcentracionCo2Card from "@/components/Devices/concentracion-co2/ConcentracionCo2Card";
import EstacionamientosCard from "@/components/Devices/estacionamientos/EstacionamientosCard";
import SistemaContraIncendiosCard from "@/components/Devices/sistema-contra-incendios/SistemaContraIncendiosCard";
import TablerosDeEnergiaCard from "@/components/Devices/tableros-energia/TablerosDeEnergiaCard";
import { GeneralMQTTObjectType } from "@/types";
import { PageEntry } from "@/utils/Devices/Data/data.pages.monitoreo";
import { AireAcondicionadoType, BombasDeAguaChosicaType, BombasDeAguaEstadoType, BombasDeAguaVariadoresType, ConcentracionCloroType, ConcentracionCo2Type, EstacionamientoType, SistemaContraIncendiosType, TablerosDeEnergiaType } from "@/validators/devices/schemas";

const DeviceContentCardRenderer = ({
  data,
  dataMQTT,
  type,
}: {
  data: PageEntry;
  dataMQTT: GeneralMQTTObjectType;
  type: string;
}) => {
  switch (type) {
    case 'Tableros de Energia':
      return (
        <div className="flex w-full">
          <TablerosDeEnergiaCard dataMQTT={dataMQTT as TablerosDeEnergiaType} />
        </div>
      );

    case 'Estado Bombas de Agua':
      return (
        <div className="flex w-full">
          {dataMQTT && <BombasDeAguaEstadoCard dataMQTT={dataMQTT as BombasDeAguaEstadoType} />}
        </div>
      );

    case 'Variadores Bombas de Agua':
      return (
        <div className="flex w-full">
          {dataMQTT && <BombasDeAguaVariadoresCard dataMQTT={dataMQTT as BombasDeAguaVariadoresType} />}
        </div>
      );

    case 'Concentracion de Co2':
      return (
        <div className="flex w-full">
          {dataMQTT && <ConcentracionCo2Card dataMQTT={dataMQTT as ConcentracionCo2Type} />}
        </div>
      );

    case 'Concentracion de Cloro Piscinas':
      return (
        <div className="flex w-full">
          {dataMQTT && <ConcentracionCloroCard dataMQTT={dataMQTT as ConcentracionCloroType} />}
        </div>
      );

    case 'Aire Acondicionado':
      return (
        <div className="flex w-full">
          {dataMQTT && <AireAcondicionadoContainerCard dataMQTT={dataMQTT as AireAcondicionadoType} dataConfig={data} />}
        </div>
      );

    case 'Estacionamientos':
      return (
        <div className="flex w-full h-full">
          {dataMQTT && <EstacionamientosCard dataMQTT={dataMQTT as EstacionamientoType} />}
        </div>
      );
    case 'Sistema Contra Incendios':
      return (
        <div className="flex w-full">
          {dataMQTT && <SistemaContraIncendiosCard dataMQTT={dataMQTT as SistemaContraIncendiosType} />}
        </div>
      );

    case 'Automatizacion de Bombas de Agua Chosica':
      return (
        <div className="flex w-full">
          {dataMQTT && <BombasDeAguaChosicaCard dataMQTT={dataMQTT as BombasDeAguaChosicaType}/>}
        </div>
      );

    default:
      return null;
  }
};

export default DeviceContentCardRenderer;