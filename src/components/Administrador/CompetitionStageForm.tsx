"use client";

import { useState, useEffect, FormEvent } from "react";
import { Calendar, Clock } from "lucide-react";
import { useStageContext, Stage } from '@/lib/context/StageContext';
import { useRegistro } from '@/lib/context/RegistroContext'
import Swal from 'sweetalert2'
import { registrarCompetencia } from '@/lib/api/competencia'

export default function CompetitionStageForm() {
  const { stages, setStages } = useStageContext();
  const { selectedAreas, nivelesMap, categoriasMap, costo } = useRegistro();
  const [errors, setErrors] = useState<Record<number, any>>({});

  // Nombres fijos de las cuatro etapas
  const fixedNames = [
    'Inscripciones',
    'Validación de Requisitos y aceptación de parte de los tutores',
    'Pago de las inscripciones',
    'Periodo de Competición'
  ];

  // Inicializar etapas estáticas
  useEffect(() => {
    const initial = fixedNames.map((name, idx) => ({
      id: idx + 1,
      name,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '18:00',
    }));
    setStages(initial);
  }, [setStages]);

  const updateStage = (id: number, field: keyof Omit<Stage, 'name'>, value: string) => {
    setStages(
      stages.map(stage =>
        stage.id === id ? { ...stage, [field]: value } : stage
      )
    );
    // limpiar error del campo
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
            selectedAreas,
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
  };

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));

    return (
        <form id="StageForm" onSubmit={handleSubmit} className="max-w-5xl mx-auto py-8 space-y-8">
      {stages.map((stage, index) => (
        <div key={stage.id} className="border-l-4 border-boton bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">{stage.name}</h2>

          {/* Fecha inicial */}
          <div className="mb-6">
            <label htmlFor={`startDate-${stage.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Fecha inicial
            </label>
            <div className="relative">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 pl-3 text-gray-500">
                <Calendar className="w-5 h-5" />
              </div>
              <input
                id={`startDate-${stage.id}`}
                type="date"
                value={stage.startDate}
                onChange={e => updateStage(stage.id, 'startDate', e.target.value)}
                className="w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-boton"
              />
            </div>
            {errors[stage.id]?.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors[stage.id]!.startDate}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">{formatDate(stage.startDate)}</p>
          </div>

          {/* Fecha final */}
          <div className="mb-6">
            <label htmlFor={`endDate-${stage.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Fecha final
            </label>
            <div className="relative">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 pl-3 text-gray-500">
                <Calendar className="w-5 h-5" />
              </div>
              <input
                id={`endDate-${stage.id}`}
                type="date"
                value={stage.endDate}
                onChange={e => updateStage(stage.id, 'endDate', e.target.value)}
                className="w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-boton"
              />
            </div>
            {errors[stage.id]?.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors[stage.id]!.endDate}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">{formatDate(stage.endDate)}</p>
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor={`startTime-${stage.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Hora inicial
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Clock className="w-5 h-5" />
                </div>
                <input
                  id={`startTime-${stage.id}`}
                  type="time"
                  value={stage.startTime}
                  onChange={e => updateStage(stage.id, 'startTime', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-boton"
                />
              </div>
              {errors[stage.id]?.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors[stage.id]!.startTime}</p>
              )}
            </div>

            <div>
              <label htmlFor={`endTime-${stage.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Hora final
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <Clock className="w-5 h-5" />
                </div>
                <input
                  id={`endTime-${stage.id}`}
                  type="time"
                  value={stage.endTime}
                  onChange={e => updateStage(stage.id, 'endTime', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-boton"
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