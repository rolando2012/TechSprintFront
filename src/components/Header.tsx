'use client'
import Image from 'next/image'
import { useState } from 'react'
import LoginModal from '@/components/Modals/LoginModal';

const Header = () => {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <header className="relative bg-[#1f2029] text-white px-12 py-10 flex items-center justify-between overflow-hidden h-[150px]">
        {/* Fondo de aros olímpicos */}
        <div className="absolute inset-0 z-0 opacity-100 flex justify-center items-center">
          <div className="relative w-[750px] h-[150px]">
            <Image
              src="/images/aros.png"
              alt="Aros Olímpicos"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Logo + nombre */}
        <div className="relative z-10 flex items-center gap-5">
          <Image
            src="/images/logo.svg"
            alt="Logo TechSprint"
            width={200}
            height={200}
            priority
          />
          <span className="text-3xl font-bold tracking-wide">TechSprint</span>
        </div>

        {/* Botón de inicio de sesión */}
        <button
          onClick={() => setShowModal(true)}
          className="relative z-10 bg-white text-black text-base px-6 py-3 rounded-full hover:bg-gray-200 font-semibold transition shadow"
        >
          Iniciar Sesion
        </button>
      </header>

      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </>
  )
}

export default Header
