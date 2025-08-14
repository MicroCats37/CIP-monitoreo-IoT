
import BombasDeAguaChosicaChart from "@/components/Devices/bombas-agua-chosica/BombasDeAguaChosicaChart";
import BombasDeAguaEstadoChart from "@/components/Devices/bombas-agua/estado/BombasDeAguaEstadoChart";
import BombasDeAguaVariadoresChart from "@/components/Devices/bombas-agua/variadores/BombasDeAguaVariadoresChart";
import ConcentracionCloroChart from "@/components/Devices/concentracion-cloro/ConcentracionCloroChart";
import ConcentracionCo2Chart from "@/components/Devices/concentracion-co2/ConcentracionCo2Chart";
import SistemaContraIncendiosChart from "@/components/Devices/sistema-contra-incendios/SistemaContraIncendiosChart";
import TablerosDeEnergiaChart from "@/components/Devices/tableros-energia/TablerosDeEnergiaChart";
import { BombasDeAguaChosicaHistoricalType, BombasDeAguaEstadoHistoricalType, BombasDeAguaVariadoresHistoricalType, ConcentracionCloroHistoricalType, ConcentracionCo2HistoricalType, SistemaContraIncendiosHistoricalType, TablerosDeEnergiaHistoricalType } from "@/validators/devices/schemas";
import { MonitoreoPlotGeneralMessageType } from "@/validators/schemas";






const DeviceContentChartRenderer = ({ dataHistorical, type, timeRange }: { dataHistorical: MonitoreoPlotGeneralMessageType, type: string, timeRange: number }) => {
    switch (type) {
        case 'Tableros de Energia':
            return <TablerosDeEnergiaChart timeRange={timeRange} dataHistorical={dataHistorical as TablerosDeEnergiaHistoricalType} />;
        case 'Estado Bombas de Agua':
            return <BombasDeAguaEstadoChart timeRange={timeRange} dataHistorical={dataHistorical as BombasDeAguaEstadoHistoricalType} />;
        case 'Variadores Bombas de Agua':
            return <BombasDeAguaVariadoresChart timeRange={timeRange} dataHistorical={dataHistorical as BombasDeAguaVariadoresHistoricalType} />;
        case 'Concentracion de Co2':
            return <ConcentracionCo2Chart timeRange={timeRange} dataHistorical={dataHistorical as ConcentracionCo2HistoricalType} />;
        case 'Concentracion de Cloro Piscinas':
            return <ConcentracionCloroChart timeRange={timeRange} dataHistorical={dataHistorical as ConcentracionCloroHistoricalType} />;
        case 'Sistema Contra Incendios':
            return <SistemaContraIncendiosChart timeRange={timeRange} dataHistorical={dataHistorical as SistemaContraIncendiosHistoricalType} />;
        case 'Automatizacion de Bombas de Agua Chosica':
            return <BombasDeAguaChosicaChart timeRange={timeRange} dataHistorical={dataHistorical as BombasDeAguaChosicaHistoricalType} />;
        default:
            return null
    }
}

export default DeviceContentChartRenderer;