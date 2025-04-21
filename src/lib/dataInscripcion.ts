// Departamentos de Bolivia
const departamentos = [
    'La Paz',
    'Santa Cruz',
    'Cochabamba',
    'Chuquisaca',
    'Oruro',
    'Potosí',
    'Tarija',
    'Beni',
    'Pando'
  ];
  
  // Municipios por departamento
  const municipiosPorDepartamento: Record<string, string[]> = {
    'La Paz': [
      'La Paz',
      'El Alto',
      'Viacha',
      'Achacachi',
      'Copacabana',
      'Coroico',
      'Sorata'
    ],
    'Santa Cruz': [
      'Santa Cruz de la Sierra',
      'Montero',
      'Warnes',
      'La Guardia',
      'Cotoca',
      'Camiri',
      'Puerto Suárez'
    ],
    'Cochabamba': [
      'Cochabamba',
      'Quillacollo',
      'Sacaba',
      'Punata',
      'Cliza',
      'Tiquipaya',
      'Vinto'
    ],
    'Chuquisaca': [
      'Sucre',
      'Monteagudo',
      'Villa Serrano',
      'Camargo',
      'Padilla',
      'Yotala'
    ],
    'Oruro': [
      'Oruro',
      'Challapata',
      'Huanuni',
      'Caracollo',
      'Machacamarca',
      'Poopó'
    ],
    'Potosí': [
      'Potosí',
      'Villazón',
      'Tupiza',
      'Uyuni',
      'Llallagua',
      'Uncía'
    ],
    'Tarija': [
      'Tarija',
      'Yacuiba',
      'Villamontes',
      'Bermejo',
      'Entre Ríos',
      'Padcaya'
    ],
    'Beni': [
      'Trinidad',
      'Riberalta',
      'Guayaramerín',
      'San Borja',
      'Santa Ana del Yacuma',
      'San Ignacio de Moxos'
    ],
    'Pando': [
      'Cobija',
      'Porvenir',
      'Puerto Rico',
      'San Lorenzo',
      'Filadelfia',
      'Bolpebra'
    ]
  };
  
  // Grados disponibles
  const grados = ['Primaria', 'Secundaria'];
  
  // Niveles por grado
  const nivelesPorGrado: Record<string, string[]> = {
    'Primaria': ['3ro Primaria', '4to Primaria', '5to Primaria', '6to Primaria'],
    'Secundaria': ['1ro Secundaria', '2do Secundaria', '3ro Secundaria', '4to Secundaria', '5to Secundaria', '6to Secundaria']
  };
  
  // Funciones para obtener los datos
  export const getDepartamentos = (): string[] => {
    return departamentos;
  };
  
  export const getMunicipiosByDepartamento = (departamento: string): string[] => {
    return municipiosPorDepartamento[departamento] || [];
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