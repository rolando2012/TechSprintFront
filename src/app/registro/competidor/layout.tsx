'use client';
import React from 'react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckIcon,  } from '@heroicons/react/24/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { RegistroProvider } from './context';
import Modal from "@/components/Modals/ModalProps"; 

const steps = [
  { slug: 'datos-personales', label: 'Datos Personales' },
  { slug: 'inscripcion', label: 'Inscripción' },
  { slug: 'asignacion-tutor', label: 'Asignación Tutor' },
];

export default function RegistroLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const idx = steps.findIndex(s => pathname.includes(s.slug));
  const stepIndex = idx === -1 ? 0 : idx;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const formId = stepIndex === 0
    ? 'registroForm'
    : stepIndex === 1
    ? 'inscripcionForm'
    : undefined;

  return (
    <RegistroProvider>
      <main className="min-h-screen w-full py-8 bg-background-reg flex justify-center">
        <div className="w-full max-w-4xl bg-gray-100 shadow-md px-4 sm:px-6 py-6 mb-6 rounded-2xl">
          <h1 className="text-3xl font-bold text-center mb-6">Registro para Competencia</h1>

          {/* Stepper */}
          <div className="flex justify-center items-center mb-12">
            <div className="relative flex items-center w-full max-w-md justify-between">
              {steps.map((_, idx) => idx < steps.length - 1 && (
                <div
                  key={idx}
                  className={`absolute h-1 top-1/2 -translate-y-1/2 z-0 ${idx < stepIndex ? 'bg-black' : 'bg-gray-200'}`}
                  style={{
                    left: `${(100 / (steps.length - 1)) * idx}%`,
                    right: `${100 - ((100 / (steps.length - 1)) * (idx + 1))}%`,
                  }}
                />
              ))}

              {steps.map((step, idx) => (
                <Link
                  key={step.slug}
                  href={`/registro/competidor/${step.slug}`}
                  className="relative flex items-center justify-center z-10"
                >
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 cursor-pointer ${idx <= stepIndex ? 'bg-black border-black text-white' : 'bg-white border-gray-300 text-black'}`}
                  >
                    {idx < stepIndex ? <CheckIcon className="w-6 h-6" /> : <span className="text-lg font-medium">{idx + 1}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mb-8 w-full">{children}</div>

          <div className="flex justify-center gap-4 w-full mt-6">
        {stepIndex > 0 && (
          <button
            onClick={() => router.push(`/registro/competidor/${steps[stepIndex - 1].slug}`)}
            className="px-6 py-2 bg-bright-gray-400 hover:bg-bright-gray-500  text-white rounded-2xl"
          >Anterior</button>
        )}

        {stepIndex < steps.length - 1 && (
          <button
            onClick={() => formId
              ? (document.getElementById(formId) as HTMLFormElement)?.requestSubmit()
              : undefined
            }
            className="px-6 py-2 bg-boton hover:bg-boton-hover text-white rounded-2xl"
          >Siguiente</button>
        )}

        {stepIndex === steps.length - 1 && (
          <button
            type="submit"
            form="tutorForm" 
            className="px-6 py-2 bg-boton hover:bg-boton-hover text-white rounded-2xl"
          >Enviar</button>
        )}
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
        </main>
    </RegistroProvider>
  );
}