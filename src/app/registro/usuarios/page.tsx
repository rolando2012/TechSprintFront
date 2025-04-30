"use client"; // Esta línea es necesaria para habilitar hooks como useState

import { useState } from "react";
import { adlam } from "@/config/fonts";
import Link from "next/link";
import "./globals.css";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");

  // Función para manejar el login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aquí iría la lógica para verificar las credenciales
    if (usuario !== "admin" || contraseña !== "1234") {
      setError("Credenciales incorrectas");
    } else {
      setError(""); // Limpiar cualquier mensaje de error
      alert("Bienvenido al sistema");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#2C3E50]">
      <section className="w-full max-w-6xl p-6 flex flex-col sm:flex-row items-center text-white text-center gap-8">
        {/* Contenedor de texto */}
        <div className="sm:w-1/2 text-center sm:text-left">
          <h1 className={`text-4xl sm:text-5xl font-bold ${adlam.className}`}>
            Iniciar sesión
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl mt-4">
            Ingresa tus datos para acceder a tu cuenta y comenzar a competir en TechSprint.
          </p>
        </div>
      </section>

      {/* Apartados para elegir el tipo de usuario */}
      <section className="w-full max-w-7xl p-6 bg-white rounded-2xl shadow-lg mt-8">
        <div className="flex justify-center gap-6 mb-8">
          {/* Apartado Administrador */}
          <div className="w-1/4 text-center p-4 bg-gray-100 rounded-lg shadow-lg">
            <img 
              src="/tipo_usuario/administrador.png" 
              alt="Administrador"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Administrador</h3>
            <Link href="/registro/administrador" className="text-boton hover:text-boton-hover block mt-4">
              Regístrate como Administrador
            </Link>
          </div>

          {/* Apartado Tutor */}
          <div className="w-1/4 text-center p-4 bg-gray-100 rounded-lg shadow-lg">
            <img 
              src="/tipo_usuario/tutor.png" 
              alt="Tutor"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Tutor</h3>
            <Link href="/registro/tutor" className="text-boton hover:text-boton-hover block mt-4">
              Regístrate como Tutor
            </Link>
          </div>

          {/* Apartado Competidor */}
          <div className="w-1/4 text-center p-4 bg-gray-100 rounded-lg shadow-lg">
            <img 
              src="/tipo_usuario/competidor.png" 
              alt="Competidor"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Competidor</h3>
            <Link href="/registro/competidor" className="text-boton hover:text-boton-hover block mt-4">
              Regístrate como Competidor
            </Link>
          </div>

          {/* Apartado Cajero */}
          <div className="w-1/4 text-center p-4 bg-gray-100 rounded-lg shadow-lg">
            <img 
              src="/tipo_usuario/cajero.png" 
              alt="Cajero"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Cajero</h3>
            <Link href="/registro/cajero" className="text-boton hover:text-boton-hover block mt-4">
              Regístrate como Cajero
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
