import React from 'react';
import { adlam } from '@/config/fonts';

interface ConfirmationModalProps {
  /** Número de inscripciones realizadas */
  count: number;
  /** Callback para cerrar el modal */
  onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ count, onClose }) => {
  const title =
    count === 2
      ? 'Solicitudes de Validación Enviadas'
      : 'Solicitud de Validación Enviada';

  const message =
    count === 2
      ? 'Tus dos solicitudes de validación han sido enviadas a sus respectivos tutores. Por favor, espera la aprobación.'
      : 'Tu solicitud de validación ha sido enviada exitosamente al tutor. Por favor, espera la aprobación.';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          aria-label="Cerrar modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className={`text-center ${adlam.className}`}>          
          <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-gray-700 mb-6">{message}</p>

          <button
            onClick={onClose}
            className="bg-boton hover:bg-boton-hover text-white px-6 py-2 rounded-md transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
