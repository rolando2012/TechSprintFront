'use client'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLoginForm from './AdminLoginForm'
import TutorLoginForm from './TutorLoginForm'
import CajeroLoginForm from './CajeroLoginForm'
import CompetidorLoginForm from './CompetidorLoginForm'

type Props = {
  onClose: () => void
}

export default function LoginModal({ onClose }: Props) {
  const [selectedRole, setSelectedRole] = useState<
    'admin' | 'tutor' | 'cajero' | 'competidor' | null
  >(null)

  const router = useRouter()

  // Simula login y redirige por rol
  const handleLogin = (role: typeof selectedRole) => {
    if (!role) return
    localStorage.setItem('userRole', role)
    router.push(`/${role}`)
    onClose()
  }

  // Renderiza formulario específico
  if (selectedRole === 'admin') return <AdminLoginForm onLogin={() => handleLogin('admin')} />
  if (selectedRole === 'tutor') return <TutorLoginForm onLogin={() => handleLogin('tutor')} />
  if (selectedRole === 'cajero') return <CajeroLoginForm onLogin={() => handleLogin('cajero')} />
  if (selectedRole === 'competidor') return <CompetidorLoginForm onLogin={() => handleLogin('competidor')} />

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl p-10 shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-8">¿Cómo deseas Ingresar?</h2>

        <div className="bg-gray-100 rounded-xl p-6 flex flex-col items-center gap-6">
          <p className="text-lg font-semibold">INICIA SESIÓN COMO:</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { label: 'ADMINISTRADOR', img: 'admin.png', value: 'admin' },
              { label: 'TUTOR', img: 'tutor.png', value: 'tutor' },
              { label: 'COMPETIDOR', img: 'competidor.png', value: 'competidor' },
              { label: 'CAJERO', img: 'cajero.png', value: 'cajero' },
            ].map(({ label, img, value }) => (
              <div key={value} className="text-center">
                <Image src={`/images/${img}`} alt={label} width={100} height={100} className="mx-auto" />
                <button
                  onClick={() => setSelectedRole(value as any)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg text-sm shadow"
                >
                  {label}
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-10 bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-full text-base font-semibold shadow-md"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
