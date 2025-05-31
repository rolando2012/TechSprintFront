'use client';
import { useState } from 'react';
import { consultarCompetidor, CompetidorConsulta } from '@/lib/api/competidor';
import DetallesInscripcion from '@/components/Tutor/DetallesInscripcion';
import { MagnifyingGlassIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import Swal from 'sweetalert2';

interface ConsultaEstadoPageProps {
  tutorId: string;
}

export default function ConsultaEstadoPage({ tutorId }: ConsultaEstadoPageProps) {
  const [carnet, setCarnet] = useState('');
  const [email, setEmail] = useState('');
  const [competidor, setCompetidor] = useState<CompetidorConsulta | null>(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  const handleConsultar = async () => {
    if (!carnet.trim() || !email.trim()) {
      Swal.fire({
        title: 'Campos requeridos',
        text: 'Por favor ingrese el carnet de identidad y correo electrónico',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#6b7280'
      });
      return;
    }

    // Mostrar loading
    Swal.fire({
      title: 'Consultando estado...',
      text: 'Verificando información del competidor',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const resultado = await consultarCompetidor(tutorId, carnet.trim(), email.trim());
      
      Swal.close();
      
      setCompetidor(resultado);
      setMostrarDetalles(true);
      
      Swal.fire({
        title: 'Competidor encontrado',
        text: 'La información se ha cargado correctamente',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

    } catch (error) {
      Swal.close();
      
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      Swal.fire({
        title: 'Competidor no encontrado',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Intentar nuevamente',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleVolver = () => {
    setMostrarDetalles(false);
    setCompetidor(null);
    setCarnet('');
    setEmail('');
  };

  if (mostrarDetalles && competidor) {
    return <DetallesInscripcion competidor={competidor} onVolver={handleVolver} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olimpiadas Científicas
          </h1>
          <p className="text-gray-500">
            Consulta de Estado de Inscripción
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Consulta el estado del competidor
          </h2>
          <p className="text-gray-600 text-sm">
            Ingresa el carnet de identidad y correo electrónico para verificar el estado de la inscripción.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="carnet" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="w-4 h-4 mr-2" />
              Carnet de Identidad
            </label>
            <input
              type="text"
              id="carnet"
              value={carnet}
              onChange={(e) => setCarnet(e.target.value)}
              placeholder="Ingrese el carnet de identidad"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <EnvelopeIcon className="w-4 h-4 mr-2" />
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingrese el correo electrónico"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <button
            onClick={handleConsultar}
            className="w-full flex items-center justify-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
          >
            <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
            Consultar Estado
          </button>
        </div>
      </div>
    </div>
  );
}