'use client';
import React, { useState, FormEvent } from 'react';
import { useRegistro, InscripcionData } from '../context';
import { useRouter } from 'next/navigation';
import AreasSelector     from '@/components/registro/Formularios/extra/AreasSelector';
import CategorySelector  from '@/components/registro/Formularios/extra/CategorySelector';
import PaymentModal      from '@/components/Modals/regComp/PaymentModal';
import ConfirmationModal from '@/components/Modals/regComp/ConfirmationModal';

export default function InscripcionPage() {
  const router = useRouter();
  const { inscripciones, setInscripciones } = useRegistro();

  const [currentArea, setCurrentArea]           = useState<string>('');
  const [currentLevel, setCurrentLevel]         = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError]                       = useState('');

  const handlePayment = () => {
    setShowPaymentModal(false);
    setShowConfirmModal(true);
  };

  const closeConfirm = () => {
    const [categoria, nivel] = currentLevel.split('|');
    const nueva: InscripcionData = { area: currentArea, categoria, nivel };
    setInscripciones([ ...inscripciones, nueva ]);
    setShowConfirmModal(false);
    setCurrentArea('');
    setCurrentLevel('');
  };

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
      {error && <p className="text-red-600">{error}</p>}

      <AreasSelector
        selectedArea={currentArea}
        onSelectArea={setCurrentArea}
        disabled={inscripciones.length >= 2}
      />

      {currentArea && inscripciones.length < 2 && (
        <CategorySelector
          area={currentArea}
          onInscription={level => {
            setCurrentLevel(level);
            setShowPaymentModal(true);
          }}
        />
      )}

      {inscripciones.length > 0 && (
        <ul className="list-disc ml-5">
          {inscripciones.map((i, idx) => (
            <li key={idx}>
              {i.area} – {i.categoria} ({i.nivel})
            </li>
          ))}
        </ul>
      )}

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
