'use client'

import Image from 'next/image'
import { FaUserCheck, FaCheckCircle, FaFileSignature } from 'react-icons/fa'
import { SiSearxng } from "react-icons/si";
import Link from 'next/link'

export default function TutorPage() {
  const options = [
    { icon: <FaUserCheck size={70} />, label: 'Participantes asignados',ruta:'/tutor/competidores' },
    { icon: <FaCheckCircle size={70} />, label: 'Validar inscripciones',ruta:'/tutor/validar' },
    { icon: <SiSearxng size={70} />, label: 'Consultar estado competidor',ruta:'/tutor/consulta' },
  ]

  return (
    <>
      <main className="min-h-screen bg-gray-100">
        {/* Imagen UMSS */}
        <section className="w-full">
          <Image
            src="/images/umss.svg"
            alt="Universidad Mayor de San Simón"
            width={1200}
            height={500}
            className="w-full h-auto object-cover"
          />
        </section>

        {/* Opciones del Tutor */}
        <section className="bg-gray-200 py-10 px-4 flex flex-col md:flex-row justify-center gap-8">
          {options.map(({ icon, label,ruta }) => (
            <Link
              href={ruta}
              key={label}
              className="bg-bright-gray-300  rounded-xl p-6 w-full max-w-[220px] flex flex-col items-center 
                  shadow hover:shadow-md transition cursor-pointer hover:bg-bright-gray-400 
                  transition-all transform hover:scale-105 active:scale-95"
            >
              <div className="text-6xl mb-4 text-gray-800">{icon}</div>
              <p className="font-semibold text-center text-gray-800">{label}</p>
            </Link>
          ))}
        </section>
      </main>
    </>
  )
}
