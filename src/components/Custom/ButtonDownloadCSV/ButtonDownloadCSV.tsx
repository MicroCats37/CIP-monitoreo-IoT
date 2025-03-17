import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DownloadCSVButtonProps {
    endpoint: string;
    startTime: string;
    endTime: string;
    fileName: string; // Nuevo argumento para personalizar el nombre del archivo
    query?:string
}

export const ButtonDownloadCSV = ({ endpoint, startTime, endTime, fileName ,query}: DownloadCSVButtonProps) => {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        const formattedStart = startTime.replace(/[:.-]/g, "_"); // Reemplazar caracteres no válidos
        const formattedEnd = endTime.replace(/[:.-]/g, "_");

        const csvFileName = `${fileName}_${formattedStart}_to_${formattedEnd}.csv`; // Nombre descriptivo

        try {
            toast.info(`Generando archivo: ${csvFileName}...`);
        
            const response = await fetch(`/${endpoint}?startTime=${startTime}&endTime=${endTime}${query ? `&${query}` : ''}`);
        
            // Verificar si la respuesta no es exitosa
            if (!response.ok) {
                // Extraer el mensaje de error del cuerpo de la respuesta
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
        
            // Si la respuesta es exitosa, procesar el archivo
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
        
            const a = document.createElement("a");
            a.href = url;
            a.download = csvFileName;
            a.click();
        
            toast.success(`Descarga completada: ${csvFileName}`);
        } catch (error) {
            // Mostrar el mensaje de error con toast
            if (error instanceof Error) {
                toast.error(`Error en la descarga del archivo: ${error.message}`);
            } else {
                toast.error("Error en la descarga del archivo: Error desconocido");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            disabled={loading}
            className="border-2 px-4 shadow-sm transition-all hover:bg-gray-50"
            onClick={handleDownload}
        >
            <Download className="mr-2 h-5 w-5 text-gray-500" />
            <span className="font-medium">{loading ? "Descargando..." : "Descargar CSV"}</span>
        </Button>
    );
};
