'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, Clock } from 'lucide-react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompetidor, setSelectedCompetidor] = useState<CompetidoresByTutor | null>(null);

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

  const getStatusIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'verificado':
        return <Check className="w-4 h-4" />;
      case 'pendiente':
        return <Clock className="w-4 h-4" />;
      case 'rechazado':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleChangeStatus = (competidor: CompetidoresByTutor) => {
    setSelectedCompetidor(competidor);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (newStatus: string) => {
    if (selectedCompetidor) {
      console.log(`Competidor ID: ${selectedCompetidor.carnet}, Nuevo Estado: ${newStatus}`);
      // Aquí puedes agregar la lógica para actualizar el estado en el backend
      setIsModalOpen(false);
      setSelectedCompetidor(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCompetidor(null);
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
                      <button 
                        onClick={() => handleChangeStatus(competidor)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all hover:opacity-80 ${getStatusBadgeColor(competidor.estadoInscripcion)}`}
                      >
                        {getStatusIcon(competidor.estadoInscripcion)}
                        <span className="ml-2">{competidor.estadoInscripcion.toUpperCase()}</span>
                      </button>
                    </div>

                    {/* Acciones - Removido el icono del ojo */}
                    <div className="flex justify-end">
                      {/* Espacio para otras acciones futuras */}
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

      {/* Modal para cambiar estado */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 relative">
            {/* Botón cerrar */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Título */}
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Cambiar Estado Inscripción
            </h2>

            {/* Opciones de estado */}
            <div className="space-y-3">
              {/* Pendiente */}
              <button
                onClick={() => handleStatusUpdate('pendiente')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
              >
                <Clock className="w-5 h-5 mr-2" />
                PENDIENTE
              </button>

              {/* Verificado */}
              <button
                onClick={() => handleStatusUpdate('verificado')}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
              >
                <Check className="w-5 h-5 mr-2" />
                VERIFICADO
              </button>

              {/* Rechazado */}
              <button
                onClick={() => handleStatusUpdate('rechazado')}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 mr-2" />
                RECHAZADO
              </button>
            </div>

            {/* Botón Volver */}
            <div className="flex justify-end mt-6">
              <button 
                onClick={closeModal}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidarInscripciones;