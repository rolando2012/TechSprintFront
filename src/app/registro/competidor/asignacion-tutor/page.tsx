'use client';

import React, { useState, FormEvent } from 'react';
import { useRegistro } from '../context';
import {inter} from '@/config/fonts';
import { getTutors } from '@/lib/api/registro';

const tutores = await getTutors();

export default function TutorAssignmentPage() {
  
  const { personalData, inscripciones } = useRegistro();
  const [selectedTutors, setSelectedTutors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>('');

  const onSelectTutor = (area: string, tutorId: string) => {
    setSelectedTutors(prev => ({ ...prev, [area]: tutorId }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    for (const insc of inscripciones) {
      if (!selectedTutors[insc.area]) {
        setError(`Selecciona un tutor para el área ${insc.area}`);
        return;
      }
    }
    setError('');
    window.dispatchEvent(new CustomEvent('open-confirmation-modal', { detail: inscripciones.length }));
  };

  return (
    <form id="tutorForm" onSubmit={onSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}

      <h2 className="text-lg  text-gray-700 mb-4">Asignacion de tutor o tutores</h2>
      <p className={`text-md text-gray-500 mb-4 ${inter.className} font-semibold`}>
      Seleccione tutor para su area respectiva
      </p>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className={`border-b-2 border-gray-300 ${inter.className} font-semibold`}>
              <th className="py-2 px-4 text-left">Nombre completo</th>
              <th className="py-2 px-4 text-left">Grado</th>
              <th className="py-2 px-4 text-left">Área(s) de competencia</th>
              <th className="py-2 px-4 text-left">Tutor asignado</th>
            </tr>
          </thead>
          <tbody>
            {inscripciones.map((insc, i) => {
              //const disponibles = tutors.filter(t => t.areas.includes(insc.area));
              const fullName = `${personalData.nombre} ${personalData.apellido}`;
              return (
                <tr key={i} className={`border-b border-gray-200 text-gray-500 ${inter.className} font-semibold`}>
                  <td className="py-2 px-4">{fullName}</td>
                  <td className="py-2 px-4">{personalData.grado}</td>
                  <td className="py-2 px-4">{insc.area}</td>
                  <td className="py-2 px-4">
                    <select
                      value={selectedTutors[insc.area] ?? ''}
                      onChange={e => onSelectTutor(insc.area, e.target.value)}
                      className="border rounded p-2 w-full"
                    >
                      <option value="">Selecciona tutor</option>
                      {tutores.map(t => (
                        <option key={t.codTut} value={t.codTut}>{t.nombre} {t.apellidoPaterno} {t.apellidoMaterno}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </form>
  );
}
