import ConsultaEstadoPage from '@/components/Tutor/ConsultaEstadoPage';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export default async function ConsultaPage() {
  const token = (await cookies()).get('access_token')?.value;

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No autenticado</h2>
          <p className="text-gray-600">Debes iniciar sesión para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    const tutorId = payload.id as string;

    return (
      <div className=" mx-auto">
        <ConsultaEstadoPage tutorId={tutorId} />
      </div>
    );
  } catch (e) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Token inválido</h2>
          <p className="text-gray-600">Tu sesión ha expirado. Por favor, inicia sesión nuevamente.</p>
        </div>
      </div>
    );
  }
}