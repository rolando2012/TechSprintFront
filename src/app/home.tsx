'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { adlam, inter } from '@/config/fonts'
import LoginModal from '@/components/Modals/LoginModal'

type Role = 'admin' | 'tutor' | 'competidor' | 'cajero'

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const handleOpenLogin = (role: Role) => {
    setSelectedRole(role)
    setShowModal(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">

      <main className="flex-1 flex flex-col gap-24">
        {/* Bienvenida */}
        <section className="bg-bright-gray-700 text-white px-6 py-12 flex flex-col md:flex-row gap-10 items-center w-full">
          <div className="container max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <Image
              src="/images/competencia.svg"
              alt="Competencia"
              width={600}
              height={400}
              className="rounded-xl shadow-lg"
              priority
            />
            <div className="max-w-xl">
              <h1 className={`${inter.className} text-4xl text-center font-bold mb-6`}>¡Bienvenido a TechSprint!</h1>
              <p className={`${inter.className} text-center mb-4 text-lg`}>
                TechSprint es el punto de partida para los futuros innovadores. Nuestra plataforma reúne a estudiantes,
                docentes y entusiastas de la tecnología en un espacio donde la pasión por el conocimiento se convierte en acción.
              </p>
              <p className={`${inter.className} text-center mb-6 text-lg`}>
                Participá en competencias emocionantes de Matemáticas, Robótica, Computación, Astronomía y mucho más.
                🌟 ¡Inscribite. Compite. Superate! {' '}
              </p>
              <div className="flex justify-center">
              <Link
                href="/registro/competidor/datos-personales"
                className={`bg-boton hover:bg-boton-hover text-white ${adlam.className} 
                            text-lg font-semibold px-6 py-3 rounded-full `}
              >
                Comienza el desafío
              </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Sección Roles */}
        <section className="bg-gray-100 py-16 w-full">
          <div className="container max-w-screen-xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-center mb-10">INICIA SESIÓN COMO:</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
              {[
                { label: 'ADMINISTRADOR', img: 'admin.svg', value: 'admin' },
                { label: 'TUTOR', img: 'tutor.svg', value: 'tutor' },
                { label: 'COMPETIDOR', img: 'competidor.svg', value: 'competidor' },
                { label: 'CAJERO', img: 'cajero.svg', value: 'cajero' },
              ].map(({ label, img, value }) => (
                <div key={value}>
                  <Image src={`/images/${img}`} alt={label} width={100} height={100} className="mx-auto" />
                  <button
                    onClick={() => handleOpenLogin(value as Role)}
                    className="mt-4 bg-boton text-white px-6 py-3 text-sm font-bold rounded-full hover:bg-boton-hover transition "
                  >
                    {label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Noticias */}
        <section className="bg-[#434854] text-white py-16 w-full">
          <div className="container max-w-screen-xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-10">NOTICIAS</h2>
            <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">PERIODO DE INSCRIPCIÓN</h3>
                <p className="mb-4">del 1 al 31 de Abril 2025</p>
                <Image src="/images/calendario.svg" alt="Calendario" width={250} height={200} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">CONVOCATORIA</h3>
                <Image src="/images/convocatoria.svg" alt="Convocatoria" width={250} height={200} />
                <a
                  href="/descargas/convocatoria.pdf"
                  download
                  className="inline-block mt-4 bg-boton text-white px-5 py-2 rounded-full hover:bg-boton-hover transition"
                >
                  Descargar PDF
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Áreas */}
        <section className="bg-white py-16 w-full">
          <div className="container max-w-screen-xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-10">NUESTRAS ÁREAS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {[
                { label: 'MATEMÁTICA', img: 'matematica.svg' },
                { label: 'ROBÓTICA', img: 'robotica.svg' },
                { label: 'COMPUTACIÓN', img: 'computacion.svg' },
                { label: 'ASTRONOMÍA', img: 'astronomia.svg' },
              ].map(({ label, img }) => (
                <div key={label} className="text-center">
                  <Image src={`/images/${img}`} alt={label} width={350} height={200} className="mx-auto rounded-md" />
                  <p className="mt-4 text-lg">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      {/* Modal de Login */}
      {showModal && selectedRole && (
        <LoginModal
          role={selectedRole}
          onClose={() => {
            setShowModal(false)
            setSelectedRole(null)
          }}
        />
      )}
    </div>
  )
}
