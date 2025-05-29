'use client';

import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { GoPlusCircle } from 'react-icons/go';
import Link from 'next/link';
import { inter } from '@/config/fonts';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { getCompetencias } from '@/lib/api/competencia';

// Interfaz para mapear la respuesta de la API
interface Competencia {
  id: string;
  nombreCompet: string;
  version: string;
  fecha: string; 
  fechaFin: string;
  costo: string;
}

export default function CompetenciasPage() {
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCompetencias = async () => {
      try {
        const data = await getCompetencias();
        const mapped = data.map(({ codComp, nombreCompet, gestion, fechaIni, fechaFin, costo }) => ({
          id: codComp,
          nombreCompet: nombreCompet,
          version: gestion,
          fecha: fechaIni,
          fechaFin: fechaFin,
          costo,
        }));
        setCompetencias(mapped);
      } catch (error) {
        console.error('Error al cargar competencias:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompetencias();
  }, []);

  // Función para formatear fecha ISO a formato local
  const formatFecha = (iso: string) => {
    try {
      const date = new Date(iso);
      return date.toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="p-2 sm:p-4 bg-gray-100 min-h-screen">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-center justify-center mb-4 space-y-2 sm:space-y-0">
        <Cog6ToothIcon className="w-10 h-10 sm:w-12 sm:h-12 mr-0 sm:mr-4" />
        <h1 className={`${inter.className} text-2xl sm:text-3xl font-bold text-center`}>Gestión de Competencias</h1>
      </div>

      {/* Estado de carga y mensaje si no hay datos */}
      {isLoading ? (
        <div className="text-center py-8">Cargando competencias...</div>
      ) : competencias.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No hay competencias disponibles.</div>
      ) : (
        /* Tabla responsive */
        <div className="overflow-x-auto rounded-lg shadow mb-6">
          <div className="min-w-[700px]">
            {/* Encabezados de tabla */}
            <div className="grid grid-cols-13 bg-gray-800 text-white text-sm sm:text-base">
              <div className="col-span-3 p-2 sm:p-3 font-semibold">Nombre</div>
               <div className="col-span-2 p-2 sm:p-3 font-semibold">Version</div>
              <div className="col-span-3 p-2 sm:p-3 font-semibold">Fecha Inicio</div>
              <div className="col-span-3 p-2 sm:p-3 font-semibold">Fecha Fin</div>
              <div className="col-span-1 p-2 sm:p-3 font-semibold text-center">Costo</div>
              {/* <div className="col-span-1 p-2 sm:p-3 font-semibold text-center">Editar</div> */}
            </div>

            {/* Filas de datos */}
            {competencias.map((comp, index) => (
              <div
                key={`competencia-${comp.id}-${index}`}
                className="grid grid-cols-13 bg-white hover:bg-gray-50 border-b border-gray-200 text-sm sm:text-base transition-colors"
              >
                <div className="col-span-3 p-2 sm:p-3 font-medium text-gray-900">{comp.nombreCompet}</div>
                <div className="col-span-2 p-2 sm:p-3 font-medium text-gray-900">{comp.version}</div>
                <div className="col-span-3 p-2 sm:p-3 text-gray-700">{formatFecha(comp.fecha)}</div>
                <div className="col-span-3 p-2 sm:p-3 text-gray-700">{formatFecha(comp.fechaFin)}</div>
                <div className="col-span-1 p-2 sm:p-3 text-center text-gray-700 font-medium">{comp.costo}</div>
                <div className="col-span-1 p-2 sm:p-3 flex justify-center items-center">
                  {/* <button 
                    className="text-gray-600 hover:text-blue-600 p-1 rounded-md hover:bg-blue-50 transition-colors" 
                    aria-label="Editar"
                  >
                    <Edit size={16} />
                  </button> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Separador */}
      <div className="border-t border-gray-300 my-4 sm:my-6" />

      {/* Botones de navegación */}
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center mt-8 sm:mt-12 w-full gap-4">
        <Link
          href="/administrador"
          className="sm:mr-auto px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors"
        >
          Volver
        </Link>
        <Link
          href="/administrador/lista/crear/datos-comp"
          className="sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2 w-full sm:w-auto flex items-center justify-center text-lg sm:text-xl px-6 sm:px-12 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors"
        >
          <GoPlusCircle className="h-6 w-6 sm:h-8 sm:w-8 mr-2" />
          Agregar Competencia
        </Link>
      </div>
    </div>
  );
}