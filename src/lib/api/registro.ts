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
  codArea: number;
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
  codGrado: number;
  grade: string;
  level: string;
  price: number;
  codNivel: number;
}

export interface AreaCategories {
  codArea: number;
  primary: Category[];
  secondary: Category[];
}

export async function getCategoriesArea(codArea: string): Promise<AreaCategories> {
  const url = `${BASE_URL}/registro/areas/grados/nivel/2025/${codArea}`;
  const { data, status } = await axios.get<AreaCategories[]>(url);
  if (status !== 200) throw new Error(`Status ${status}`);
  return data[0];
}

export interface Tutor {
  codPer: string;
  codTut: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

export async function getTutors(): Promise<Tutor[]>{
  const { data, status } = await axios.get<Tutor[]>(
    `${BASE_URL}/registro/tutores`,
  );
  if (status !== 200) throw new Error(`Status ${status}`);
  return data;
} 