'use client';
import React, { useState, FormEvent } from 'react';
import { useRegistro, InscripcionData } from '../context';
import { useRouter } from 'next/navigation';
import AreasSelector     from '@/components/registro/AreasSelector';
import CategorySelector  from '@/components/registro/CategorySelector';
import PaymentModal      from '@/components/Modals/regComp/PaymentModal';
import ConfirmationModal from '@/components/Modals/regComp/ConfirmationModal';

export default function InscripcionPage() {
  const router = useRouter();
  const { inscripciones, setInscripciones } = useRegistro();

  const [currentArea, setCurrentArea]           = useState<string>('');
  const [currentLevel, setCurrentLevel]         = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError]                       = useState<string>('');

  // Al seleccionar un área, limpiamos errores y cambiamos área
  const handleSelectArea = (area: string) => {
    setError('');
    setCurrentArea(area);
  };

  const handlePayment = () => {
    setShowPaymentModal(false);
    setShowConfirmModal(true);
  };

  // Al cerrar confirmación, guardamos la inscripción y limpiamos errores
  const closeConfirm = () => {
    const [categoria, nivel] = currentLevel.split('|');
    const nueva: InscripcionData = { area: currentArea, categoria, nivel };
    setInscripciones([ ...inscripciones, nueva ]);
    setError('');
    setShowConfirmModal(false);
    setCurrentArea('');
    setCurrentLevel('');
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Validación solo al enviar
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
      {/* Error solo al enviar */}
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
          onInscription={(level) => {
            setCurrentLevel(level);
            setShowPaymentModal(true);
          }}
        />
      )}

      {/* Listado de inscripciones dadas de alta */}
      {inscripciones.length > 0 && (
        <ul className="list-disc ml-5">
          {inscripciones.map((i, idx) => (
            <li key={idx}>
              {i.area} – {i.categoria} ({i.nivel})
            </li>
          ))}
        </ul>
      )}

      {/* Modales */}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onPayment={handlePayment}
        />
      )}
      {showConfirmModal && (
        <ConfirmationModal
          area={currentArea}
          level={currentLevel}
          onClose={closeConfirm}
        />
      )}
    </form>
  );
}
