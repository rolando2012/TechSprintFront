'use client';
import { useState, useEffect } from 'react';
import { getCompetidoresByTutor } from '@/lib/api/competidor';
import { CompetidoresByTutor } from '@/lib/api/competidor';
import Link from 'next/link';
import { RiFileSettingsFill } from "react-icons/ri";
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon 
} from '@heroicons/react/24/solid';

interface ParticipantesAsignadosProps {
  tutorId: string;
}

export default function ParticipantesAsignados({ tutorId }: ParticipantesAsignadosProps) {
  const [participantes, setParticipantes] = useState<CompetidoresByTutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParticipantes = async () => {
      try {
        setLoading(true);
        const data = await getCompetidoresByTutor(tutorId);
        setParticipantes(data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los participantes');
        setLoading(false);
      }
    };

    fetchParticipantes();
  }, [tutorId]);

  const getEstadoBadge = (estadoInscripcion: string) => {
    switch (estadoInscripcion) {
      case 'Verificado':
      case 'VERIFICADO':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-boton">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            VERIFICADO
          </span>
        );
      case 'Pendiente':
      case 'PENDIENTE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-boton-3">
            <ClockIcon className="w-4 h-4 mr-1" />
            PENDIENTE
          </span>
        );
      case 'Rechazado':
      case 'RECHAZADO':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-boton-2">
            <XCircleIcon className="w-4 h-4 mr-1" />
            RECHAZADO
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <ClockIcon className="w-4 h-4 mr-1" />
            {estadoInscripcion}
          </span>
        );
    }
  };

  const formatFecha = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <RiFileSettingsFill className='h-8 w-8 text-gray-700'/>
        <h1 className="text-2xl font-semibold text-gray-900">Participantes Asignados</h1>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Cargando participantes...</div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500">{error}</div>
        </div>
      ) : participantes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <RiFileSettingsFill className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay competidores registrados
          </h3>
          <p className="text-gray-500 mb-6">
            Aún no tienes participantes asignados en tu tutorías.
          </p>
          <Link 
            href='/tutor'
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
          >
            Volver
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-600 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    C.I.
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Colegio
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Nivel
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Área
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Fecha de Inscripción
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white uppercase tracking-wider">
                    Estado de Inscripción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {participantes.map((participante, index) => (
                  <tr 
                    key={index} 
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-gray-100 transition-colors duration-150`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {`${participante.nombre} ${participante.apellidoPaterno}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {participante.carnet || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {participante.colegio || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {participante.gradoRange}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {participante.area}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {formatFecha(participante.fechaInscripcion)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEstadoBadge(participante.estadoInscripcion)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
            <Link 
              href='/tutor'
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-gray-600 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Volver
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}