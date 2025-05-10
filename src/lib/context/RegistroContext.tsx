'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface RegistroData {
  selectedAreas: string[]
  selectedNiveles: string[]
  selectedCategorias: string[]
  costoConfirmado: string
}

interface RegistroContextProps extends RegistroData {
  setSelectedAreas: (v: string[]) => void
  setSelectedNiveles: (v: string[]) => void
  setSelectedCategorias: (v: string[]) => void
  setCostoConfirmado: (v: string) => void
}

const RegistroContext = createContext<RegistroContextProps | undefined>(undefined)

export function RegistroProvider({ children }: { children: ReactNode }) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [selectedNiveles, setSelectedNiveles] = useState<string[]>([])
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([])
  const [costoConfirmado, setCostoConfirmado] = useState('')

  return (
    <RegistroContext.Provider
      value={{
        selectedAreas,
        selectedNiveles,
        selectedCategorias,
        costoConfirmado,
        setSelectedAreas,
        setSelectedNiveles,
        setSelectedCategorias,
        setCostoConfirmado,
      }}
    >
      {children}
    </RegistroContext.Provider>
  )
}

export function useRegistro() {
  const ctx = useContext(RegistroContext)
  if (!ctx) throw new Error('useRegistro must be used within RegistroProvider')
  return ctx
}
