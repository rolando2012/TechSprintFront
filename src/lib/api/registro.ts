import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Departamento {
    codDept: string;
    nombreDept: string;
  }
  
  export async function getDepartamentos(): Promise<Departamento[]> {
    try {
      const { data, status } = await axios.get<Departamento[]>(
        `${BASE_URL}/competencia/departamentos`
      );
      if (status !== 200) throw new Error(`Status ${status}`);
      return data;
    } catch (error) {
      console.error('[API] getDepartamentos error:', error);
      return [];
    }
  }

export async function getMunicipios(departamento: string): Promise<string[]> {
  try {
    const { data, status } = await axios.get<string[]>(
      `${BASE_URL}/competencia/municipios?dep=${departamento}`
    );
    return status === 200 ? data : [];
  } catch (error) {
    console.error('[API] Error en getMunicipios:', error);
    return [];
  }
}

