'use client';

import React, { FormEvent } from 'react';
import { useRegistro, TutorAssignmentData } from '@/app/registro/competidor/context';
import { inter } from '@/config/fonts';
import { getTutors } from '@/lib/api/registro';
import {registrarCompetidor} from '@/lib/api/registro';
import Swal from 'sweetalert2';
import { Grab, X } from 'lucide-react';

const tutores = await getTutors();

export default function TutorAssignmentPage() {
  const { personalData, inscripciones, tutorAssignments, setTutorAssignments, setInscripciones } = useRegistro();
  const [error, setError] = React.useState<string>('');

  const onSelectTutor = (area: string, tutorId: string) => {
    const tutor = tutores.find(t => t.codTut === tutorId);
    const nombreTutor = tutor?.nombre || '' ;

    setTutorAssignments((prev) => ({
      ...prev,
      [area]: { codTut: tutorId, nombre: nombreTutor } as TutorAssignmentData,
    }));
  };

  const onDeleteInscripcion = async (areaToDelete: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará la inscripción del área "${areaToDelete}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      // Eliminar de inscripciones
      setInscripciones(prev => prev.filter(insc => insc.area !== areaToDelete));
      
      // Eliminar de tutorAssignments
      setTutorAssignments(prev => {
        const newAssignments = { ...prev };
        delete newAssignments[areaToDelete];
        return newAssignments;
      });

      Swal.fire({
        title: 'Eliminado',
        text: 'La inscripción ha sido eliminada correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    for (const insc of inscripciones) {
      if (!tutorAssignments[insc.area]) {
        setError(`Selecciona un tutor para el área ${insc.area}`);
        return;
      }
    }
    console.log('Tutor assignments:', tutorAssignments);
    console.log('Inscripciones:', inscripciones); 
    console.log('Personal data:', personalData);
    setError('');

    const partes = personalData.apellido.trim().split(' ');
    const apellidoPaterno = partes[0] || '';
    const apellidoMaterno = partes.slice(1).join(' ') || '';

    const personaParaEnviar = {
      nombre: personalData.nombre,
      apellidoPaterno,
      apellidoMaterno,
      celular: personalData.celular,
      correoElectronico: personalData.correoElectronico,
      carnetIdentidad: personalData.carnetIdentidad,
      fechaNacimiento: personalData.fechaNacimiento, 
      municipio: personalData.municipio, 
      colegio: personalData.colegio,
      grado : personalData.grado,
    };
  
    let timerInterval: NodeJS.Timeout;
    await Swal.fire({
      title: 'Registrando...',
      html: 'No cierre la ventana del navegador',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: async () => {
        Swal.showLoading();
        timerInterval = setInterval(() => {
          const content = Swal.getHtmlContainer();
          if (content) {
            const b = content.querySelector('b');
            if (b) {
              b.textContent = Swal.getTimerLeft()?.toString() ?? '';
            }
          }
        }, 100);
  
        try {
          await registrarCompetidor(personaParaEnviar, inscripciones, tutorAssignments);
          clearInterval(timerInterval);
          Swal.close();
  
          window.dispatchEvent(new CustomEvent('open-confirmation-modal', { detail: inscripciones.length }));
          setTutorAssignments({});
          setInscripciones([]);
        } catch (error:any) {
          clearInterval(timerInterval);
          Swal.fire({
            icon: 'error',
            title: 'Error al registrar',
            text: error.message ||  'Ocurrió un problema al registrar al competidor. Intenta nuevamente.',
          });
        }
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });
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
              <th className="py-2 px-4 text-center">Acciones</th>
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
                      className="border-2 border-bright-gray-300 rounded p-2 w-full"
                    >
                      <option value="">Selecciona tutor</option>
                    {/* <!-- Filtra los tutores por área --> */}
                      {tutores.filter(t => t.nombreArea === insc.area).map(t => (
                        <option key={t.codTut} value={t.codTut}>
                          {t.nombre} {t.apellidoPaterno} {t.apellidoMaterno}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => onDeleteInscripcion(insc.area)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-colors duration-200"
                      title={`Eliminar inscripción de ${insc.area}`}
                    >
                      <X size={16} />
                    </button>
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