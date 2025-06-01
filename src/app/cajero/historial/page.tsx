'use client';

import { useState, useEffect } from 'react';
import { 
  History, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2, 
  AlertCircle,
  FileX,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  TrendingUp
} from 'lucide-react';
import {HistorialPago, EstadisticasPago,obtenerHistorialPagos,obtenerEstadisticasPago} from '@/lib/api/cajero';

const EstadoBadge = ({ estado }: { estado: string }) => {
  const getEstadoConfig = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pagado':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          icon: CheckCircle,
          label: 'PAGADO'
        };
      case 'pendiente':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          icon: Clock,
          label: 'PENDIENTE'
        };
      case 'reembolsado':
        return {
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          icon: TrendingUp,
          label: 'REEMBOLSADO'
        };
      case 'cancelado':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          icon: XCircle,
          label: 'CANCELADO'
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
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      <IconComponent className="w-3 h-3" />
      {config.label}
    </span>
  );
};

const StatCard = ({ title, value, icon: Icon, bgColor, textColor }: { 
  title: string; 
  value: string | number; 
  icon: any; 
  bgColor: string;
  textColor: string;
}) => (
  <div className={`${bgColor} border border-gray-200 rounded-lg p-4`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        <p className={`text-sm ${textColor} mt-1`}>{title}</p>
      </div>
      <Icon className={`w-8 h-8 ${textColor}`} />
    </div>
  </div>
);

const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const formatearMonto = (monto: number): string => {
  return `Bs. ${monto.toFixed(2)}`;
};

export default function HistorialPagosPage() {
  const [historialPagos, setHistorialPagos] = useState<HistorialPago[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasPago | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [historialData, estadisticasData] = await Promise.all([
          obtenerHistorialPagos(),
          obtenerEstadisticasPago()
        ]);
        
        setHistorialPagos(historialData);
        setEstadisticas(estadisticasData);
      } catch (err) {
        setError('Error al cargar los datos del historial');
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
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Cargando historial de pagos...</p>
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Estadísticas */}
        {estadisticas && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Registros"
              value={estadisticas.totalRegistros}
              icon={Users}
              bgColor="bg-blue-100"
              textColor="text-blue-800"
            />
            <StatCard
              title="Pagos Exitosos"
              value={estadisticas.pagosExitosos}
              icon={CheckCircle}
              bgColor="bg-green-100"
              textColor="text-green-800"
            />
            <StatCard
              title="Total Recaudado"
              value={estadisticas.totalRecaudado}
              icon={DollarSign}
              bgColor="bg-purple-100"
              textColor="text-purple-800"
            />
          </div>
        )}

        {/* Tabla de Historial */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="bg-gray-700 px-6 py-4 rounded-t-lg">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-white" />
              <h1 className="text-lg font-semibold text-white">Historial de pagos</h1>
            </div>
          </div>

          {historialPagos.length === 0 ? (
            <div className="p-8">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <FileX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay historial de pagos</h3>
                  <p className="text-gray-500">No se encontraron registros de pagos en este momento.</p>
                </div>
              </div>
            </div>
          ) : (
            <>
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
                        Área
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historialPagos.map((pago, index) => (
                      <tr key={`${pago.codComp}-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pago.nombre} {pago.apellidoPaterno}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pago.carnet}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {pago.colegio}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {pago.area}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-gray-400" />
                            {formatearMonto(pago.monto)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            {formatearFecha(pago.fechaInscripcion)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <EstadoBadge estado={pago.estadoPago} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-3 rounded-b-lg flex justify-end border-t border-gray-200">
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                  Volver
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}