'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/solid';
import PersonalDataForm from '@/components/registro/Formularios/PersonalDataForm';
import Inscripcion from '@/components/registro/Formularios/Inscripcion';
import TutorAssignment from '@/components/registro/Formularios/TutorAssignment';
import Modal from "@/components/Modals/ModalProps"; 
import SubmitButton from '@/components/registro/SubmitButton';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function StepperFormWizard() {
  const [step, setStep] = useState(1);
  const steps = [1, 2, 3];
  const formRef = useRef<HTMLFormElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const renderForm = () => {
    const props = { onSubmitSuccess: handleNext, ref: formRef };
    if (step === 1) return <PersonalDataForm {...props} />;
    if (step === 2) return <Inscripcion {...props} />;
    return <TutorAssignment studentId="1" {...props} />;
  };

  return (
    <div className="w-full mx-auto p-4">
      {/* Improved Stepper that matches the image */}
      <div className="flex justify-center items-center mb-12">
        <div className="relative flex items-center w-full max-w-md justify-between">
          {/* Line connecting the steps */}
          {steps.map((s, index) => {
            // Don't render a line after the last step
            if (index === steps.length - 1) return null;
            
            const isCompleted = step > s;
            
            return (
              <div 
                key={`line-${s}`} 
                className={`absolute h-1 top-1/2 -translate-y-1/2 z-0 ${
                  isCompleted ? 'bg-black' : 'bg-gray-200'
                }`}
                style={{
                  left: `${(100 / (steps.length - 1)) * index}%`,
                  right: `${100 - ((100 / (steps.length - 1)) * (index + 1))}%`
                }}
              />
            );
          })}
          
          {/* Steps */}
          {steps.map((s) => {
            const completed = step > s;
            const current = step === s;
            
            return (
              <div key={s} className="relative flex items-center justify-center z-10">
                <div 
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2
                    ${current ? 'bg-black border-black text-white' : ''}
                    ${completed ? 'bg-black border-black text-white' : ''}
                    ${!completed && !current ? 'bg-white border-gray-300 text-black' : ''}
                  `}
                >
                  {completed ? (
                    <CheckIcon className="w-6 h-6" />
                  ) : (
                    <span className="text-lg font-medium">{s}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="mb-8 w-full">{renderForm()}</div>

      {/* Buttons */}
      <div className="flex justify-center gap-8 w-full mt-6">
        <button
          onClick={handlePrev}
          className={`px-6 py-2 bg-bright-gray-400 hover:bg-bright-gray-500 text-white rounded-2xl ${
            step === 1 || step === steps.length ? 'hidden' : 'block'
          }`}
        >
          Anterior
        </button>
        <button
          onClick={() => formRef.current?.requestSubmit()}
          className={`px-6 py-2 bg-boton hover:bg-boton-hover text-white rounded-2xl ${
            step !== 1 ? 'hidden' : 'block'
          }`}
        >
          Siguiente
        </button>
        <div className={`${step !== steps.length ? 'hidden' : 'block'}`}>
          <SubmitButton />
        </div>
        <a
          href="#"
          onClick={openModal}
          className="px-6 py-2 block bg-boton-2 hover:bg-boton-2-hover text-white rounded-2xl disabled:opacity-50"
        >
          Cancelar
        </a>

        {isModalOpen && (
  <Modal onClose={() => setIsModalOpen(false)}>
    <div className="flex flex-col items-center w-full">
      <ExclamationCircleIcon className="w-16 h-16 text-bright-gray-800 mb-4" />
      <p className="text-lg text-bright-gray-800 mb-6">¿Estás seguro de cancelar el registro?</p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
        <Link
          href="/"
          className="px-6 py-2 bg-boton-2 hover:bg-boton-2-hover text-white rounded-2xl text-center"
        >
          Sí, estoy seguro
        </Link>
        
        <button 
          onClick={() => setIsModalOpen(false)} 
          className="px-6 py-2 bg-bright-gray-400 hover:bg-bright-gray-500 text-white rounded-2xl"
        >
          No, cerrar
        </button>
      </div>
    </div>
  </Modal>)}
      </div>
    </div>
  );
}