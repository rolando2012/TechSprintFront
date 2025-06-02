const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

import axios from 'axios';

export interface HistorialPago {
  codComp: number;
  nombre: string;
  apellidoPaterno: string;
  carnet: string;
  colegio: string;
  gradoRange: string;
  fechaInscripcion: string;
  area: string;
  monto: number;
  estadoPago: string;
}

export interface EstadisticasPago {
  totalRegistros: number;
  pagosExitosos: number;
  totalRecaudado: string;
}

// Configuración base de axios
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export async function obtenerHistorialPagos(): Promise<HistorialPago[]> {
  try {
    const response = await apiClient.get<HistorialPago[]>('/cajero/competidores/habilitados');
    return response.data;
  } catch (error) {
    console.error('Error al obtener historial de pagos:', error);
    throw new Error('No se pudo cargar el historial de pagos');
  }
}

export async function obtenerEstadisticasPago(): Promise<EstadisticasPago> {
  try {
    const response = await apiClient.get<EstadisticasPago>('/cajero/stats');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de pagos:', error);
    throw new Error('No se pudo cargar las estadísticas');
  }
}

export interface PagoPendiente {
  codComp: number;
  codIns: number;
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

export const aceptarPago = async (codIns: number): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/cajero/pagos/${codIns}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        estadoPago: 'aprobado',
        fechaAprobacion: new Date().toISOString()
      })
    });

    if (!response.ok) {
      // Intentar obtener el mensaje de error del servidor
      let errorMessage = 'Error al procesar el pago';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        // Si no se puede parsear la respuesta, usar el status text
        errorMessage = response.statusText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    // Verificar si hay contenido en la respuesta
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      return data;
    }
    
    // Si no hay contenido JSON, simplemente retornar void
    return;
    
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    
    // Si es un error de red o desconocido
    throw new Error('Error de conexión. Verifique su conexión a internet.');
  }
};