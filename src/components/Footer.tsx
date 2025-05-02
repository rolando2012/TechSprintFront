'use client'
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaTelegram,
  FaTiktok,
} from 'react-icons/fa6'

const Footer = () => {
  return (
    <footer className="bg-[#434854] text-white px-10 py-12 flex flex-col md:flex-row justify-between items-start md:items-center text-lg">
      {/* Información de contacto */}
      <div className="mb-6 md:mb-0 leading-relaxed">
        <p><strong className="text-xl">Información de contacto:</strong> Calle Sucre y parque la Torre.</p>
        <p className="mt-1"><strong>Fono:</strong> 591-4-4231765</p>
        <p className="mt-1">
          <strong>Correo:</strong>{' '}
          <a href="mailto:soporte@umss.edu" className="underline text-white hover:text-blue-300">
            soporte@umss.edu
          </a>
        </p>
      </div>

      {/* Redes Sociales */}
      <div>
        <p className="mb-3 text-xl font-semibold">Redes Sociales:</p>
        <div className="flex gap-6 text-5xl">
          <FaFacebook />
          <FaInstagram />
          <FaXTwitter />
          <FaLinkedin />
          <FaWhatsapp />
          <FaTelegram />
          <FaTiktok />
        </div>
      </div>
    </footer>
  )
}

export default Footer
