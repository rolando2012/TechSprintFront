'use client';
import React, { useState, FormEvent } from 'react';
import { useRegistro } from '../context';
import { useRouter } from 'next/navigation';
import { tutors } from '@/lib/dataTutor';

export default function TutorAssignmentPage() {
  const router = useRouter();
  const { personalData, inscripciones } = useRegistro();
  const [selectedTutors, setSelectedTutors] = useState<Record<string, string>>({});
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  const onSelectTutor = (area: string, tutorId: string) => {
    setSelectedTutors(prev => ({ ...prev, [area]: tutorId }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    for (const insc of inscripciones) {
      if (!selectedTutors[insc.area]) {
        setError(`Selecciona un tutor para el área ${insc.area}`);
        return;
      }
    }
    setError('');

    const payload = {
      personalData,
      inscripciones,
      tutorAssignments: inscripciones.map(insc => ({
        area: insc.area,
        tutorId: selectedTutors[insc.area],
      })),
    };
    router.push("/");

    // try {
    //   const res = await fetch('http://localhost:4000/registro', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(payload),
    //   });
    //   if (!res.ok) throw new Error(`HTTP ${res.status}`);
    //   setSuccess('¡Registro completo con éxito!');
    //   // Opcional: router.push('/gracias');
    // } catch (err: any) {
    //   setError('Error al enviar: ' + err.message);
    // }
  };

  return (
    <form id="tutorForm" onSubmit={onSubmit} className="space-y-6">
      {error   && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <h2 className="text-xl font-semibold">
        {personalData.nombre} {personalData.apellido} — Grado: {personalData.grado}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2">
              <th className="py-2 px-4 text-left">Área</th>
              <th className="py-2 px-4 text-left">Categoría</th>
              <th className="py-2 px-4 text-left">Nivel</th>
              <th className="py-2 px-4 text-left">Tutor</th>
            </tr>
          </thead>
          <tbody>
            {inscripciones.map((insc, i) => {
              const disponibles = tutors.filter(t => t.areas.includes(insc.area));
              return (
                <tr key={i} className="border-b">
                  <td className="py-2 px-4">{insc.area}</td>
                  <td className="py-2 px-4">{insc.categoria}</td>
                  <td className="py-2 px-4">{insc.nivel}</td>
                  <td className="py-2 px-4">
                    <select
                      value={selectedTutors[insc.area] || ''}
                      onChange={e => onSelectTutor(insc.area, e.target.value)}
                      className="border rounded p-2 w-full"
                    >
                      <option value="">Selecciona tutor</option>
                      {disponibles.map(t => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
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
