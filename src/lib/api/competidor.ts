import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CompetidoresByTutor{
    nombre: string;
    apellidoPaterno: string;
    carnet: string;
    colegio: string;
    gradoRange: string;
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