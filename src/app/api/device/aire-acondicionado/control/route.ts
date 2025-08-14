import { NextResponse } from 'next/server';
import { ControlerAirdevice } from '@/utils/AirApiUtils/airFunctions';
import type { ControlDeviceBody } from '@/utils/AirApiUtils/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; 
export const revalidate = 0;

/** Acepta POST /api/control-device */
export async function POST(req: Request) {
  try {
    // Intentar parsear JSON
    let data: ControlDeviceBody | undefined;
    try {
      data = (await req.json()) as ControlDeviceBody;
    } catch {
      return NextResponse.json(
        { error: 'Formato JSON inválido' },
        { status: 400 }
      );
    }

    // Verificar cuerpo vacío
    if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
      return NextResponse.json(
        { error: 'El cuerpo de la solicitud no puede estar vacío' },
        { status: 400 }
      );
    }

    // Validaciones específicas
    const { controller, devid } = data as Partial<ControlDeviceBody>;
    if (!controller || !devid) {
      return NextResponse.json(
        { error: "Los campos 'controller' y 'devid' son obligatorios" },
        { status: 400 }
      );
    }

    // Procesar la solicitud
    const result = await ControlerAirdevice(data);
    return NextResponse.json({ success: true, response: result }, { status: 200 });
  } catch (error: any) {
    console.error('Error en control-device:', error);
    return NextResponse.json(
      { error: error?.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

/** Rechazar métodos no permitidos con 405 */
export async function GET() {
  return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
}
export async function PUT() {
  return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
}
export async function PATCH() {
  return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ error: 'Método no permitido' }, { status: 405 });
}

/** (Opcional) Manejar preflight CORS si lo necesitas */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'POST, OPTIONS',
      'Access-Control-Allow-Origin': '*',          // ajusta según tu caso
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}