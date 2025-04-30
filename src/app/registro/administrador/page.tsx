"use client"; // Esta línea es necesaria para habilitar hooks como useState

import { useState } from "react";
import { adlam } from "@/config/fonts";
import Link from "next/link";
import "./globals.css";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");

  // Función para manejar el login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Aquí iría la lógica para verificar las credenciales
    if (correo !== "admin@techsprint.com" || contraseña !== "1234" || codigo !== "001") {
      setError("Credenciales incorrectas");
    } else {
      setError(""); // Limpiar cualquier mensaje de error
      alert("Bienvenido al sistema");
      // Aquí podrías redirigir al dashboard o alguna otra página
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#2C3E50]">
      <section className="w-full max-w-6xl p-6 flex flex-col sm:flex-row items-center text-white text-center gap-8">
        {/* Contenedor de texto */}
        <div className="sm:w-1/2 text-center sm:text-left">
          <h1 className={`text-2xl sm:text-3xl font-bold ${adlam.className}`}>
            Iniciar sesión como Administrador
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl mt-4">
            Ingresa tus datos para acceder al sistema de administración de TechSprint.
          </p>
        </div>
      </section>

      {/* Formulario de login con imagen y campos */}
      <section className="w-full max-w-6xl p-6 bg-white rounded-2xl shadow-lg mt-8 flex">
        {/* Imagen del administrador */}
        <div className="w-1/3 flex justify-center items-center">
          <img 
            src="/tipo_usuario/administrador.png" 
            alt="Administrador"
            className="w-60 h-60 rounded-lg border-2 " // Imagen más grande con bordes de 5px
          />
        </div>

        {/* Formulario de login */}
        <div className="w-2/3 flex flex-col justify-center px-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="w-full">
              <label htmlFor="correo" className="block text-lg font-semibold text-[#2C3E50] mb-2">
                Correo Electrónico
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6347] transition duration-200"
                placeholder="Correo Electrónico"
              />
            </div>

            <div className="w-full">
              <label htmlFor="contraseña" className="block text-lg font-semibold text-[#2C3E50] mb-2">
                Contraseña
              </label>
              <input
                id="contraseña"
                type="password"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6347] transition duration-200"
                placeholder="Contraseña"
              />
            </div>

            <div className="w-full">
              <label htmlFor="codigo" className="block text-lg font-semibold text-[#2C3E50] mb-2">
                Código de Acceso
              </label>
              <input
                id="codigo"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6347] transition duration-200"
                placeholder="Código de Acceso"
              />
            </div>

            {error && (
              <div className="text-red-500 text-center mb-4">
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#FF6347] text-white py-3 rounded-full font-semibold hover:bg-[#FF4500] transition-colors"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
