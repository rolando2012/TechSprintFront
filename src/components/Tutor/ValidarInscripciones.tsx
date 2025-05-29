'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Check, X } from 'lucide-react';
import { 
  CompetidoresByTutor, 
  getCompetidoresByTutor, 
  Estado, 
  fetchEstadosCompetidores 
} from '@/lib/api/competidor'; // Ajusta la ruta según tu estructura

interface ValidarInscripcionesProps {
  tutorId: string;
}

const ValidarInscripciones: React.FC<ValidarInscripcionesProps> = ({ tutorId }) => {
  const [competidores, setCompetidores] = useState<CompetidoresByTutor[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [competidoresData, estadosData] = await Promise.all([
          getCompetidoresByTutor(tutorId),
          fetchEstadosCompetidores(parseInt(tutorId))
        ]);
        
        setCompetidores(competidoresData);
        setEstados(estadosData);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (tutorId) {
      fetchData();
    }
  }, [tutorId]);

  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'verificado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pendiente':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'rechazado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadgeColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'verificado':
        return 'bg-green-500 text-white';
      case 'pendiente':
        return 'bg-orange-500 text-white';
      case 'rechazado':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getEstadoCount = (estado: string) => {
    const estadoData = estados.find(e => e.estado.toLowerCase() === estado.toLowerCase());
    return estadoData?.total || 0;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-96 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {getEstadoCount('pendiente')}
          </div>
          <div className="text-orange-700 font-medium">Pendientes</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {getEstadoCount('verificado')}
          </div>
          <div className="text-green-700 font-medium">Verificados</div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {getEstadoCount('rechazado')}
          </div>
          <div className="text-red-700 font-medium">Rechazados</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="bg-gray-700 text-white p-4 rounded-t-lg flex items-center">
          <Check className="w-5 h-5 mr-2" />
          <h2 className="text-lg font-semibold">Validar Inscripciones</h2>
        </div>

        <div className="p-6">
          {competidores.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay competidores registrados
            </div>
          ) : (
            <div className="space-y-4">
              {competidores.map((competidor, index) => (
                <div 
                  key={`${competidor.carnet}-${index}`}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    {/* Nombre y CI */}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {competidor.nombre} {competidor.apellidoPaterno}
                      </h3>
                      <p className="text-sm text-gray-600">
                        CI: {competidor.carnet || 'No especificado'}
                      </p>
                    </div>

                    {/* Colegio y Grado */}
                    <div>
                      <p className="font-medium text-gray-900">{competidor.colegio}</p>
                      <p className="text-sm text-gray-600">{competidor.gradoRange}</p>
                    </div>

                    {/* Área y Fecha */}
                    <div>
                      <p className="font-medium text-gray-900">{competidor.area}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(competidor.fechaInscripcion)}
                      </p>
                    </div>

                    {/* Estado */}
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(competidor.estadoInscripcion)}`}>
                        {competidor.estadoInscripcion.toUpperCase()}
                      </span>
                    </div>

                    {/* Acciones */}
                    <div className="flex justify-end">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con botón Volver */}
        <div className="flex justify-end p-4 border-t border-gray-200">
          <button className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidarInscripciones;