import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CompetidoresByTutor{
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