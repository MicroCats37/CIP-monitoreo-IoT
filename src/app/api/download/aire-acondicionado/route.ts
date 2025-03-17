// app/api/aire-acondicionado/download/route.ts
import { NextResponse } from "next/server";
import { getAireAcondicionadoDownloadData } from "@/influxDB/querys-download/AireAcondicionadoDownload";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const startTime = searchParams.get("startTime");
        const endTime = searchParams.get("endTime");
        const port = searchParams.get("port");

        // Validar que los parámetros estén presentes
        if (!startTime || !endTime || !port) {
            return NextResponse.json(
                { error: "startTime, endTime y port son requeridos" },
                { status: 400 }
            );
        }

        // Obtener los datos de InfluxDB en formato CSV
        const csv = await getAireAcondicionadoDownloadData(startTime, endTime, port);

        // Devolver el archivo CSV como respuesta
        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="aire_acondicionado_datos.csv"`,
            },
        });

    } catch (error) {

        // Verificar si el error es una instancia de Error
        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message, details: error.message },
                { status: 500 }
            );
        }

        // Si no es una instancia de Error, devolver un mensaje genérico
        return NextResponse.json(
            { error: "Error generando CSV", details: "Error desconocido" },
            { status: 500 }
        );
    }
}
