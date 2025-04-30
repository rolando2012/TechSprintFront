"use client";

import { adlam } from "@/config/fonts";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from 'react';

export default function Home() {

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#2C3E50]">
      {/* HERO SECTION */}
      <section className="w-full max-w-7xl p-6 flex flex-col sm:flex-row items-center text-white text-center gap-8">
        {/* Contenedor de imagen */}
        <div className="sm:w-1/2">
          <Image
            src="/logo/inicio.png"
            alt="Evento TechSprint"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg mx-auto sm:mx-0"
          />
        </div>

        {/* Contenedor de texto y botones */}
        <div className="sm:w-1/2 text-center sm:text-left">
          <h1 className={`text-4xl sm:text-5xl font-bold ${adlam.className}`}>
            ¡Bienvenido a TechSprint!
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl mt-4">
            TechSprint es el punto de partida para los futuros innovadores. Nuestra plataforma reúne a estudiantes, docentes y entusiastas de la tecnología en un espacio donde la pasión por el conocimiento se convierte en acción. Participá en competencias emocionantes de Matemáticas, Robótica, Computación, Astronomía y mucho más. Cada desafío está diseñado para despertar tu curiosidad, potenciar tus habilidades y conectar con una comunidad que comparte tu mismo espíritu competitivo y creativo. 🌟
            Inscribite. Compite. Superate. ¡La tecnología te está esperando!
          </p>

          {/* Botones de enlace */}
          <div className="mt-6 text-center">
            <Link
              href="/registro/competidor/datos-personales"
              className="bg-boton hover:bg-boton-hover text-white font-semibold py-3 px-6 rounded-full transition-transform transform hover:scale-105 inline-block mr-4"
            >
              Comienza el desafío
            </Link>
          </div>
        </div>
      </section>

      {/* ROLES SECTION */}
      <section className="w-full max-w-6xl bg-white p-10 rounded-2xl shadow-lg mt-16 grid grid-cols-1 sm:grid-cols-4 gap-8 text-center">
        {[ 
          { role: "Administrador", icon: "/tipo_usuario/administrador.png" },
          { role: "Tutor", icon: "/tipo_usuario/tutor.png" },
          { role: "Competidor", icon: "/tipo_usuario/competidor.png" },
          { role: "Cajero", icon: "/tipo_usuario/cajero.png" },
        ].map(({ role, icon }) => (
          <div key={role} className="flex flex-col items-center gap-2">
            <Image src={icon} alt={role} width={64} height={64} />
            <span className="font-semibold">{role}</span>
          </div>
        ))}
      </section>

      {/* NOTICIAS SECTION */}
      <section className="w-full max-w-6xl text-white mt-20 p-6">
        <h2 className="text-3xl font-bold mb-8 text-center">NOTICIAS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 text-black text-center">
            <h3 className="text-2xl font-bold mb-4">PERIODO DE INSCRIPCIÓN</h3>
            <Image src="/logo/calendario.png" alt="Calendario" width={400} height={400} className="mx-auto" />
          </div>
          <div className="bg-white rounded-2xl p-6 text-black flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4">CONVOCATORIA</h3>
            <Image src="/logo/convocatoria.png" alt="Convocatoria" width={300} height={300} className="mb-4" />
            <button className="bg-boton hover:bg-boton-hover text-white py-2 px-4 rounded-full">
              Descargar PDF
            </button>
          </div>
        </div>
      </section>

      <h2 className="text-3xl font-bold text-white text-center">NUESTRAS AREAS</h2>
      {/* ÁREAS SECTION */}
      <section className="w-full max-w-6xl bg-white mt-5 p-10 rounded-2xl shadow-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
        
        {[ 
          { name: "MATEMÁTICA", img: "/img/matematica.jpg" },
          { name: "ROBÓTICA", img: "/img/robotica.jpg" },
          { name: "COMPUTACIÓN", img: "/img/computacion.jpg" },
          { name: "ASTRONOMÍA", img: "/img/astronomia.jpg" },
        ].map(({ name, img }) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <Image src={img} alt={name} width={200} height={150} className="rounded-lg" />
            <span className="font-semibold">{name}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
