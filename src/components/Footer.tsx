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
        <p><strong className="text-xl">Información de contacto:</strong> Calle Sucre y parque la Torre</p>
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
        <p className="mb-3 text-xl ">Redes Sociales:</p>
        <div className="flex gap-6 text-5xl">
          <a href="https://www.facebook.com/UmssBolOficial/" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://www.instagram.com/umssboloficial/" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://x.com/UmssBolOficial" target="_blank" rel="noopener noreferrer">
            <FaXTwitter />
          </a>
          <a href="https://www.linkedin.com/school/universidad-mayor-de-san-simón/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://www.whatsapp.com/channel/0029VaBrhPZ1yT2Cnpitee3c" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp />
          </a>
          <a href="https://t.me/s/UmssBolOficial" target="_blank" rel="noopener noreferrer">
            <FaTelegram />
          </a>
          <a href="https://www.tiktok.com/@universidadaldia/" target="_blank" rel="noopener noreferrer">
            <FaTiktok />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
