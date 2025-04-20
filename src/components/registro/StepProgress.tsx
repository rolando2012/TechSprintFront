'use client';

import { useState } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Form1 } from './Form1';

function FormStep1() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Formulario Paso 1</h2>
      <input
        type="text"
        placeholder="Campo del paso 1"
        className="w-full p-2 border rounded"
      />
    </div>
  );
}

function FormStep2() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Formulario Paso 2</h2>
      <input
        type="text"
        placeholder="Campo del paso 2"
        className="w-full p-2 border rounded"
      />
    </div>
  );
}

function FormStep3() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Formulario Paso 3</h2>
      <input
        type="text"
        placeholder="Campo del paso 3"
        className="w-full p-2 border rounded"
      />
    </div>
  );
}

export default function StepperFormWizard() {
  const [step, setStep] = useState<number>(1);
  const steps = [1, 2, 3];

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const renderForm = () => {
    switch (step) {
      case 1:
        return <Form1 />;
      case 2:
        return <FormStep2 />;
      case 3:
        return <FormStep3 />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      {/* Stepper */}
      <ol className="flex justify-center w-full mb-8">
        {steps.map((s) => {
          const isCompleted = step > s;
          const isCurrent = step === s;

          // Línea entre pasos: solo negra si el paso anterior fue completado
          const lineClass = s < steps.length
            ? `after:content-["\""] after:w-full after:h-1 after:border-4 after:inline-block ${isCompleted ? 'after:border-black' : 'after:border-gray-200'}`
            : '';

          const liClasses = ['flex items-center w-full', lineClass]
            .filter(Boolean)
            .join(' ');

          const spanClasses = [
            'flex items-center justify-center w-10 h-10 rounded-full shrink-0 lg:w-12 lg:h-12',
            (isCurrent || isCompleted) ? 'bg-black text-white' : 'bg-gray-300 text-gray-600',
          ].join(' ');

          return (
            <li key={s} className={liClasses}>
              <span className={spanClasses}>
                {isCompleted ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{s}</span>
                )}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Formulario del paso */}
      <div className="mb-6">{renderForm()}</div>

      {/* Botones de navegación */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={step === 1}
          className="px-4 py-2 bg-bright-gray-400 text-white rounded-2xl disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={step === steps.length}
          className="px-4 py-2 bg-boton text-white rounded-2xl disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
