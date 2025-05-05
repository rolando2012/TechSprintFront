// app/tutor/participantes/page.tsx
import ParticipantesAsignados from '@/components/Tutor/ParticipantesAsignados'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export default async function ParticipantesPage() {
  const token = (await cookies()).get('access_token')?.value

  if (!token) {
    return <p>No autenticado</p>
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    )
    const tutorId = payload.id as string

    return (
      <div className="container mx-auto px-4 py-8">
        <ParticipantesAsignados tutorId={tutorId} />
      </div>
    )
  } catch (e) {
    return <p>Token inválido</p>
  }
}
