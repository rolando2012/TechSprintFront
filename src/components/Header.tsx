'use client'
import Image from 'next/image'
import { useState } from 'react'
import LoginModal from '@/components/Modals/LoginModal';
import {inter} from '@/config/fonts'

const Header = () => {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <header className="relative bg-bright-gray-900 text-white px-4 md:px-12 py-6 md:py-10 flex items-center justify-between h-auto md:h-[150px]">
        {/* Fondo de aros olímpicos */}
        <div className="absolute inset-0 z-0 opacity-100 flex justify-center items-center">
          <div className="relative w-full max-w-[300px] md:max-w-[750px] h-[80px] md:h-[150px]">
            <Image
              src="/images/aros.png"
              alt="Aros Olímpicos"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Logo + nombre */}
        <div className="relative z-10 flex items-center gap-2 md:gap-5 flex-shrink-0">
          <Image
            src="/images/logo.svg"
            alt="Logo TechSprint"
            width={120}
            height={120}
            className="w-[60px] md:w-[200px]"
            priority
          />
          <span className="text-lg md:text-3xl tracking-wide">TechSprint</span>
        </div>

        {/* Botón de inicio de sesión - Versión Responsive Mejorada */}
        <button
          onClick={() => setShowModal(true)}
          className={`relative z-10 bg-white text-black 
            text-xs xs:text-sm sm:text-base 
            px-3 xs:px-4 sm:px-6 
            py-1.5 xs:py-2 sm:py-3 
            rounded-full hover:bg-gray-200 font-semibold 
            transition-all duration-200 shadow 
            cursor-pointer whitespace-nowrap
            ${inter.className}
            transform hover:scale-105 active:scale-95`}
        >
          Iniciar Sesión
        </button>
      </header>

      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </>
  )
}

export default Header