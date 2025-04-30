"use client";

import Link from "next/link";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#2F3A49] text-white w-full py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Información de contacto */}
        <div className="text-center md:text-left">
          <p>Información de contacto:</p>
          <p>Correo: contacto@techsprint.com</p>
        </div>

        {/* Redes sociales */}
        <div className="flex space-x-4">
          <Link href="https://www.facebook.com" target="_blank">
            <FaFacebook className="h-6 w-6 hover:text-gray-400" />
          </Link>
          <Link href="https://www.instagram.com" target="_blank">
            <FaInstagram className="h-6 w-6 hover:text-gray-400" />
          </Link>
          <Link href="https://www.tiktok.com" target="_blank">
            <FaTiktok className="h-6 w-6 hover:text-gray-400" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
