"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/solid";
import { adlam } from "@/config/fonts";

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null); // Estado para el rol seleccionado
  const loginMenuRef = useRef<HTMLDivElement>(null); // Para referenciar la ventana flotante

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleLoginMenu = () => {
    setLoginMenuOpen(!loginMenuOpen);
  };

  // Cerrar la ventana flotante si el usuario hace clic fuera de ella
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginMenuOpen && loginMenuRef.current && !loginMenuRef.current.contains(event.target as Node)) {
        setLoginMenuOpen(false);
        setSelectedRole(null); // Resetear el rol seleccionado
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [loginMenuOpen]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setLoginMenuOpen(true); // Cerrar el menú de selección de rol y abrir el formulario
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null); // Volver al menú de selección de rol
  };

  return (
    <nav className="bg-[#2F3A49] text-white w-full shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image
            src="/logo/TechSprint.png"
            alt="TechSprint Logo"
            width={60}
            height={60}
          />
          <span className={`text-lg font-bold ${adlam.className}`}>TechSprint</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={toggleLoginMenu}
            className="bg-white text-[#2F3A49] px-4 py-2 rounded-full font-semibold hover:bg-[#3A4A5A] transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu}>
            <Bars3BottomLeftIcon className="h-7 w-7" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="px-4 pb-4 md:hidden flex flex-col gap-3">
          <button
            onClick={toggleLoginMenu}
            className="bg-white text-[#2F3A49] px-4 py-2 rounded-full font-semibold text-center hover:bg-[#3A4A5A] transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>
      )}

      {/* Login Menu (Selección de rol) */}
      {loginMenuOpen && !selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-center">
          <div
            ref={loginMenuRef}
            className="bg-gradient-to-r from-[#2F3A49] to-[#4F5B66] p-6 rounded-lg shadow-xl w-11/12 max-w-5xl flex flex-col justify-between"
          >
            <div className="flex justify-between items-center text-white">
              <h3 className="text-xl font-semibold">Selecciona tu rol</h3>
              <button
                onClick={toggleLoginMenu}
                className="text-2xl font-semibold text-white hover:text-[#FF6347] transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="mt-4 flex justify-center gap-10 flex-wrap">
              {[ 
                { role: "Administrador", icon: "/tipo_usuario/administrador.png" },
                { role: "Tutor", icon: "/tipo_usuario/tutor.png" },
                { role: "Competidor", icon: "/tipo_usuario/competidor.png" },
                { role: "Cajero", icon: "/tipo_usuario/cajero.png" },
              ].map(({ role, icon }) => (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)} // Establecer el rol seleccionado
                  className="text-center p-8 bg-white rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300 w-40"
                >
                  <Image src={icon} alt={role} width={70} height={70} className="mx-auto" />
                  <p className="mt-2 font-semibold text-[#2F3A49]">{role}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Formulario de Login según el rol seleccionado */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 flex justify-center items-center">
          <div
            ref={loginMenuRef}
            className="bg-gradient-to-r from-[#2F3A49] to-[#4F5B66] p-6 rounded-lg shadow-xl w-11/12 max-w-5xl flex h-auto"
          >
            <div className="flex-none w-1/3">
              <Image
                src={`/tipo_usuario/${selectedRole.toLowerCase()}.png`}
                alt={selectedRole}
                width={150}
                height={150}
                className="mx-auto"
              />
            </div>
            <div className="flex-1 ml-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Iniciar sesión como {selectedRole}
              </h3>
              <h3 className="text-xl font-semibold text-white mb-4">
                Iniciar sesión como {selectedRole}
              </h3>
              <form className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  className="p-2 rounded-md"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="p-2 rounded-md"
                />
                <button className="bg-[#FF6347] text-white py-2 px-4 rounded-full hover:bg-[#FF4500] transition-colors">
                  Iniciar sesión
                </button>
              </form>
              <button
                onClick={handleBackToRoleSelection} // Volver al menú de selección de rol
                className="mt-4 bg-[#FF6347] text-white py-2 px-4 rounded-full hover:bg-[#FF4500] transition-colors"
              >
                Volver a seleccionar rol
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
