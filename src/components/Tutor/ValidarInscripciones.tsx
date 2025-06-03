'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, Clock, CircleCheck, AlertTriangle, MessageCircle } from 'lucide-react';
import { 
  CompetidoresByTutor, 
  getCompetidoresByTutor, 
  Estado, 
  fetchEstadosCompetidores,
  updateEstadoInscripcion
} from '@/lib/api/competidor'; 
import Link from 'next/link';
import Swal from 'sweetalert2';

interface ValidarInscripcionesProps {
  tutorId: string;
}

const ValidarInscripciones: React.FC<ValidarInscripcionesProps> = ({ tutorId }) => {
  const [competidores, setCompetidores] = useState<CompetidoresByTutor[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedCompetidor, setSelectedCompetidor] = useState<CompetidoresByTutor | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [competidoresData, estadosData] = await Promise.all([
          getCompetidoresByTutor(tutorId),
          fetchEstadosCompetidores(parseInt(tutorId))
        ]);
        
        // Ordenar competidores por fecha de inscripción (más recientes primero)
        const competidoresOrdenados = competidoresData.sort((a, b) => 
          new Date(b.fechaInscripcion).getTime() - new Date(a.fechaInscripcion).getTime()
        );
        
        setCompetidores(competidoresOrdenados);
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
    // Verificar que el estado sea pendiente
    if (competidor.estadoInscripcion.toLowerCase() !== 'pendiente') {
      Swal.fire({
        icon: 'warning',
        title: 'Acción no permitida',
        text: `Solo se puede cambiar el estado de inscripciones pendientes. Estado actual: ${competidor.estadoInscripcion}`,
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    setSelectedCompetidor(competidor);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus: string, motivo?: string) => {
    if (!selectedCompetidor) return;

    // Mostrar loading
    Swal.fire({
      title: 'Actualizando estado...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Llamar al servicio actualizado
      await updateEstadoInscripcion(
        selectedCompetidor.codIns, 
        newStatus, 
        motivo
      );

      // Cerrar loading
      Swal.close();

      // Mostrar éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Estado actualizado!',
        text: `El nuevo estado es "${newStatus}"`,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#10b981',
      });

      // Refrescar datos
      const [competidoresData, estadosData] = await Promise.all([
        getCompetidoresByTutor(tutorId),
        fetchEstadosCompetidores(parseInt(tutorId)),
      ]);
      
      // Ordenar competidores por fecha
      const competidoresOrdenados = competidoresData.sort((a, b) => 
        new Date(b.fechaInscripcion).getTime() - new Date(a.fechaInscripcion).getTime()
      );
      
      setCompetidores(competidoresOrdenados);
      setEstados(estadosData);
    } catch (err: any) {
      // Cerrar loading
      Swal.close();

      // Mostrar error
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar',
        text: err.response?.data?.message ?? err.message,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      // Cerrar modales
      setIsModalOpen(false);
      setIsRejectModalOpen(false);
      setSelectedCompetidor(null);
      setMotivoRechazo('');
    }
  };

  const handleRejectClick = () => {
    setIsModalOpen(false);
    setIsRejectModalOpen(true);
    setMotivoRechazo('');
  };

  const handleRejectSubmit = () => {
    if (motivoRechazo.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Motivo requerido',
        text: 'Debe especificar un motivo para el rechazo',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#f59e0b',
      });
      return;
    }
    console.log("llego")
    handleStatusUpdate('Rechazado', motivoRechazo);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCompetidor(null);
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
    setMotivoRechazo('');
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
          <CircleCheck className="w-6 h-6 mr-2" />
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
                  key={`${competidor.codComp}-${index}`}
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

                    {/* Acciones */}
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
          <Link 
            href="/tutor"
            className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-400 
            transition-all transform hover:scale-105 active:scale-95">
            Volver
          </Link>
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
              {/* Verificado */}
              <button
                onClick={() => handleStatusUpdate('Verificado')}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center 
                transition-all transform hover:scale-105 active:scale-95"
              >
                <Check className="w-5 h-5 mr-2" />
                VERIFICADO
              </button>

              {/* Rechazado */}
              <button
                onClick={handleRejectClick}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center 
                transition-all transform hover:scale-105 active:scale-95"
              >
                <X className="w-5 h-5 mr-2" />
                RECHAZADO
              </button>
            </div>

            {/* Botón Cerrar */}
            <div className="flex justify-end mt-6">
              <button 
                onClick={closeModal}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl 
                transition-all transform hover:scale-105 active:scale-95"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para especificar motivo de rechazo */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 relative">
            {/* Botón cerrar */}
            <button 
              onClick={closeRejectModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Título con icono */}
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-800">
                Motivo de Rechazo
              </h2>
            </div>

            {/* Campo de texto */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageCircle className="w-4 h-4 inline mr-1" />
                Especifica el motivo del rechazo:
              </label>
              <textarea
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                maxLength={255}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Ingresa el motivo por el cual se rechaza la inscripción..."
              />
              
              {/* Contador de caracteres */}
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  Motivo requerido para proceder con el rechazo
                </span>
                <span className={`text-xs ${motivoRechazo.length > 230 ? 'text-red-500' : 'text-gray-500'}`}>
                  {motivoRechazo.length}/255
                </span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 justify-end">
              <button 
                onClick={closeRejectModal}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl 
                transition-all transform hover:scale-105 active:scale-95 flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </button>
              
              <button 
                onClick={handleRejectSubmit}
                disabled={motivoRechazo.trim() === ''}
                className={`px-6 py-2 rounded-xl font-medium transition-all transform hover:scale-105 active:scale-95 flex items-center
                  ${motivoRechazo.trim() === '' 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Rechazar Inscripción
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidarInscripciones;