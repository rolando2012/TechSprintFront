'use client';

import React, { FormEvent } from 'react';
import { useRegistro, TutorAssignmentData } from '@/app/registro/competidor/context';
import { inter } from '@/config/fonts';
import { getTutors } from '@/lib/api/registro';

const tutores = await getTutors();

export default function TutorAssignmentPage() {
  const { personalData, inscripciones, tutorAssignments, setTutorAssignments } = useRegistro();
  const [error, setError] = React.useState<string>('');

  const onSelectTutor = (area: string, tutorId: string) => {
    const tutor = tutores.find(t => t.codTut === tutorId);
    const nombreTutor = tutor?.nombre || '' ;

    setTutorAssignments((prev) => ({
      ...prev,
      [area]: { codTut: tutorId, nombre: nombreTutor } as TutorAssignmentData,
    }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    for (const insc of inscripciones) {
      if (!tutorAssignments[insc.area]) {
        setError(`Selecciona un tutor para el área ${insc.area}`);
        return;
      }
    }

    console.log('Datos:', {
      personalData,
      inscripciones,
      tutorAssignments,
    });

    setError('');
    window.dispatchEvent(new CustomEvent('open-confirmation-modal', { detail: inscripciones.length }));
  };

  return (
    <form id="tutorForm" onSubmit={onSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}

      <h2 className="text-lg text-gray-700 mb-4">Asignación de tutor(es)</h2>
      <p className={`text-md text-gray-500 mb-4 ${inter.className} font-semibold`}>
        Seleccione tutor para su área respectiva
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
              const fullName = `${personalData.nombre} ${personalData.apellido}`;
              const selected = tutorAssignments[insc.area]?.codTut || '';

              return (
                <tr key={i} className={`border-b border-gray-200 text-gray-500 ${inter.className} font-semibold`}>
                  <td className="py-2 px-4">{fullName}</td>
                  <td className="py-2 px-4">{personalData.grado}</td>
                  <td className="py-2 px-4">{insc.area}</td>
                  <td className="py-2 px-4">
                    <select
                      value={selected}
                      onChange={e => onSelectTutor(insc.area, e.target.value,)}
                      className="border rounded p-2 w-full"
                    >
                      <option value="">Selecciona tutor</option>
                      {tutores.map(t => (
                        <option key={t.codTut} value={t.codTut}>
                          {t.nombre} {t.apellidoPaterno} {t.apellidoMaterno}
                        </option>
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
