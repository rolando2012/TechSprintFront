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
  codGrado?: number;   // opcional, porque en secundarios especiales puede no venir
  codNivel?: number;   // opcional para regulares
  grade: string;
  level: string;
  price: number;
  rango?: string; // opcional, para secundarios especiales
}

export interface AreaCategories {
  codArea: number;
  primary: Category[];
  secondary: Category[];
}

export async function getCategoriesArea(area: string): Promise<AreaCategories> {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const url = `${BASE_URL}/registro/areas/grados/nivel/2025/${area}`;
  const resp = await axios.get<AreaCategories>(url);
  if (resp.status !== 200) {
    throw new Error(`API returned status ${resp.status}`);
  }
  return resp.data;
}
export interface Tutor {
  codPer: string;
  codTut: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombreArea: string;
}

export async function getTutors(): Promise<Tutor[]>{
  const { data, status } = await axios.get<Tutor[]>(
    `${BASE_URL}/registro/tutores`,
  );
  if (status !== 200) throw new Error(`Status ${status}`);
  return data;
} 