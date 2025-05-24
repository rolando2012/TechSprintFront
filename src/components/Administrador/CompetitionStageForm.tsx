"use client";

import { useState, useEffect, FormEvent } from "react";
import { Calendar, Clock } from "lucide-react";
import { useStageContext, Stage } from '@/lib/context/StageContext';
import { useRegistro } from '@/lib/context/RegistroContext'
import Swal from 'sweetalert2'
import { registrarCompetencia } from '@/lib/api/competencia'

export default function CompetitionStageForm() {
  const { stages, setStages } = useStageContext();
  const { nombre, nivelesMap, categoriasMap, costo } = useRegistro();
  const [errors, setErrors] = useState<Record<number, any>>({});

  // Fecha mínima hoy
  const today = new Date().toISOString().split('T')[0];

  const fixedNames = [
    'Inscripciones',
    'Validación de Requisitos y aceptación de parte de los tutores',
    'Pago de las inscripciones',
    'Periodo de Competición'
  ];

  useEffect(() => {
    const initial = fixedNames.map((name, idx) => ({
      id: idx + 1,
      name,
      startDate: today,
      endDate: today,
      startTime: '08:00',
      endTime: '18:00',
    }));
    setStages(initial);
  }, [setStages, today]);

  const updateStage = (id: number, field: keyof Omit<Stage, 'name'>, value: string) => {
    setStages(
      stages.map(stage =>
        stage.id === id ? { ...stage, [field]: value } : stage
      )
    );
    setErrors(prev => {
      const e = { ...prev[id] };
      delete e[field];
      return { ...prev, [id]: e };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<number, any> = {};

    stages.forEach((stage, idx) => {
      const e: any = {};
      if (stage.startDate < today) e.startDate = 'No puede ser anterior a hoy';
      if (stage.endDate < today) e.endDate = 'No puede ser anterior a hoy';
      if (stage.endDate < stage.startDate)
        e.endDate = 'La fecha final no puede ser anterior a la inicial';
      if (idx > 0 && stage.startDate <= stages[idx - 1].endDate)
        e.startDate = `Debe iniciar después de ${formatDate(stages[idx - 1].endDate)}`;
      if (stage.startDate === stage.endDate && stage.endTime < stage.startTime)
        e.endTime = 'La hora final no puede ser anterior a la inicial';
      if (Object.keys(e).length) newErrors[stage.id] = e;
    });

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const costoNum = Number(costo);
    let timerInterval: NodeJS.Timeout;
    await Swal.fire({
      title: 'Registrando competencia…',
      html: 'Por favor, no cierre esta ventana.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: async () => {
        Swal.showLoading();
        timerInterval = setInterval(() => {}, 100);
        try {
          await registrarCompetencia(
            nombre,
            nivelesMap,
            categoriasMap,
            costoNum,
            stages
          );
          clearInterval(timerInterval);
          Swal.close();
          window.dispatchEvent(new CustomEvent('open-confirmation-modal'));
        } catch (err: any) {
          clearInterval(timerInterval);
          Swal.fire({ icon: 'error', title: 'Error al registrar', text: err.message });
        }
      },
      willClose: () => clearInterval(timerInterval)
    });
    // console.log('Guardando configuración:', stages);
    // console.log("datos: ", nombre, nivelesMap, categoriasMap, costo )
  };

  // Evita desfase de fecha
  const formatDate = (dateString: string) => {
    const [y, m, d] = dateString.split('-').map(Number);
    return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric' })
      .format(new Date(y, m - 1, d));
  };

  return (
    <form id="StageForm" onSubmit={handleSubmit} className="max-w-5xl mx-auto py-8 space-y-8">
      {stages.map((stage) => (
        <div key={stage.id} className="border-l-4 border-boton bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">{stage.name}</h2>

          {/* Fila de fechas */}
          <div className="grid grid-cols-2 gap-6 mb-4">
            {/* Fecha inicio */}
            <div>
              <label htmlFor={`startDate-${stage.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Fecha inicio
              </label>
              <div className="relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 pl-3 text-gray-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <input
                  id={`startDate-${stage.id}`} type="date"
                  value={stage.startDate}
                  min={today}
                  onChange={e => updateStage(stage.id, 'startDate', e.target.value)}
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-boton"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">{formatDate(stage.startDate)}</p>
              {errors[stage.id]?.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors[stage.id]!.startDate}</p>
              )}
            </div>

            {/* Fecha fin */}
            <div>
              <label htmlFor={`endDate-${stage.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Fecha fin
              </label>
              <div className="relative">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 pl-3 text-gray-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <input
                  id={`endDate-${stage.id}`} type="date"
                  value={stage.endDate}
                  min={today}
                  onChange={e => updateStage(stage.id, 'endDate', e.target.value)}
                  className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-boton"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">{formatDate(stage.endDate)}</p>
              {errors[stage.id]?.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors[stage.id]!.endDate}</p>
              )}
            </div>
          </div>

          {/* Fila de horas */}
          <div className="grid grid-cols-2 gap-6">
            {/* Hora inicio */}
            <div>
              <label htmlFor={`startTime-${stage.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Hora inicio
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Clock className="w-5 h-5" />
                </div>
                <input
                  id={`startTime-${stage.id}`} type="time"
                  value={stage.startTime}
                  onChange={e => updateStage(stage.id, 'startTime', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-boton"
                />
              </div>
              {errors[stage.id]?.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors[stage.id]!.startTime}</p>
              )}
            </div>

            {/* Hora fin */}
            <div>
              <label htmlFor={`endTime-${stage.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Hora fin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Clock className="w-5 h-5" />
                </div>
                <input
                  id={`endTime-${stage.id}`} type="time"
                  value={stage.endTime}
                  onChange={e => updateStage(stage.id, 'endTime', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-boton"
                />
              </div>
              {errors[stage.id]?.endTime && (
                <p className="mt-1 text-sm text-red-600">{errors[stage.id]!.endTime}</p>
              )}
            </div>
          </div>
        </div>
      ))}
        </form>
    );
    }