'use client';
import { useState, useRef } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import FormStep1 from '@/components/registro/Formularios/FormStep1';
import FormStep2 from '@/components/registro/Formularios/FormStep2';
import FormStep3 from '@/components/registro/Formularios/FormStep3';

export default function StepperFormWizard() {
  const [step, setStep] = useState(1);
  const steps = [1, 2, 3];
  const formRef = useRef<HTMLFormElement>(null);

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const renderForm = () => {
    const props = { onSubmitSuccess: handleNext, ref: formRef } as const;
    if (step === 1) return <FormStep1 {...props} />;
    if (step === 2) return <FormStep2 {...props} />;
    return <FormStep3 {...props} />;
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      {/* Stepper visual */}
      <ol className="flex items-center w-full mb-8">
        {steps.map((s) => {
          const completed = step > s;
          const current = step === s;
          const lineClass = s < steps.length
            ? `after:content-[''] after:w-full after:h-1 after:border-4 after:inline-block ${
                completed ? 'after:border-black' : 'after:border-gray-200'
              }`
            : '';
          return (
            <li key={s} className={['flex items-center w-full', lineClass].join(' ')}>
              <span
                className={[
                  'flex items-center justify-center w-10 h-10 rounded-full shrink-0 lg:w-12 lg:h-12',
                  completed || current
                    ? 'bg-black text-white'
                    : 'bg-gray-300 text-gray-600',
                ].join(' ')}
              >
                {completed ? <CheckIcon className="w-5 h-5" /> : <span className="font-semibold">{s}</span>}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Contenido dinámico */}
      <div className="mb-6">{renderForm()}</div>

      {/* Botones */}
      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={step === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() => formRef.current?.requestSubmit()}
          disabled={step === steps.length}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
