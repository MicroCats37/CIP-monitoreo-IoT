import { usePathname, notFound } from "next/navigation";
import { pageData, pagesByPath } from "@/utils/Devices/Data/data.pages.monitoreo";

export function useValidPageData(id?: string) {
  const pathname = usePathname();

  // Determinar basePath
  let basePath = "";
  if (pagesByPath[pathname!]) {
    basePath = pathname!;
  } else {
    basePath = pathname!.split("/").slice(0, -1).join("/");
  }

  const config = pagesByPath[basePath];

  // Si no hay configuración, la ruta no existe
  if (!config) notFound();

  // Validación basada en presence of ID
  if (config.validIds) {
    if (!id || !config.validIds.includes(id)) notFound();
  } else {
    if (id) notFound();
  }

  // Obtener la data desde pageData
  const fullPath = id ? `${basePath}/${id}` : basePath;
  const data = pageData[fullPath];

  if (!data) notFound();

  return data;
}
