  // Grados disponibles
  const grados = ['Primaria', 'Secundaria'];
  
  // Niveles por grado
  const nivelesPorGrado: Record<string, string[]> = {
    'Primaria': ['3ro Primaria', '4to Primaria', '5to Primaria', '6to Primaria'],
    'Secundaria': ['1ro Secundaria', '2do Secundaria', '3ro Secundaria', '4to Secundaria', '5to Secundaria', '6to Secundaria']
  };
  
  export const getGrados = (): string[] => {
    return grados;
  };
  
  export const getNivelesByGrado = (grado: string): string[] => {
    return nivelesPorGrado[grado] || [];
  };
  
  // Tipos para exportar
  export interface CategoriaInscripcion {
    id: string;
    grade: string;
    level: string;
    price: number;
  }
  
  export interface CategoriasInscripcion {
    primary: CategoriaInscripcion[];
    secondary: CategoriaInscripcion[];
  }