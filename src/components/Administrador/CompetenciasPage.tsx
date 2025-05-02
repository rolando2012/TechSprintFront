'use client';

import { useState } from 'react';
import { Plus, Edit, Icon } from 'lucide-react';
import Link from 'next/link';
import {inter} from '@/config/fonts';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';

interface Competencia {
  id: string;
  version: string;
  fecha: string;
  costo: string;
}

export default function CompetenciasPage() {
  const [competencias, setCompetencias] = useState<Competencia[]>([
    {
      id: '1',
      version: '--',
      fecha: '01-04-25/10-04-25',
      costo: '--',
    },
  ]);

  const agregarCompetencia = () => {
    const nuevaCompetencia: Competencia = {
      id: Date.now().toString(),
      version: '--',
      fecha: '01-04-25/10-04-25',
      costo: '--',
    };
    setCompetencias([...competencias, nuevaCompetencia]);
  };

  return (
    <div className="max-w-screen-md mx-auto p-4 bg-gray-100 min-h-screen">
      {/* Encabezado */}
      <div className="flex items-center mb-6">
        <div className="rounded-full p-2 mr-2">
          <Cog6ToothIcon 
            className="w-6 h-6 " 
            viewBox="0 0 24 24" 
           
          />
          
        </div>
        <h1 className={`${inter.className} text-3xl font-bold text-center mb-4`}>Gestion de Competencias</h1>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-lg shadow mb-6">
        {/* Encabezados de tabla */}
        <div className="grid grid-cols-12 bg-gray-800 text-white">
          <div className="col-span-4 p-3 font-semibold">Version</div>
          <div className="col-span-5 p-3 font-semibold">Fecha</div>
          <div className="col-span-2 p-3 font-semibold">Costo</div>
          <div className="col-span-1 p-3 font-semibold">Editar</div>
        </div>

        {/* Filas de datos */}
        {competencias.map((competencia) => (
          <div 
            key={competencia.id} 
            className="grid grid-cols-12 bg-gray-200 border-b border-gray-300"
          >
            <div className="col-span-4 p-3">{competencia.version}</div>
            <div className="col-span-5 p-3">{competencia.fecha}</div>
            <div className="col-span-2 p-3">{competencia.costo}</div>
            <div className="col-span-1 p-3 flex justify-center">
              <button 
                className="text-gray-700 hover:text-black"
                aria-label="Editar"
              >
                <Edit size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Separador */}
      <div className="border-t border-gray-300 my-6"></div>

      {/* Botones */}
      <div className="flex justify-between mt-12">
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Volver
        </Link>
        
        <button
          onClick={agregarCompetencia}
          className="flex items-center px-4 py-2 bg-gray-800 text-white rounded hover:bg-black transition-colors"
        >
          <Plus size={20} className="mr-1" />
          Agregar Competencia
        </button>
      </div>
    </div>
  );
}