import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type Stage = {
    id: number
    name: string
    startDate: string  // "YYYY-MM-DD"
    endDate: string
    startTime: string  // "HH:mm"
    endTime: string
  }
  
  export async function registrarCompetencia(
    nombre: string,
    nivelesMap: Record<string, string[]>,
    categoriasMap: Record<string, string[]>,
    costoConfirmado: number ,
    stages: Stage[]
  ) {
    const res = await fetch(`${BASE_URL}/administrador/competencia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, nivelesMap, categoriasMap, costoConfirmado, stages })
    })
  
    if (!res.ok) {
      const { error } = await res.json()
      throw new Error(error || 'Error desconocido al registrar competencia')
    }
  
    return await res.json()
  }
  
  export interface Competencia {
    codComp: string;
    nombreCompet: string;
    gestion: string;
    fechaIni: string;
    fechaFin: string;
    costo: string;
  }

  export async function getCompetencias(): Promise<Competencia[]> {
    try {
        const { data, status } = await axios.get<Competencia[]>(
            `${BASE_URL}/administrador/competencias`
        );
        if (status !== 200) throw new Error(`Status ${status}`);
        return data;
    } catch (error) {
        console.error('[API] CompetidoresByTutor error:', error);
        return [];
    }
}

export async function validarNombreUnico(nombre: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/administrador/validar-nombre`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre })
  })
  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error || 'Error al validar nombre')
  }
  const { unique } = await res.json()
  return unique
}

export interface Etapa {
  codEtapa: number;
  codCompetencia: number;
  nombreEtapa: string;
  descripcion?: string;
  fechaInicio: string; // ISO date
  horaInicio: string;  // ISO time
  fechaFin: string;    // ISO date
  horaFin: string;     // ISO time
  orden: number;
  estado: string;
}

export async function fetchEtapasCompetencia(competenciaId: number): Promise<Etapa[]> {
  const res = await fetch(`${BASE_URL}/administrador/competencias/${competenciaId}/etapas`);
  if (!res.ok) {
    throw new Error(`Error fetching etapas: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchPrimeraCompetenciaId(): Promise<number> {
  const res = await fetch(`${BASE_URL}/administrador/competencias/first`);
  if (!res.ok) {
    throw new Error(`Error fetching competencia: ${res.statusText}`);
  }
  const data = await res.json();
  return data.codCompet;
}