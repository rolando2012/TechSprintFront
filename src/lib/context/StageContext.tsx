'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Stage {
  id: number
  name: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
}

interface StageContextType {
  stages: Stage[]
  setStages: React.Dispatch<React.SetStateAction<Stage[]>>
}

const StageContext = createContext<StageContextType | undefined>(undefined)

const FIXED_NAMES = [
  'Inscripciones',
  'Validación de Requisitos y aceptación de parte de los tutores',
  'Pago de las inscripciones',
  'Periodo de Competición',
]

export const StageProvider = ({ children }: { children: ReactNode }) => {
  // Inicializa con fechas de hoy y horas por defecto
  const today = new Date().toISOString().split('T')[0]
  const initialStages: Stage[] = FIXED_NAMES.map((name, idx) => ({
    id: idx + 1,
    name,
    startDate: today,
    endDate: today,
    startTime: '08:00',
    endTime: '18:00',
  }))

  const [stages, setStages] = useState<Stage[]>(initialStages)

  return (
    <StageContext.Provider value={{ stages, setStages }}>
      {children}
    </StageContext.Provider>
  )
}

export const useStageContext = (): StageContextType => {
  const context = useContext(StageContext)
  if (!context) {
    throw new Error('useStageContext must be used within a StageProvider')
  }
  return context
}
