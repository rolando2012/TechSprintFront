'use client';

import { useState } from 'react';
import { Edit, } from 'lucide-react';
import { GoPlusCircle } from "react-icons/go";
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

  return (
    <div className="p-2 sm:p-4 bg-gray-100 ">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-center justify-center mb-4 space-y-2 sm:space-y-0">     
        <Cog6ToothIcon 
          className="w-10 h-10 sm:w-12 sm:h-12 mr-0 sm:mr-4" 
        />
        <h1 className={`${inter.className} text-2xl sm:text-3xl font-bold text-center`}>
          Gestion de Competencias
        </h1>
      </div>

      {/* Tabla responsive */}
      <div className="overflow-x-auto rounded-lg shadow mb-6">
        <div className="min-w-[600px]">
          {/* Encabezados de tabla */}
          <div className="grid grid-cols-12 bg-gray-800 text-white text-sm sm:text-base">
            <div className="col-span-4 p-2 sm:p-3 font-semibold">Version</div>
            <div className="col-span-5 p-2 sm:p-3 font-semibold">Fecha</div>
            <div className="col-span-2 p-2 sm:p-3 font-semibold">Costo</div>
            <div className="col-span-1 p-2 sm:p-3 font-semibold">Editar</div>
          </div>

          {/* Filas de datos */}
          {competencias.map((competencia) => (
            <div 
              key={competencia.id} 
              className="grid grid-cols-12 bg-gray-200 border-b border-gray-300 text-sm sm:text-base"
            >
              <div className="col-span-4 p-2 sm:p-3">{competencia.version}</div>
              <div className="col-span-5 p-2 sm:p-3">{competencia.fecha}</div>
              <div className="col-span-2 p-2 sm:p-3">{competencia.costo}</div>
              <div className="col-span-1 p-2 sm:p-3 flex justify-center">
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
      </div>

      {/* Separador */}
      <div className="border-t border-gray-300 my-4 sm:my-6"></div>

      {/* Botones ajustados */}
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center mt-8 sm:mt-12 w-full gap-4">
        <Link
          href="/administrador"
          className="sm:mr-auto px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
        >
          Volver
        </Link>
        <Link
          href="/administrador/lista/crear/datos-comp"
          className="sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 w-full sm:w-auto flex items-center justify-center text-lg sm:text-xl px-6 sm:px-12 py-2 bg-bright-gray-900 text-white rounded-xl hover:bg-bright-gray-700 transition-colors"
        >
          <GoPlusCircle className="h-6 w-6 sm:h-8 sm:w-8 mr-2" />
          Agregar Competencia
        </Link>
      </div>
    </div>
  );
}