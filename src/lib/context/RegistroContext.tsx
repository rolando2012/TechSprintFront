'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

export interface RegistroData {
  nombre: string
  selectedAreas: string[]
  nivelesMap: Record<string, string[]>
  categoriasMap: Record<string, string[]>
  costo: string
}

interface RegistroContextProps extends RegistroData {
  setNombre: (nombre: string) => void
  setSelectedAreas: (areas: string[]) => void
  setNivelesMap: (m: Record<string, string[]>) => void
  setCategoriasMap: (m: Record<string, string[]>) => void
  setCosto: (costo: string) => void
}

const RegistroContext = createContext<RegistroContextProps | undefined>(undefined)

export function RegistroProvider({ children }: { children: ReactNode }) {
  const [nombre, setNombre] = useState('')
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [nivelesMap, setNivelesMap] = useState<Record<string, string[]>>({})
  const [categoriasMap, setCategoriasMap] = useState<Record<string, string[]>>({})
  const [costo, setCosto] = useState('')

  return (
    <RegistroContext.Provider
      value={{
        nombre,
        selectedAreas,
        nivelesMap,
        categoriasMap,
        costo,
        setNombre,
        setSelectedAreas,
        setNivelesMap,
        setCategoriasMap,
        setCosto,
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
