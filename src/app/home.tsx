// src/app/page.tsx
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { adlam } from '@/config/fonts'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Header />

      <main className="flex-1 flex flex-col gap-24">
        {/* Sección Bienvenida */}
        <section className="bg-[#434854] text-white px-6 py-12 flex flex-col md:flex-row gap-10 items-center w-full">
          <div className="container max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <Image
              src="/images/competencia.png"
              alt="Competencia"
              width={600}
              height={400}
              className="rounded-xl shadow-lg"
              priority
            />
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold mb-6">¡Bienvenido a TechSprint!</h1>
              <p className="mb-4 text-lg">
                TechSprint es el punto de partida para los futuros innovadores. Nuestra plataforma reúne a estudiantes,
                docentes y entusiastas de la tecnología en un espacio donde la pasión por el conocimiento se convierte en acción.
              </p>
              <p className="mb-6 text-lg">
                Participá en competencias emocionantes de Matemáticas, Robótica, Computación, Astronomía y mucho más.{' '}
                <span className="font-semibold">🌟 ¡Inscribite. Compite. Superate!</span>
              </p>
              <Link
                href="/registro/competidor/datos-personales"
                className={`bg-boton hover:bg-boton-hover text-white ${adlam.className} text-lg font-semibold px-6 py-3 rounded-full`}
              >
                Comienza el desafío
              </Link>
            </div>
          </div>
        </section>

        {/* Sección Roles */}
        <section className="bg-gray-100 py-16 w-full">
          <div className="container max-w-screen-xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-center mb-10">INICIA SESIÓN COMO:</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
              {[
                { label: 'ADMINISTRADOR', img: 'admin.png' },
                { label: 'TUTOR', img: 'tutor.png' },
                { label: 'COMPETIDOR', img: 'competidor.png' },
                { label: 'CAJERO', img: 'cajero.png' },
              ].map(({ label, img }) => (
                <div key={label}>
                  <Image src={`/images/${img}`} alt={label} width={100} height={100} className="mx-auto" />
                  <button className="mt-4 bg-blue-500 text-white px-6 py-3 text-sm font-bold rounded-md hover:bg-blue-600 transition">
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
                <Image src="/images/calendario.png" alt="Calendario" width={250} height={200} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">CONVOCATORIA</h3>
                <Image src="/images/convocatoria.png" alt="Convocatoria" width={250} height={200} />
                <a
                  href="/descargas/convocatoria.pdf"
                  download
                  className="inline-block mt-4 bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600"
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
                { label: 'MATEMÁTICA', img: 'matematica.png' },
                { label: 'ROBÓTICA', img: 'robotica.png' },
                { label: 'COMPUTACIÓN', img: 'computacion.png' },
                { label: 'ASTRONOMÍA', img: 'astronomia.png' },
              ].map(({ label, img }) => (
                <div key={label} className="text-center">
                  <Image src={`/images/${img}`} alt={label} width={350} height={200} className="mx-auto rounded-md" />
                  <p className="mt-4 font-semibold text-lg">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}