'use client'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  onClose: () => void
  onLogin: () => void
}

export default function TutorLoginForm({ onClose }: Props) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulación de login exitoso
    router.push('/tutor')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-[#e2e5ea] rounded-2xl w-full max-w-3xl p-10 shadow-lg relative">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Bienvenido al servicio TechSprint para Tutor(es)
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Imagen del tutor */}
          <Image
            src="/images/tutor.png"
            alt="Tutor"
            width={200}
            height={200}
            className="object-contain"
          />

          {/* Formulario */}
          <form className="flex-1 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-800 font-normal mb-1">Correo:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Example@something.domain"
                className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-normal mb-1">Contraseña:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="************"
                className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-normal mb-1">Código:</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="CodTutor123"
                className="w-full px-4 py-2 rounded-md bg-white border border-gray-300 focus:outline-none"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-between pt-4">
              <button
                type="submit"
                className="bg-boton hover:bg-boton-hover text-white font-normal py-2 px-6 rounded-full cursor-pointer"
              >
                Ingresar
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-boton-2 hover:bg-boton-2-hover text-white font-normal py-2 px-6 rounded-full cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
