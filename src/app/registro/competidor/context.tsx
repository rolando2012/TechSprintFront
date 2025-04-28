'use client';

import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { PersonalData } from '@/lib/schemas/ValidarRegComp';

export interface InscripcionData {
  area: string;
  categoria: string;
  nivel: string;
}

export interface TutorAssignmentData {
  codTut: string;
  nombre: string;
}

interface RegistroContextValue {
  personalData: PersonalData;
  setPersonalData: Dispatch<SetStateAction<PersonalData>>;
  inscripciones: InscripcionData[];
  setInscripciones: Dispatch<SetStateAction<InscripcionData[]>>;
  tutorAssignments: Record<string, TutorAssignmentData>;
  setTutorAssignments: Dispatch<SetStateAction<Record<string, TutorAssignmentData>>>;
}

const initialPersonal: PersonalData = {
  nombre: '', apellido: '', carnetIdentidad: '', correoElectronico: '',
  fechaNacimiento: '', departamento: '', municipio: '',
  colegio: '', grado: '', nivel: '', celular: '',
};

const initialTutorAssignments: Record<string, TutorAssignmentData> = {};

const RegistroContext = createContext<RegistroContextValue | undefined>(undefined);

export function RegistroProvider({ children }: { children: React.ReactNode }) {
  const [personalData, setPersonalData]   = useState<PersonalData>(initialPersonal);
  const [inscripciones, setInscripciones] = useState<InscripcionData[]>([]);
  const [tutorAssignments, setTutorAssignments] = useState<Record<string, TutorAssignmentData>>(initialTutorAssignments);

  useEffect(() => {
    const p = sessionStorage.getItem('personalData');
    if (p) setPersonalData(JSON.parse(p));
    const i = sessionStorage.getItem('inscripciones');
    if (i) setInscripciones(JSON.parse(i));
    const t = sessionStorage.getItem('tutorAssignments');
    if (t) setTutorAssignments(JSON.parse(t));
  }, []);

  useEffect(() => {
    sessionStorage.setItem('personalData', JSON.stringify(personalData));
  }, [personalData]);

  useEffect(() => {
    sessionStorage.setItem('inscripciones', JSON.stringify(inscripciones));
  }, [inscripciones]);

  useEffect(() => {
    sessionStorage.setItem('tutorAssignments', JSON.stringify(tutorAssignments));
  }, [tutorAssignments]);

  return (
    <RegistroContext.Provider value={{
      personalData,
      setPersonalData,
      inscripciones,
      setInscripciones,
      tutorAssignments,
      setTutorAssignments,
    }}>
      {children}
    </RegistroContext.Provider>
  );
}

export function useRegistro() {
  const ctx = useContext(RegistroContext);
  if (!ctx) throw new Error('useRegistro debe usarse dentro de RegistroProvider');
  return ctx;
}