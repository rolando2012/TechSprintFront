import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Departamento {
    codDept: string;
    nombreDept: string;
  }
  
  export async function getDepartamentos(): Promise<Departamento[]> {
    try {
      const { data, status } = await axios.get<Departamento[]>(
        `${BASE_URL}/registro/departamentos`
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
      `${BASE_URL}/registro/departamentos/${departamento}/municipios`
    );
    if (status !== 200) throw new Error(`Status ${status}`);
      return data;
  } catch (error) {
    console.error('[API] Error en getMunicipios:', error);
    return [];
  }
}

export interface Areas{
  codArea: string;
  nombreArea: string;
}
export async function getAreas(): Promise<Areas[]> {
  const areas = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/registro/areas`);
  if (areas.status !== 200) {
    console.error('Error fetching areas:', areas.statusText);
    return [];
  }
  return areas.data;
}
export interface Category {
  codGrado: string;
  grade: string;
  level: string;
  price: number;
  codNivel: string;
}

interface Categories {
  primary: Category[];
  secondary: Category[];
}


