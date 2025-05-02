'use client'

import Image from 'next/image'
import Footer from '@/components/Footer'
import { Bell, UserCircle2 } from 'lucide-react'

const CajeroPage = () => {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      {/* Encabezado */}
      <header className="bg-[#1F2029] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/images/logo.svg" alt="Logo" width={50} height={50} />
          <span className="text-white text-lg font-bold">TechSprint</span>
        </div>
        <div className="flex gap-4">
          <Bell color="white" size={28} />
          <UserCircle2 color="white" size={28} />
        </div>
      </header>

      {/* Navegación */}
      <nav className="bg-[#3E4049] text-white px-4 py-2 flex gap-6 font-semibold text-sm">
        <button className="px-2 py-1 bg-white text-black rounded">Inicio</button>
        <button>Pagos pendientes</button>
        <button>Registrar pagos</button>
        <button>Historial de pagos</button>
      </nav>

      {/* Imagen UMSS */}
      <div className="w-full">
        <Image
          src="/images/umss.jpg"
          alt="UMSS"
          width={1920}
          height={1080}
          className="w-full object-cover"
        />
      </div>

      {/* Opciones Cajero */}
      <section className="bg-[#ECECEC] py-8 flex justify-center gap-10">
        <div className="flex flex-col items-center">
          <Image src="/images/pagos.png" alt="Pagos pendientes" width={50} height={50} />
          <p className="font-semibold mt-2 text-sm text-center">Pagos pendientes</p>
        </div>
        <div className="flex flex-col items-center">
          <Image src="/images/registrar.png" alt="Registrar pagos" width={50} height={50} />
          <p className="font-semibold mt-2 text-sm text-center">Registrar pagos</p>
        </div>
        <div className="flex flex-col items-center">
          <Image src="/images/historial.png" alt="Historial de pagos" width={50} height={50} />
          <p className="font-semibold mt-2 text-sm text-center">Historial de pagos</p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}

export default CajeroPage
