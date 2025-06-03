import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CompetidoresByTutor{
    codComp: string,
    codIns: number,
    nombre: string;
    apellidoPaterno: string;
    carnet: string;
    colegio: string;
    gradoRange: string;
    estadoInscripcion:string,
    fechaInscripcion: string,
    area:string,
}

export async function getCompetidoresByTutor(id:string): Promise<CompetidoresByTutor[]> {
    try {
        const { data, status } = await axios.get<CompetidoresByTutor[]>(
            `${BASE_URL}/competidor/tutor/${id}`
        );
        if (status !== 200) throw new Error(`Status ${status}`);
        return data;
    } catch (error) {
        console.error('[API] CompetidoresByTutor error:', error);
        return [];
    }
}

export interface Estado {
  estado: string;
  total: number;
}

export interface EstadosResponse {
  estados: Estado[];
}


export const fetchEstadosCompetidores = async (tutorId: number): Promise<Estado[]> => {
  const { data } = await axios.get<EstadosResponse>(`${BASE_URL}/competidor/tutor/${tutorId}/estados`);
  return data.estados;
};

export async function updateEstadoInscripcion(
  codIns: number,
  nuevoEstado: string,
  motivoRechazo?: string,       
): Promise<void> {

  const payload: { estado: string; motivoRechazo?: string } = {
    estado: nuevoEstado,
  };

  // 2. Si el estado es “Rechazado”, asegurarnos de que motivoRechazo exista
  if (nuevoEstado === 'Rechazado') {
    if (!motivoRechazo || motivoRechazo.trim() === '') {
      throw new Error('Debe especificarse un motivo de rechazo cuando el estado es "Rechazado".');
    }
    payload.motivoRechazo = motivoRechazo.trim();
  }

  await axios.patch(`${BASE_URL}/competidor/${codIns}/estado`, payload);
}

export interface CompetidorConsulta {
  codComp: number;
  estadoInscripcion: string;
  nombre: string;
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
}

export const consultarCompetidor = async (
  tutorId: string,
  carnet: string,
  email: string
): Promise<CompetidorConsulta> => {
  const response = await fetch(`${BASE_URL}/competidor/tutor/${tutorId}/consulta`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      carnet,
      email,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al consultar competidor');
  }

  return response.json();
};