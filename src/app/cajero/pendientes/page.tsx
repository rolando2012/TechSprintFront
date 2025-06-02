'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Loader2, 
  FileX,
  Calendar,
  MapPin,
  X,
  Check
} from 'lucide-react';
import { obtenerPagosPendientes, PagoPendiente, aceptarPago } from '@/lib/api/cajero';
import Link from 'next/link';
import Swal from 'sweetalert2';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  pago: PagoPendiente | null;
  onAceptar: (codIns: number) => Promise<void>;
}

const Modal = ({ isOpen, onClose, pago, onAceptar }: ModalProps) => {
  if (!isOpen || !pago) return null;

  const handleAceptar = async () => {
    try {
      await onAceptar(pago.codIns);
      onClose();
    } catch (error) {
      console.error('Error al aceptar pago:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Header */}
          <div className="bg-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-white" />
                <h3 className="text-lg font-semibold text-white">Confirmar Pago</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-4">
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Detalles del Pago</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estudiante:</span>
                    <span className="font-medium">{pago.nombre} {pago.apellidoPaterno}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">C.I.:</span>
                    <span className="font-medium">{pago.carnet || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Colegio:</span>
                    <span className="font-medium">{pago.colegio || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nivel:</span>
                    <span className="font-medium">{pago.gradoRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Área:</span>
                    <span className="font-medium">{pago.area}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  ¿Está seguro de que desea aprobar este pago? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleAceptar}
              className="px-4 py-2 text-sm font-medium text-white bg-boton border-transparent rounded-md hover:bg-boton-hover
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-boton flex items-center gap-2
              transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Aceptar Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EstadoBadge = ({ estado }: { estado: string }) => {
  const getEstadoConfig = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'verificado':
      case 'aprobado':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: CheckCircle,
          label: 'APROBADO'
        };
      case 'pendiente':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: Clock,
          label: 'PENDIENTE'
        };
      case 'rechazado':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: AlertCircle,
          label: 'RECHAZADO'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          icon: Clock,
          label: estado.toUpperCase()
        };
    }
  };

  const config = getEstadoConfig(estado);
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      <IconComponent className="w-3 h-3" />
      {config.label}
    </span>
  );
};

const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export default function PagosPendientesPage() {
  const [pagosPendientes, setPagosPendientes] = useState<PagoPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<PagoPendiente | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        const datos = await obtenerPagosPendientes();
        setPagosPendientes(datos);
      } catch (err) {
        setError('Error al cargar los pagos pendientes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleFilaClick = (pago: PagoPendiente) => {
    setPagoSeleccionado(pago);
    setModalOpen(true);
  };

  const handleAceptarPago = async (codIns: number) => {
    // Mostrar loading con SweetAlert2
    Swal.fire({
      title: 'Procesando pago...',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Llamar a la función de aceptar pago
      await aceptarPago(codIns);
      
      // Cerrar el loading
      Swal.close();
      
      // Mostrar mensaje de éxito
      await Swal.fire({
        title: 'Pago Aceptado',
        text: 'El pago ha sido procesado exitosamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      // Actualizar la tabla removiendo el pago aceptado
      setPagosPendientes(prev => prev.filter(pago => pago.codIns !== codIns));
      
    } catch (error: any) {
      // Cerrar el loading
      Swal.close();
      
      // Mostrar mensaje de error
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Ocurrió un error al procesar el pago',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-yellow-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Cargando pagos pendientes...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pagosPendientes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="bg-gray-700 px-6 py-4 rounded-t-lg">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-white" />
                <h1 className="text-lg font-semibold text-white">Pagos Pendientes</h1>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <FileX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pagos pendientes</h3>
                  <p className="text-gray-500">No se encontraron registros de pagos pendientes en este momento.</p>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 rounded-b-lg flex justify-end border-t border-gray-200">
                <Link 
                    href='/cajero'
                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-full text-sm 
                    font-medium transition-all transform hover:scale-105 active:scale-95">
                    Volver
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="bg-gray-700 px-6 py-4 rounded-t-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-white" />
              <h1 className="text-lg font-semibold text-white">Pagos Pendientes</h1>
            </div>
            <p className="text-gray-300 text-sm mt-1">Haz clic en una fila para procesar el pago</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    C.I.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Colegio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Nivel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Área
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Estado de Inscripción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagosPendientes.map((pago, index) => (
                  <tr 
                    key={`${pago.codComp}-${index}`} 
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => handleFilaClick(pago)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pago.nombre} {pago.apellidoPaterno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pago.carnet || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {pago.colegio || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {pago.gradoRange}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {pago.area}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {formatearFecha(pago.fechaInscripcion)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EstadoBadge estado={pago.estadoInscripcion} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 rounded-b-lg flex justify-end border-t border-gray-200">
            <Link 
                href='/cajero'
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-full text-sm 
                font-medium transition-all transform hover:scale-105 active:scale-95">
                Volver
            </Link>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        pago={pagoSeleccionado}
        onAceptar={handleAceptarPago}
      />
    </div>
  );
}