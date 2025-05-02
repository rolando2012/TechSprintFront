'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLoginForm from './AdminLoginForm'
import TutorLoginForm from './TutorLoginForm'
import CajeroLoginForm from './CajeroLoginForm'
import CompetidorLoginForm from './CompetidorLoginForm'

type Role = 'admin' | 'tutor' | 'cajero' | 'competidor'

type Props = {
  onLogin?: () => void
  onClose: () => void
  role?: Role // ✅ Nuevo: prop opcional para mostrar directamente el login
}

export default function LoginModal({ onClose, role }: Props) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const router = useRouter()

  // Si llega una prop role, mostrar directamente ese formulario
  useEffect(() => {
    if (role) setSelectedRole(role)
  }, [role])

  const handleLogin = (role: Role) => {
    localStorage.setItem('userRole', role)
    router.push(`/${role}`)
    onClose()
  }

  // Mostrar el formulario adecuado por rol
  if (selectedRole === 'admin') {
    return <AdminLoginForm onLogin={() => handleLogin('admin')} onClose={onClose} />
  }
  if (selectedRole === 'tutor') {
    return <TutorLoginForm onLogin={() => handleLogin('tutor')} onClose={onClose} />
  }
  if (selectedRole === 'cajero') {
    return <CajeroLoginForm onLogin={() => handleLogin('cajero')} onClose={onClose} />
  }
  if (selectedRole === 'competidor') {
    return <CompetidorLoginForm onLogin={() => handleLogin('competidor')} onClose={onClose} />
  }

  // Vista inicial para elegir rol
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
                <Image
                  src={`/images/${img}`}
                  alt={label}
                  width={100}
                  height={100}
                  className="mx-auto"
                />
                <button
                  onClick={() => setSelectedRole(value as Role)}
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
