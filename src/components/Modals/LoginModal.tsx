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
  role?: Role
}

export default function LoginModal({ onClose, role }: Props) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (role) setSelectedRole(role)
  }, [role])

  const handleLogin = (role: Role) => {
    localStorage.setItem('userRole', role)
    router.push(`/${role}`)
    onClose()
  }

  if (selectedRole) {
    const FormComponent = {
      admin: AdminLoginForm,
      tutor: TutorLoginForm,
      cajero: CajeroLoginForm,
      competidor: CompetidorLoginForm
    }[selectedRole]
    
    return <FormComponent onLogin={() => handleLogin(selectedRole)} onClose={onClose} />
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-2 sm:px-4">
      <div className="bg-white rounded-xl md:rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg text-center overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 md:mb-8">
          ¿Cómo deseas Ingresar?
        </h2>

        <div className="bg-gray-100 rounded-lg md:rounded-xl p-4 sm:p-6 flex flex-col items-center gap-4 sm:gap-6">
          <p className="text-base sm:text-lg md:text-xl">INICIA SESIÓN COMO:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full">
            {[
              { label: 'ADMINISTRADOR', img: 'admin.svg', value: 'admin' },
              { label: 'TUTOR', img: 'tutor.svg', value: 'tutor' },
              { label: 'COMPETIDOR', img: 'competidor.svg', value: 'competidor' },
              { label: 'CAJERO', img: 'cajero.svg', value: 'cajero' },
            ].map(({ label, img, value }) => (
              <div key={value} className="text-center flex flex-col items-center">
                <Image
                  src={`/images/${img}`}
                  alt={label}
                  width={80}
                  height={80}
                  className="mx-auto w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
                />
                <button
                  onClick={() => setSelectedRole(value as Role)}
                  className="mt-2 sm:mt-4 bg-boton hover:bg-boton-hover text-white 
                            font-normal py-1.5 sm:py-2 px-4 sm:px-6 rounded-full 
                            text-xs sm:text-sm shadow cursor-pointer transition-colors
                            duration-200 whitespace-nowrap w-full max-w-[150px] 
                            text-center flex items-center justify-center"
                >
                  {label}
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 sm:mt-8 md:mt-10 bg-boton-2 hover:bg-boton-2-hover 
                  text-white py-2 sm:py-3 px-6 sm:px-8 rounded-full text-sm sm:text-base 
                  font-normal shadow-md transition-colors duration-200"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}