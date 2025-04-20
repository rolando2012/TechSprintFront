'use client';

import React from 'react';

interface NextButtonProps {
  /**
   * Función que valida los datos del formulario.
   * Debe retornar true si es válido, false en caso contrario.
   */
  validateForm: () => boolean;
  /**
   * Callback para avanzar al siguiente paso del stepper.
   */
  onNext: () => void;
  /**
   * Deshabilita el botón en ciertos escenarios (e.g. loading).
   */
  disabled?: boolean;
  /**
   * Texto del botón (por defecto "Siguiente").
   */
  label?: string;
}

export default function NextButton({
  validateForm,
  onNext,
  disabled = false,
  label = 'Siguiente',
}: NextButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-300 transition"
    >
      {label}
    </button>
  );
}