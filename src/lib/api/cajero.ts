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