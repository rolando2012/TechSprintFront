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
  MapPin
} from 'lucide-react';
import { obtenerPagosPendientes, PagoPendiente } from '@/lib/api/cajero';
import Link from 'next/link';


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
                  <tr key={`${pago.codComp}-${index}`} className="hover:bg-gray-50">
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
    </div>
  );
}