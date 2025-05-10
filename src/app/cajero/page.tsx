'use client'

import Image from 'next/image'

import {
  FaMoneyCheckAlt,
  FaCashRegister,
  FaHistory,
} from 'react-icons/fa'

export default function CajeroPage() {
  const options = [
    { icon: <FaMoneyCheckAlt size={70} />, label: 'Pagos pendientes' },
    { icon: <FaCashRegister size={70} />, label: 'Registrar pagos' },
    { icon: <FaHistory size={70} />, label: 'Historial de pagos' },
  ]

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">

      {/* Imagen de encabezado */}
      <section className="w-full">
        <Image
          src="/images/umss.svg"
          alt="Universidad Mayor de San Simón"
          width={1200}
          height={500}
          className="w-full h-auto object-cover"
          priority
        />
      </section>

      {/* Opciones del cajero */}
      <section className="bg-gray-200 py-10 px-4 flex flex-col md:flex-row justify-center gap-8 flex-wrap">
        {options.map(({ icon, label }) => (
          <div
            key={label}
            className="bg-[#B4B9C5] rounded-xl p-6 w-full max-w-[220px] flex flex-col items-center shadow hover:shadow-md transition text-center"
          >
            <div className="text-6xl mb-4 text-gray-800">{icon}</div>
            <p className="font-semibold text-gray-800">{label}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
