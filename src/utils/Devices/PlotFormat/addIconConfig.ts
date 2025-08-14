import { ChartConfig } from "@/components/ui/chart"
import { HelpCircle, type LucideIcon } from "lucide-react"

// Define el tipo para el mapeo de iconos que se pasará como argumento
export type IconMapping = {
  [key: string]: LucideIcon
}

/**
 * Extiende un objeto ChartConfig con componentes de icono de Lucide React.
 * @param originalConfig El objeto ChartConfig original.
 * @param iconMap Un objeto que mapea las claves de las métricas a los componentes de icono de Lucide React.
 * @returns Un nuevo objeto ChartConfigWithIcons con la propiedad Icon añadida a cada entrada.
 */
export function addIconsToChartConfig(
  originalConfig: ChartConfig,
  iconMap: IconMapping,
  defaultIcon: LucideIcon = HelpCircle, // Ahora defaultIcon es un parámetro con un valor por defecto
): ChartConfig {
  // El tipo de retorno sigue siendo ChartConfig
  const newConfig: ChartConfig = {} as ChartConfig

  for (const key in originalConfig) {
    if (originalConfig.hasOwnProperty(key)) {
      const configEntry = originalConfig[key]
      const IconComponent = iconMap[key] || defaultIcon // Usa el icono mapeado o el por defecto

      newConfig[key] = {
        ...configEntry,
        icon: IconComponent, // Asignamos al campo 'icon' existente
      }
    }
  }
  return newConfig
}