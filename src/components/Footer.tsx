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
    <footer className="bg-[#434854] text-white px-6 md:px-10 py-8 md:py-12 flex flex-col lg:flex-row justify-between items-start gap-8 md:gap-0">
      {/* Información de contacto - Responsive */}
      <div className="flex-1 max-w-[500px]">
        <p className="text-lg md:text-xl font-bold mb-2">Información de contacto:</p>
        <div className="text-base md:text-lg space-y-1">
          <p>Calle Sucre y parque la Torre</p>
          <p><strong>Fono:</strong> 591-4-4231765</p>
          <p>
            <strong>Correo:</strong>{' '}
            <a href="mailto:soporte@umss.edu" className="underline hover:text-blue-300 transition-colors">
              soporte@umss.edu
            </a>
          </p>
        </div>
      </div>

      {/* Redes Sociales - Responsive */}
      <div className="flex-1 w-full lg:max-w-[600px]">
        <p className="text-lg md:text-xl font-bold mb-3">Redes Sociales:</p>
        <div className="flex flex-wrap gap-4 md:gap-6 justify-start lg:justify-end">
          {[
            { icon: <FaFacebook />, link: 'https://www.facebook.com/UmssBolOficial/' },
            { icon: <FaInstagram />, link: 'https://www.instagram.com/umssboloficial/' },
            { icon: <FaXTwitter />, link: 'https://x.com/UmssBolOficial' },
            { icon: <FaLinkedin />, link: 'https://www.linkedin.com/school/universidad-mayor-de-san-simón/' },
            { icon: <FaWhatsapp />, link: 'https://www.whatsapp.com/channel/0029VaBrhPZ1yT2Cnpitee3c' },
            { icon: <FaTelegram />, link: 'https://t.me/s/UmssBolOficial' },
            { icon: <FaTiktok />, link: 'https://www.tiktok.com/@universidadaldia/' }
          ].map((social, index) => (
            <a
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl md:text-4xl hover:text-blue-300 transition-colors"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer