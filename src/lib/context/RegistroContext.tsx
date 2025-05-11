'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

export interface RegistroData {
  selectedAreas: string[]
  nivelesMap: Record<string, string[]>
  categoriasMap: Record<string, string[]>
  costoConfirmado: string
}

interface RegistroContextProps extends RegistroData {
  setSelectedAreas: (areas: string[]) => void
  setNivelesMap: (m: Record<string, string[]>) => void
  setCategoriasMap: (m: Record<string, string[]>) => void
  setCostoConfirmado: (c: string) => void
}

const RegistroContext = createContext<RegistroContextProps | undefined>(undefined)

export function RegistroProvider({ children }: { children: ReactNode }) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [nivelesMap, setNivelesMap] = useState<Record<string, string[]>>({})
  const [categoriasMap, setCategoriasMap] = useState<Record<string, string[]>>({})
  const [costoConfirmado, setCostoConfirmado] = useState('')

  return (
    <RegistroContext.Provider
      value={{
        selectedAreas,
        nivelesMap,
        categoriasMap,
        costoConfirmado,
        setSelectedAreas,
        setNivelesMap,
        setCategoriasMap,
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
