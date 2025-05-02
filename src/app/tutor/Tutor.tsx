// src/app/tutor/page.tsx
'use client'

import Image from 'next/image'
import Footer from '@/components/Footer'

export default function TutorPage() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-gray-100">
      {/* Encabezado */}
      <header className="bg-[#1f2029] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.svg" alt="Logo" width={50} height={50} />
          <span className="text-xl font-bold">TechSprint</span>
        </div>
        <div className="flex items-center gap-4">
          <button>
            <Image src="/icons/bell.svg" alt="Notificaciones" width={24} height={24} />
          </button>
          <button>
            <Image src="/icons/user.svg" alt="Perfil" width={28} height={28} />
          </button>
        </div>
      </header>

      {/* Menú de navegación */}
      <nav className="bg-[#2f313d] text-white px-6 py-2 flex gap-6 font-semibold">
        <button className="hover:text-cyan-400">Inicio</button>
        <button className="hover:text-cyan-400">Participantes asignados</button>
        <button className="hover:text-cyan-400">Validar Inscripciones</button>
        <button className="hover:text-cyan-400">Proceso de inscripciones</button>
      </nav>

      {/* Contenido principal */}
      <section className="flex-1 px-4 py-6 bg-white">
        <div className="w-full max-w-5xl mx-auto">
          <Image
            src="/images/umss.jpg"
            alt="Universidad Mayor de San Simón"
            width={1200}
            height={500}
            className="rounded-xl mb-8"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-200 text-center py-4 rounded-lg shadow">
              <Image src="/icons/folder.svg" alt="Participantes" width={40} height={40} className="mx-auto" />
              <p className="font-semibold mt-2">Participantes asignados</p>
            </div>
            <div className="bg-gray-200 text-center py-4 rounded-lg shadow">
              <Image src="/icons/checklist.svg" alt="Validar" width={40} height={40} className="mx-auto" />
              <p className="font-semibold mt-2">Validar inscripciones</p>
            </div>
            <div className="bg-gray-200 text-center py-4 rounded-lg shadow">
              <Image src="/icons/process.svg" alt="Proceso" width={40} height={40} className="mx-auto" />
              <p className="font-semibold mt-2">Proceso de inscripciones</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}