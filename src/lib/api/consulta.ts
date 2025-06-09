const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Area {
  nombreArea: string;
  codArea: number;
}

export const obtenerAreas = async (competidorId: string): Promise<Area[]> => {
  const response = await fetch(`${BASE_URL}/consulta/area/${competidorId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener las áreas');
  }

  return response.json();
};

export interface CompetidorConsulta {
  codComp: number;
  estadoInscripcion: string;
  nombreCompetidor: string;
  carnet: string;
  fechaNac: string;
  celular: string;
  emailContacto: string;
  tutorNombre: string;
  colegio: string;
  gradoRange: string;
  fechaInscripcion: string;
  area: string;
  departamento: string;
  municipio: string;
  estadoPago: string;
  motivoRechazo?: string;
}

export const consultarDetallesCompetidor = async (
  competidorId: string,
  nombreArea: string
): Promise<CompetidorConsulta> => {
  const response = await fetch(`${BASE_URL}/consulta/detalles/${competidorId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nombreArea,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al consultar detalles del competidor');
  }

  return response.json();
};