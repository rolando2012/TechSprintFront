const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface PagoPendiente {
  codComp: number;
  nombre: string;
  apellidoPaterno: string;
  carnet: string;
  colegio: string;
  gradoRange: string;
  estadoInscripcion: string;
  fechaInscripcion: string;
  area: string;
}

export async function obtenerPagosPendientes(): Promise<PagoPendiente[]> {
  try {
    const response = await fetch(`${BASE_URL}/cajero/competidores/aprobados`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener pagos pendientes:', error);
    throw error;
  }
}