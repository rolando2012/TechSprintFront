'use client'

import Image from 'next/image'
import { FaInfoCircle, FaFileAlt, FaCalendarAlt } from 'react-icons/fa'

export default function CompetidorPage() {
  const options = [
    { icon: <FaInfoCircle size={70} />, label: 'Informacion general' },
    { icon: <FaFileAlt size={70} />, label: 'Registro para competencia' },
    { icon: <FaCalendarAlt size={70} />, label: 'Calendario' },
  ]

  return (
    <>
      <main className="min-h-screen bg-gray-100">
        {/* Imagen UMSS */}
        <section className="w-full">
          <Image
            src="/images/umss.png"
            alt="Universidad Mayor de San Simón"
            width={1200}
            height={500}
            className="w-full h-auto object-cover"
          />
        </section>

        {/* Opciones del Competidor */}
        <section className="bg-gray-200 py-10 px-4 flex flex-col md:flex-row justify-center gap-8">
          {options.map(({ icon, label }) => (
            <div
              key={label}
              className="bg-[#B4B9C5] rounded-xl p-6 w-full max-w-[220px] flex flex-col items-center shadow hover:shadow-md transition"
            >
              <div className="text-6xl mb-4 text-gray-800">{icon}</div>
              <p className="font-semibold text-center text-gray-800">{label}</p>
            </div>
          ))}
        </section>
      </main>
    </>
  )
}
