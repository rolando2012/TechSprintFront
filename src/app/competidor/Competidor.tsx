"use client"

import Footer from "@/components/Footer"
import Image from "next/image"
import Link from "next/link"
import { Bell, UserCircle } from "lucide-react"

export default function CompetidorDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-[#1f2029] text-white px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image src="/images/logo.svg" alt="Logo" width={50} height={50} />
          <span className="text-xl font-semibold">TechSprint</span>
        </div>
        <div className="flex items-center gap-4 text-white">
          <Bell className="w-6 h-6" />
          <UserCircle className="w-7 h-7" />
        </div>
      </header>

      {/* Navbar */}
      <nav className="bg-[#333842] text-white px-4 py-2 flex gap-6 text-sm font-semibold">
        <Link href="#" className="hover:underline text-white">
          Inicio
        </Link>
        <Link href="#" className="hover:underline text-white">
          Ver Competencias
        </Link>
        <Link href="#" className="hover:underline text-white">
          Resultados
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 flex flex-col items-center">
        <Image
          src="/images/umss.png"
          alt="UMSS"
          width={800}
          height={400}
          className="rounded-lg shadow mb-6"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <Link
            href="#"
            className="bg-gray-200 p-6 text-center rounded-lg shadow hover:bg-gray-300"
          >
            <Image
              src="/images/calendario.png"
              alt="Calendario"
              width={60}
              height={60}
              className="mx-auto mb-2"
            />
            <p className="font-semibold">Calendario</p>
          </Link>
          <Link
            href="#"
            className="bg-gray-200 p-6 text-center rounded-lg shadow hover:bg-gray-300"
          >
            <Image
              src="/images/versiones.png"
              alt="Versiones"
              width={60}
              height={60}
              className="mx-auto mb-2"
            />
            <p className="font-semibold">Versiones</p>
          </Link>
          <Link
            href="#"
            className="bg-gray-200 p-6 text-center rounded-lg shadow hover:bg-gray-300"
          >
            <Image
              src="/images/resultados.png"
              alt="Resultados"
              width={60}
              height={60}
              className="mx-auto mb-2"
            />
            <p className="font-semibold">Resultados</p>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}
