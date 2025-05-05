'use client'

import Link  from 'next/link'
import Image from 'next/image'

import {
  FaCalendarAlt,
  FaClipboardList,
  FaListAlt,
  FaUsersCog,
  FaClipboardCheck,
} from 'react-icons/fa'

export default function AdministradorPage() {
  
  const features = [
    // { icon: <FaCalendarAlt size={75} />, label: 'Calendario' },
    // { icon: <FaListAlt size={75} />, label: 'Versiones' },
    // { icon: <FaClipboardCheck size={75} />, label: 'Gestionar inscripciones' },
    { icon: <FaClipboardList size={75} />, label: 'Lista de competidores',ruta:'/administrador/lista' },
    { icon: <FaUsersCog size={75} />, label: 'Gestionar Competencia',ruta:'/administrador/lista' },
  ]

  return (
    <main className="min-h-screen bg-gray-100">

      <section className="w-full">
        <Image
          src="/images/umss.png"
          alt="Universidad Mayor de San Simón"
          width={1200}
          height={500}
          className="w-full h-auto object-cover"
        />
      </section>

      <section className="bg-[#e4e4e4] py-10 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
        {features.map(({ icon, label,ruta }) => (
          <Link
            key={label}
            href={ruta}
            className="bg-bright-gray-300 rounded-xl p-6 w-full max-w-[220px] h-[200px] shadow hover:shadow-md 
            transition flex flex-col justify-center items-center text-center cursor-pointer hover:bg-bright-gray-400"
          >
            <div className="text-gray-800 mb-3">{icon}</div>
            <p className="font-semibold text-base text-gray-700">{label}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}
