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
export interface Municipio {
    codMun: string;
    nombreMun: string;
  }

export async function getMunicipios(departamento: string): Promise<Municipio[]> {
  try {
    const { data, status } = await axios.get<Municipio[]>(
      `${BASE_URL}/competencia/departamentos/${departamento}/municipios`
    );
    if (status !== 200) throw new Error(`Status ${status}`);
      return data;
  } catch (error) {
    console.error('[API] Error en getMunicipios:', error);
    return [];
  }
}

