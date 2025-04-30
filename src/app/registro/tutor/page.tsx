"use client";

import Link from "next/link";
import Image from "next/image";
import { adlam } from "@/config/fonts";
import "./globals.css";

export default function Tutor() {
  return (
    <div className="flex flex-col min-h-screen bg-[#2C3E50]">
      
      {/* Menú */}
      <div className="bg-gray-800 flex justify-center gap-8 py-2">
        <Link href="#" className="text-white font-semibold hover:text-gray-300">Inicio</Link>
        <Link href="/registro/tutor/participantes_asignados" className="text-white font-semibold hover:text-gray-300">Participantes asignados</Link>
        <Link href="#" className="text-white font-semibold hover:text-gray-300">Validar inscripciones</Link>
        <Link href="#" className="text-white font-semibold hover:text-gray-300">Proceso de inscripciones</Link>
      </div>

      {/* Banner */}
      <div className="relative w-full h-[700px]">
        <Image
          src="/imgs_tutor/umss.png"
          alt="Banner Universidad"
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Secciones principales */}
      <section className="bg-gray-100 py-12 px-6 flex flex-col items-center gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          
          {/* Participantes asignados */}
          <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md">
            <Image src="/iconos/participantes.png" alt="Participantes" width={60} height={60} />
            <h3 className="mt-4 font-bold text-xl text-gray-800">Participantes asignados</h3>
          </div>

          {/* Validar inscripciones */}
          <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md">
            <Image src="/iconos/validar.png" alt="Validar" width={60} height={60} />
            <h3 className="mt-4 font-bold text-xl text-gray-800">Validar inscripciones</h3>
          </div>

          {/* Proceso de inscripciones */}
          <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md">
            <Image src="/iconos/proceso.png" alt="Proceso" width={60} height={60} />
            <h3 className="mt-4 font-bold text-xl text-gray-800">Proceso de inscripciones</h3>
          </div>

        </div>
      </section>

    </div>
  );
}
