'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { PersonalData } from '@/lib/schemas/ValidarRegComp';

export interface InscripcionData {
  area: string;
  categoria: string;
  nivel: string;
}

interface RegistroContextValue {
  personalData: PersonalData;
  setPersonalData: (d: PersonalData) => void;
  inscripciones: InscripcionData[];
  setInscripciones: (i: InscripcionData[]) => void;
}

const initialPersonal: PersonalData = {
  nombre: '', apellido: '', carnetIdentidad: '', correoElectronico: '',
  fechaNacimiento: '', departamento: '', municipio: '',
  colegio: '', grado: '', nivel: '', celular: '',
};

const RegistroContext = createContext<RegistroContextValue | undefined>(undefined);

export function RegistroProvider({ children }: { children: React.ReactNode }) {
  const [personalData, setPersonalData]     = useState<PersonalData>(initialPersonal);
  const [inscripciones, setInscripciones]   = useState<InscripcionData[]>([]);

  useEffect(() => {
    const p = sessionStorage.getItem('personalData');
    if (p) setPersonalData(JSON.parse(p));
    const i = sessionStorage.getItem('inscripciones');
    if (i) setInscripciones(JSON.parse(i));
  }, []);

  useEffect(() => {
    sessionStorage.setItem('personalData', JSON.stringify(personalData));
  }, [personalData]);

  useEffect(() => {
    sessionStorage.setItem('inscripciones', JSON.stringify(inscripciones));
  }, [inscripciones]);

  return (
    <RegistroContext.Provider value={{ personalData, setPersonalData, inscripciones, setInscripciones }}>
      {children}
    </RegistroContext.Provider>
  );
}

export function useRegistro() {
  const ctx = useContext(RegistroContext);
  if (!ctx) throw new Error('useRegistro debe usarse dentro de RegistroProvider');
  return ctx;
}
