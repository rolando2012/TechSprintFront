import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

 export interface Competencia {
  id: string;
  nombreCompet: string;
  version: string;
  fecha: string; 
  fechaFin: string;
  costo: string;
}


export interface Area {
  nombreArea: string;
  codArea: number;
}

export const obtenerAreas = async (competidorId: string): Promise<Area[]> => {
  const response = await fetch(`${BASE_URL}/consulta/area/${competidorId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener las áreas');
  }

  return response.json();
};

export interface CompetidorConsulta {
  codComp: number;
  estadoInscripcion: string;
  nombreCompetidor: string;
  carnet: string;
  fechaNac: string;
  celular: string;
  emailContacto: string;
  tutorNombre: string;
  colegio: string;
  gradoRange: string;
  fechaInscripcion: string;
  area: string;
  departamento: string;
  municipio: string;
  estadoPago: string;
  motivoRechazo?: string;
}

export const consultarDetallesCompetidor = async (
  competidorId: string,
  nombreArea: string
): Promise<CompetidorConsulta> => {
  const response = await fetch(`${BASE_URL}/consulta/detalles/${competidorId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nombreArea,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al consultar detalles del competidor');
  }

  return response.json();
};

export interface EtapaCompetencia {
  codEtapa: number;
  nombreEtapa: string;
  fechaInicio: string;
  fechaFin: string;
  orden: number;
  estado: string;
}

export interface CompetenciaDetalle {
  codCompet: string;
  nombreCompet: string;
  costo: string;
  fechaIni: string;
  fechaFin: string;
  gestion: number;
  etapas: EtapaCompetencia[];
}

export interface UpdateCompetenciaData {
  nombreCompet: string;
  costo: string;
  etapas: {
    codEtapa: number;
    nombreEtapa: string;
    fechaInicio: string;
    fechaFin: string;
    orden: number;
  }[];
}

// Obtener competencia específica con sus etapas
export async function getCompetenciaById(codComp: string): Promise<CompetenciaDetalle> {
  try {
    const { data, status } = await axios.get<CompetenciaDetalle>(
      `${BASE_URL}/consulta/competencias/${codComp}`
    );
    if (status !== 200) throw new Error(`Status ${status}`);
    return data;
  } catch (error) {
    console.error('[API] GetCompetenciaById error:', error);
    throw error;
  }
}

// Actualizar competencia
export async function updateCompetencia(
  codComp: string, 
  data: UpdateCompetenciaData
): Promise<{ message: string; puedeEditarFechas: boolean }> {
  try {
    const { data: response, status } = await axios.put(
      `${BASE_URL}/consulta/competencias/${codComp}`,
      data
    );
    if (status !== 200) throw new Error(`Status ${status}`);
    return response;
  } catch (error) {
    console.error('[API] UpdateCompetencia error:', error);
    throw error;
  }
}