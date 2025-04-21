'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/solid';
import FormStep3 from '@/components/registro/Formularios/FormStep3';
import PersonalDataForm from '@/components/registro/Formularios/PersonalDataForm';
import Inscripcion from '@/components/registro/Formularios/Inscripcion';
import Modal from "@/components/Modals/ModalProps"; 
import SubmitButton from '@/components/registro/SubmitButton';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function StepperFormWizard() {
  const [step, setStep] = useState(1);
  const steps = [1, 2, 3];
  const formRef = useRef<HTMLFormElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir la navegación
    setIsModalOpen(true);
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const renderForm = () => {
    const props = { onSubmitSuccess: handleNext, ref: formRef } as const;
    if (step === 1) return <PersonalDataForm {...props} />;
    if (step === 2) return <Inscripcion {...props} />;
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
          
          className={`px-4 py-2 bg-bright-gray-400 hover:bg-bright-gray-500 text-white rounded-2xl  ${step === 1 || step === steps.length ? 'hidden' : 'block'}`}
        >
          Anterior
        </button>
        <button
          onClick={() => formRef.current?.requestSubmit()}

          className={`px-4 py-2 bg-boton hover:bg-boton-hover text-white rounded-2xl ${step !== 1 ? 'hidden' : 'block'}`}
        >
          Siguiente
        </button>
        <div className={`${step !== steps.length ? 'hidden' : 'block'}`}>
        <SubmitButton/>
        </div>
        <a
        href="#"
        onClick={openModal}
        className="px-4 py-2 block bg-boton-2 hover:bg-boton-2-hover text-white rounded-2xl disabled:opacity-50"
      >
        Cancelar
      </a>

      {isModalOpen && (
        <Modal  onClose={() => setIsModalOpen(false)}>
            
        <ExclamationCircleIcon className="w-16 h-16 text-white-500 mb-4" />
          <p>¿Estás suguro de cancelar el registro?</p>
          <Link href="/" className="mt-4 px-4 py-2 bg-boton-2 hover:bg-boton-2-hover text-white rounded-2xl">
            Sí, estoy seguro
          </Link>
        </Modal>
      )}
      </div>
    </div>
  );
}
