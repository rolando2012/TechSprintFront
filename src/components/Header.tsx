'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import LoginModal from '@/components/Modals/LoginModal'
import { inter } from '@/config/fonts'
import { PiUserCircleFill } from "react-icons/pi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [showModal, setShowModal] = useState(false)
  const [isLogged, setIsLogged] = useState<boolean | null>(null)

  // Check login status on mount and when path changes
  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setIsLogged(Boolean(data.logged)))
      .catch(() => setIsLogged(false))
  }, [pathname])

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    setIsLogged(false)
    router.push('/')
  }

  // Don't render until we know login state
  if (isLogged === null) {
    return (
      <header className="relative bg-bright-gray-900 text-white px-4 md:px-12 py-6 md:py-10 flex items-center justify-between">
        {/* Placeholder while checking auth */}
      </header>
    )
  }

  return (
    <>
      <header className="relative bg-bright-gray-900 text-white px-4 md:px-12 py-6 md:py-10 flex items-center justify-between h-auto md:h-[150px]">
        {/* Background rings */}
        <div className="absolute inset-0 z-0 opacity-100 pointer-events-none flex justify-center items-center">
          <div className="relative w-full max-w-[300px] md:max-w-[750px] h-[80px] md:h-[150px]">
            <Image
              src="/images/aros.svg"
              alt="Aros Olímpicos"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Logo & name */}
        <div className="relative z-10 flex items-center gap-2 md:gap-5 flex-shrink-0">
          <Image
            src="/images/logo.svg"
            alt="Logo TechSprint"
            width={120}
            height={120}
            className="w-[60px] md:w-[200px]"
            priority
          />
          <span className="text-lg md:text-3xl tracking-wide">TechSprint</span>
        </div>

        {/* Auth controls */}
        <div className="relative z-10">
          {isLogged ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-full hover:bg-bright-gray-950 focus:outline-none focus:ring">
                  <PiUserCircleFill className="h-18 w-18 text-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-bright-gray-800 text-white z-50 w-40">
                <DropdownMenuItem onSelect={() => router.push('/perfil')}>
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={logout}>
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className={
                `relative z-10 bg-white text-black text-xs xs:text-sm sm:text-base
                px-3 xs:px-4 sm:px-6 py-1.5 xs:py-2 sm:py-3
                rounded-full hover:bg-gray-200 font-semibold
                transition-all duration-200 shadow cursor-pointer whitespace-nowrap
                ${inter.className}
                transform hover:scale-105 active:scale-95`
              }
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </header>

      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </>
  )
}
