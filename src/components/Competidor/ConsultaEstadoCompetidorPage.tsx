'use client';
import { useState, useEffect } from 'react';
import { obtenerAreas, consultarDetallesCompetidor, Area, CompetidorConsulta } from '@/lib/api/consulta';
import DetallesInscripcionCompetidor from '@/components/Competidor/DetallesInscripcionCompetidor';
import { 
  MagnifyingGlassIcon, 
  AcademicCapIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';
import { inter } from '@/config/fonts';
import Link from 'next/link';

interface ConsultaEstadoCompetidorPageProps {
  competidorId: string;
}

export default function ConsultaEstadoCompetidorPage({ competidorId }: ConsultaEstadoCompetidorPageProps) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState('');
  const [competidor, setCompetidor] = useState<CompetidorConsulta | null>(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [cargandoAreas, setCargandoAreas] = useState(true);
  const [errorAreas, setErrorAreas] = useState<string | null>(null);

  useEffect(() => {
    cargarAreas();
  }, []);

  const cargarAreas = async () => {
    try {
      setCargandoAreas(true);
      setErrorAreas(null);
      const areasData = await obtenerAreas(competidorId);
      setAreas(areasData);
    } catch (error) {
      console.error('Error al cargar áreas:', error);
      setErrorAreas(error instanceof Error ? error.message : 'Error desconocido al cargar áreas');
    } finally {
      setCargandoAreas(false);
    }
  };

  const handleConsultar = async () => {
    if (!areaSeleccionada.trim()) {
      Swal.fire({
        title: 'Área requerida',
        text: 'Por favor selecciona un área para consultar',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#6b7280'
      });
      return;
    }

    // Mostrar loading
    Swal.fire({
      title: 'Consultando detalles...',
      text: 'Obteniendo información de tu inscripción',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const resultado = await consultarDetallesCompetidor(competidorId, areaSeleccionada);
      
      Swal.close();
      
      setCompetidor(resultado);
      setMostrarDetalles(true);
      
      Swal.fire({
        title: 'Información cargada',
        text: 'Los detalles de tu inscripción se han cargado correctamente',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

    } catch (error) {
      Swal.close();
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      Swal.fire({
        title: 'Error al consultar',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Intentar nuevamente',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleVolver = () => {
    setMostrarDetalles(false);
    setCompetidor(null);
    setAreaSeleccionada('');
  };

  if (mostrarDetalles && competidor) {
    return <DetallesInscripcionCompetidor competidor={competidor} onVolver={handleVolver} />;
  }

  return (
    <div className="bg-background-reg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AcademicCapIcon className="w-16 h-16 text-boton" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Olimpiadas Científicas
          </h1>
          <p className="text-gray-500 text-md">
            Consulta el Estado de tu Inscripción
          </p>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Selecciona el área de competencia
          </h2>
          <p className="text-gray-600 text-md">
            Elige el área en la que te inscribiste para ver los detalles de tu participación.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="area" className="flex items-center text-md font-medium text-gray-700 mb-2">
              <AcademicCapIcon className="w-6 h-6 mr-2 text-boton" />
              Área de Competencia
            </label>
            
            {cargandoAreas ? (
              <div className="flex items-center justify-center py-8">
                <ArrowPathIcon className="w-8 h-8 text-boton animate-spin mr-3" />
                <span className="text-gray-600 text-lg">Cargando áreas...</span>
              </div>
            ) : errorAreas ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-8 h-8 text-red-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-red-900 mb-2">
                      Error al cargar las áreas
                    </h3>
                    <p className="text-red-700 mb-4">{errorAreas}</p>
                    <button
                      onClick={cargarAreas}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                      transition-all transform hover:scale-105 active:scale-95"
                    >
                      <ArrowPathIcon className="w-4 h-4 mr-2" />
                      Reintentar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <select
                id="area"
                value={areaSeleccionada}
                onChange={(e) => setAreaSeleccionada(e.target.value)}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boton 
                focus:border-boton outline-none transition-all ${inter.className} font-semibold`}
              >
                <option value="">Selecciona un área...</option>
                {areas.map((area) => (
                  <option key={area.codArea} value={area.nombreArea}>
                    {area.nombreArea}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center mt-8 sm:mt-12 w-full gap-4">
            <Link
              href="/competidor"
              className="sm:mr-auto px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-400 
              transition-all transform hover:scale-105 active:scale-95"
            >
              Volver
            </Link>
            <button
              onClick={handleConsultar}
              disabled={cargandoAreas || !!errorAreas}
              className="sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 w-full sm:w-auto 
               flex items-center justify-center px-12 py-3 bg-boton text-white font-medium rounded-full hover:bg-boton-hover
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-boton duration-200 cursor-pointer
              transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              disabled:transform-none"
            >
              <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
              Consultar Estado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}