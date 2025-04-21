'use client';

import { useState, forwardRef } from 'react';
import AreasSelector from '@/components/registro/Formularios/extra/AreasSelector';
import CategorySelector from '@/components/registro/Formularios/extra/CategorySelector';
import PaymentModal from '@/components/Modals/regComp/PaymentModal';
import ConfirmationModal from '@/components/Modals/regComp/ConfirmationModal';

type Props = {
  onSubmitSuccess: () => void;
};

const Inscripcion = forwardRef<HTMLFormElement, Props>(({ onSubmitSuccess }, ref) => {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  const handleInscription = (level: string, category: string) => {
    setSelectedLevel(level);
    setSelectedCategory(category);
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    setShowPaymentModal(false);
    setShowConfirmationModal(true);
  };

  // <-- Cambiado aquí: no recibe e, firma () => void
  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
    setSelectedArea('');
    // Avanza al siguiente stepper
    onSubmitSuccess();
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-md shadow">
        <h1 className="text-2xl font-semibold text-gray-700 mb-2">Inscripción a olimpiadas</h1>
        <p className="text-gray-600 mb-6">
          Selecciona el área, categoría y nivel para ver los precios
        </p>
        
        <AreasSelector selectedArea={selectedArea} onSelectArea={setSelectedArea} />
        
        {selectedArea && (
          <CategorySelector 
            area={selectedArea} 
            onInscription={handleInscription} 
          />
        )}
      </div>

      {showPaymentModal && (
        <PaymentModal 
          onClose={() => setShowPaymentModal(false)} 
          onPayment={handlePayment} 
        />
      )}

      {showConfirmationModal && (
        <ConfirmationModal 
          area={selectedArea}
          level={selectedLevel}
          onClose={closeConfirmationModal}  // Ya encaja con () => void
        />
      )}
    </div>
  );
});

Inscripcion.displayName = 'Inscripcion';
export default Inscripcion;
