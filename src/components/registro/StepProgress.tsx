'use client';

import { useState, ReactNode } from 'react';
import { Form1 } from "@/components/registro/Form1";

// Íconos para cada paso
const icons: ReactNode[] = [
  <svg
    key="icon1"
    className="w-3.5 h-3.5 lg:w-4 lg:h-4"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 16 12"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M1 5.917 5.724 10.5 15 1.5"
    />
  </svg>,
  <svg
    key="icon2"
    className="w-4 h-4 lg:w-5 lg:h-5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 16"
  >
    <path d="M18 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2ZM6.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3.014 13.021l.157-.625A3.427 3.427 0 0 1 6.5 9.571a3.426 3.426 0 0 1 3.322 2.805l.159.622-6.967.023ZM16 12h-3a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Zm0-3h-3a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2Z" />
  </svg>,
  <svg
    key="icon3"
    className="w-4 h-4 lg:w-5 lg:h-5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 18 20"
  >
    <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2ZM7 2h4v3H7V2Zm5.7 8.289-3.975 3.857a1 1 0 0 1-1.393 0L5.3 12.182a1.002 1.002 0 1 1 1.4-1.436l1.328 1.289 3.28-3.181a1 1 0 1 1 1.392 1.435Z" />
  </svg>,
];

// Componentes de formulario de ejemplo para cada paso
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
      <ol className="flex items-center w-full mb-8">
        {steps.map((s, i) => {
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
            isCurrent ? 'bg-black text-white' : 'bg-gray-300 text-gray-600',
          ].join(' ');

          return (
            <li key={s} className={liClasses}>
              <span className={spanClasses}>{icons[i]}</span>
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
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={step === steps.length}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
