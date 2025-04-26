'use client';

import React, { useState, FormEvent } from 'react';
import { useRegistro, InscripcionData } from '../context';
import { useRouter } from 'next/navigation';
import AreasSelector     from '@/components/registro/AreasSelector';
import CategorySelector  from '@/components/registro/CategorySelector';
import Swal from 'sweetalert2';

export default function InscripcionPage() {
  const router = useRouter();
  const { inscripciones, setInscripciones } = useRegistro();

  const [currentArea, setCurrentArea] = useState<string>('');
  const [error, setError]            = useState<string>('');

  // Al seleccionar un área, limpiamos errores y cambiamos área
  const handleSelectArea = (area: string) => {
    if (inscripciones.length >= 2) 
      setError('Solo puedes inscribirte a dos áreas.');
    else setError('');
    setCurrentArea(area);
  };

  // Maneja la inscripción directamente, sin modal de confirmación
  const handleInscription = (level: string) => {
    // Previene duplicar la misma área
    if (inscripciones.some(i => i.area === currentArea)) {
      Swal.fire({
        icon: 'warning',
        title: 'Ya estás inscrito',
        text: `Ya tienes una inscripción en el área de ${currentArea}`,
        confirmButtonColor: '#00abe4',
      });
      return;
    }

    // Limita a dos inscripciones
    if (inscripciones.length >= 2) {
      setError('Solo puedes inscribirte a dos áreas.');
      return;
    }

    // Agregar inscripción
    const [categoria, nivel] = level.split('|');
    const nueva: InscripcionData = { area: currentArea, categoria, nivel };
    setInscripciones([...inscripciones, nueva]);
    setCurrentArea('');
    setError('');

    Swal.fire({
      icon: 'success',
      title: 'Inscripción exitosa',
      text: 'Tu inscripción se ha registrado correctamente.',
      confirmButtonColor: '#00abe4',
    });
  };

  // Al enviar el formulario, redirige si hay al menos una inscripción
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inscripciones.length < 1) {
      setError('Debes inscribirte al menos en una área.');
      return;
    }
    if (inscripciones.length > 2) {
      setError('Solo puedes inscribirte a dos áreas.');
      return;
    }
    router.push('/registro/competidor/asignacion-tutor');
  };

  return (
    <form id="inscripcionForm" onSubmit={onSubmit} className="space-y-6">
      {/* Error solo al enviar o límite */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Selector de áreas: deshabilitado tras 2 inscripciones */}
      <AreasSelector
        selectedArea={currentArea}
        onSelectArea={handleSelectArea}
        disabled={inscripciones.length >= 2}
        
      />

      {/* Category sólo si hay área y menos de 2 inscripciones */}
      {currentArea && inscripciones.length < 2 && (
        <CategorySelector
          area={currentArea}
          onInscription={handleInscription}
        />
      )}
    </form>
  );
}
