'use client';
import { CompetidorConsulta } from '@/lib/api/competidor';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import { RiFileTextFill } from "react-icons/ri";

interface DetallesInscripcionProps {
  competidor: CompetidorConsulta;
  onVolver: () => void;
}

export default function DetallesInscripcion({ competidor, onVolver }: DetallesInscripcionProps) {
  const isRechazado = competidor.estadoInscripcion?.toUpperCase() === 'RECHAZADO';

  const getEstadoInscripcionBadge = (estado: string) => {
    switch (estado?.toUpperCase()) {
      case 'VERIFICADO':
      case 'APROBADO':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Aprobado
          </span>
        );
      case 'PENDIENTE':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="w-4 h-4 mr-1" />
            Pendiente
          </span>
        );
      case 'RECHAZADO':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircleIcon className="w-4 h-4 mr-1" />
            Rechazado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <ClockIcon className="w-4 h-4 mr-1" />
            {estado || 'Sin estado'}
          </span>
        );
    }
  };

  const getEstadoPagoBadge = (estado: string) => {
    switch (estado?.toUpperCase()) {
      case 'PAGADO':
      case 'PAGO_REALIZADO':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            Pago realizado
          </span>
        );
      case 'PENDIENTE':
      case 'PAGO_PENDIENTE':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <CreditCardIcon className="w-4 h-4 mr-1" />
            Pago pendiente
          </span>
        );
      case 'NO_HABILITADO':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
            No está habilitado para pagar
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <CreditCardIcon className="w-4 h-4 mr-1" />
            {estado || 'Sin información de pago'}
          </span>
        );
    }
  };

  const formatFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return fecha;
    }
  };

  return (
    <div className="min-h-screen bg-background-reg py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <RiFileTextFill className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Detalles de Inscripción</h1>
      </div>

      {/* Estado Inscripción - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <p className="text-gray-600 text-sm sm:text-base">Información de estado de la inscripción</p>
        <div className="self-start sm:self-center">
          {getEstadoInscripcionBadge(competidor.estadoInscripcion)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Información del Competidor */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Información del Competidor</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombres y Apellidos
            </label>
            <p className="text-gray-900 break-words">{competidor.nombre}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carnet de Identidad
            </label>
            <p className="text-gray-900">{competidor.carnet}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <p className="text-gray-900 break-all">{competidor.emailContacto}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento
            </label>
            <p className="text-gray-900">{formatFecha(competidor.fechaNac)}</p>
          </div>
        </div>

        {/* Información Académica */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Información Académica</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Colegio
            </label>
            <p className="text-gray-900 break-words">{competidor.colegio}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Curso
            </label>
            <p className="text-gray-900">{competidor.gradoRange}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área de Inscripción
            </label>
            <p className="text-gray-900">{competidor.area}</p>
          </div>
        </div>

        {/* Condicionalmente mostrar secciones normales o Motivo de Rechazo */}
        {!isRechazado ? (
          <>
            {/* Información de Contacto */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Información de Contacto</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Celular
                </label>
                <p className="text-gray-900">{competidor.celular}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo de Contacto
                </label>
                <p className="text-gray-900 break-all">{competidor.emailContacto}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profesor o Tutor
                </label>
                <p className="text-gray-900 break-words">{competidor.tutorNombre}</p>
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-4">Ubicación</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento
                </label>
                <p className="text-gray-900">{competidor.departamento}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Municipio
                </label>
                <p className="text-gray-900">{competidor.municipio}</p>
              </div>
            </div>
          </>
        ) : (
          /* Motivo de Rechazo - Ocupa todo el espacio disponible */
          <div className="md:col-span-2 space-y-3 sm:space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-red-900 mb-3">
                    Motivo de Rechazo
                  </h3>
                  <div className="mb-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <XCircleIcon className="w-5 h-5 mr-2" />
                      Inscripción Rechazada
                    </span>
                  </div>
                  <div className="bg-white border border-red-200 rounded-md p-4">
                    <p className="text-red-800 leading-relaxed">
                      {competidor.motivoRechazo || 'No se especificó un motivo de rechazo.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Información de Pago - Solo si no está rechazado */}
      {!isRechazado && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Información de Pago</h3>
            <div>{getEstadoPagoBadge(competidor.estadoPago)}</div>
          </div>
        </div>
      )}

      {/* Botón Volver - Responsive */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
        <button
          onClick={onVolver}
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 sm:px-6 sm:py-3 border border-transparent text-base font-medium rounded-full text-white bg-gray-600 hover:bg-gray-500 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200
          transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
        >
          Volver
        </button>
      </div>
    </div>
    </div>
  );
}