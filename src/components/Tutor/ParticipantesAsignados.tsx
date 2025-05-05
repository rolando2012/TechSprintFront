'use client';
import { useState, useEffect } from 'react';
import { getCompetidoresByTutor } from '@/lib/api/competidor';
import { CompetidoresByTutor } from '@/lib/api/competidor';
import Link from 'next/link'
import { RiFileSettingsFill } from "react-icons/ri";

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

  const getEstadoClass = (carnet: string, colegio: string) => {
    if (!carnet || !colegio) return 'bg-gray-400 text-white';
    
    // This is a simplified logic - in a real app, you'd likely have a status field
    const hash = (carnet.toString().charCodeAt(0) + colegio.charCodeAt(0)) % 3;
    
    if (hash === 0) return 'bg-blue-500 text-white';
    if (hash === 1) return 'bg-gray-400 text-white';
    return 'bg-red-500 text-white';
  };

  const getEstadoText = (carnet: string, colegio: string) => {
    if (!carnet || !colegio) return 'PENDIENTE';
    
    const hash = (carnet.toString().charCodeAt(0) + colegio.charCodeAt(0)) % 3;
    
    if (hash === 0) return 'VERIFICADO';
    if (hash === 1) return 'PENDIENTE';
    return 'RECHAZADO';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
      <RiFileSettingsFill className='h-16 w-16'/>
        <div className="text-3xl font-bold">Participantes Asignados</div>
        
      </div>
      
      {loading ? (
        <div className="text-center py-8">Cargando participantes...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-600 text-white">
                  <th className="p-4 text-left">Nombre</th>
                  <th className="p-4 text-left">C.I.</th>
                  <th className="p-4 text-left">Colegio</th>
                  <th className="p-4 text-left">Nivel</th>
                  <th className="p-4 text-left">Estado de Inscripción</th>
                </tr>
              </thead>
              <tbody>
                {participantes.map((participante, index) => (
                  <tr 
                    key={index} 
                    className={index % 2 === 0 ? 'bg-slate-700 text-white' : 'bg-slate-600 text-white'}
                  >
                    <td className="p-4">{`${participante.nombre} ${participante.apellidoPaterno}`}</td>
                    <td className="p-4">{participante.carnet || '-'}</td>
                    <td className="p-4">{participante.colegio || '-'}</td>
                    <td className="p-4">{participante.gradoRange}</td>
                    <td className="p-4">
                      <div className={`px-4 py-2 rounded text-center ${getEstadoClass(participante.carnet, participante.colegio)}`}>
                        {getEstadoText(participante.carnet, participante.colegio)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end mt-4">
            <Link 
                href='/tutor'
              className="px-6 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
            >
              Volver
            </Link>
          </div>
        </>
      )}
    </div>
  );
}