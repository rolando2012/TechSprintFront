"use client";

import { useState, useEffect, FormEvent } from "react";
import { Calendar, Clock, Trash2 } from "lucide-react";
import { FaRegPlusSquare } from "react-icons/fa";
import { useStageContext, Stage } from '@/lib/context/StageContext';
import { useRegistro } from '@/lib/context/RegistroContext'
import Swal from 'sweetalert2'
import { registrarCompetencia } from '@/lib/api/competencia'


export default function CompetitionStageForm() {
    const { stages, setStages } = useStageContext();
    const [errors, setErrors] = useState<Record<number, any>>({});
    const { selectedAreas,
        nivelesMap,
        categoriasMap,
        costoConfirmado, } = useRegistro()

    useEffect(() => {
        if (stages.length === 0) {
          setStages([
            {
              id: 1,
              name: '',
              startDate: new Date().toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0],
              startTime: '08:00',
              endTime: '18:00',
            },
          ]);
        }
      }, [stages, setStages]);

    const addStage = () => {
        const newId = stages.length > 0 ? Math.max(...stages.map((s) => s.id)) + 1 : 1;
        setStages([
        ...stages,
        {
            id: newId,
            name: "",
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
            startTime: "08:00",
            endTime: "18:00",
        },
        ]);
    };

    const removeStage = (id: number) => {
        setStages(stages.filter((stage) => stage.id !== id));
    };

    const updateStage = (id: number, field: keyof Stage, value: string) => {
        setStages(
        stages.map((stage) =>
            stage.id === id ? { ...stage, [field]: value } : stage
        )
        );
        setErrors(prev => {
            const e = { ...prev[id] };
            delete e[field];
            delete e.nameUnique;  // si cambió el nombre, vuelve a chequear unicidad
            return { ...prev, [id]: e };
          });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<number, any> = {};
        const names = stages.map(s => s.name.trim());
        const dupes = names.filter((n, i) => n && names.indexOf(n) !== i);
    
        stages.forEach((stage, idx) => {
          const e: any = {};
          if (!stage.name.trim()) e.name = 'El nombre es obligatorio';
          else if (dupes.includes(stage.name.trim())) e.nameUnique = 'Ya existe otra etapa con este nombre';
    
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

        const costoNum = Number(costoConfirmado);     // o parseInt(costoConfirmado, 10)
        

        let timerInterval: NodeJS.Timeout
        await Swal.fire({
          title: 'Registrando competencia…',
          html: 'Por favor, no cierre esta ventana.',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: async () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
              const content = Swal.getHtmlContainer()
              if (content) {
                const b = content.querySelector('b')
                if (b) {
                  b.textContent = (Swal.getTimerLeft()?.toString() ?? '')
                }
              }
            }, 100)
    
            try {
              await registrarCompetencia(
                selectedAreas,
                nivelesMap,
                categoriasMap,
                costoNum,
                stages
              )
              clearInterval(timerInterval)
              Swal.close()
              // por ejemplo, abrir modal de éxito:
              window.dispatchEvent(new CustomEvent('open-confirmation-modal', {
                detail: stages.length
              }))

            } catch (err: any) {
              clearInterval(timerInterval)
              Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                text: err.message || 'Intenta nuevamente más tarde.'
              })
            }
          },
          willClose: () => clearInterval(timerInterval)
        })
    
        // Aquí ya tienes `stages` actualizado en tu Context
        // console.log('Guardando configuración:', stages);
        // console.log("datos: ", selectedAreas, nivelesMap, categoriasMap, costoConfirmado )
      };


      const formatDate = (dateString: string) =>
        new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateString));

    return (
        <form id="StageForm" onSubmit={handleSubmit} className="max-w-5xl mx-auto py-8">
        {stages.map((stage, index) => (
            <div
            key={stage.id}
            className="mb-8 border-l-4 border-boton bg-white rounded-lg shadow p-6"
            >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Etapa {index + 1}</h2>
                <button
                type="button"
                onClick={() => removeStage(stage.id)}
                className="text-boton-2 hover:text-boton-2-hover transition-colors"
                aria-label="Eliminar etapa"
                >
                <Trash2 className="w-6 h-6" />
                </button>
            </div>

            <div className="mb-6">
                <label htmlFor={`name-${stage.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la etapa
                </label>
                <input
                id={`name-${stage.id}`}
                type="text"
                value={stage.name}
                onChange={(e) => updateStage(stage.id, "name", e.target.value)}
                placeholder="Ej: Fase clasificatoria, Semifinal, Final"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-boton"
                />
                {errors[stage.id]?.name && (
                        <p className="mt-1 text-sm text-red-600">{errors[stage.id]!.name}</p>
                    )}
                {errors[stage.id]?.nameUnique && (
                <p className="mt-1 text-sm text-red-600">{errors[stage.id]!.nameUnique}</p>
                )}
            </div>

            <div className="mb-6">
                <label htmlFor={`startDate-${stage.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha inicial
                </label>
                {/* Contenedor sólo para el input + icono */}
                <div className="relative">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 pl-3 text-gray-500">
                    <Calendar className="w-5 h-5" />
                    </div>
                    <input
                    id={`startDate-${stage.id}`}
                    type="date"
                    value={stage.startDate}
                    onChange={(e) => updateStage(stage.id, "startDate", e.target.value)}
                    className="w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-boton"
                    />
                    {errors[stage.id]?.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors[stage.id]!.startDate}</p>
                    )}

                </div>
                {/* Texto de fecha formateada fuera del relative */}
                <div className="mt-1 text-sm text-gray-500 pl-2">
                    {stage.startDate ? formatDate(stage.startDate) : ""}
                </div>
                </div>

                {/* Igual para la fecha final: */}
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
                    onChange={(e) => updateStage(stage.id, "endDate", e.target.value)}
                    className="w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-boton"
                    />
                    {errors[stage.id]?.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors[stage.id]!.endDate}</p>
                )}
                </div>
                <div className="mt-1 text-sm text-gray-500 pl-2">
                    {stage.endDate ? formatDate(stage.endDate) : ""}
                </div>
                </div>


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
                    onChange={(e) => updateStage(stage.id, "startTime", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-boton"
                    />
                    {errors[stage.id]?.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors[stage.id]!.startTime}</p>
                )}
                </div>
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
                    onChange={(e) => updateStage(stage.id, "endTime", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-boton"
                    />
                    {errors[stage.id]?.endTime && (
                <p className="mt-1 text-sm text-red-600">{errors[stage.id]!.endTime}</p>
                )}
                </div>
                </div>
            </div>
            </div>
        ))}

        <div className="flex justify-between items-center mt-8">
            <button
            type="button"
            onClick={addStage}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
            <FaRegPlusSquare className="h-6 w-6"/>
            <span>Agregar etapa</span>
            </button>

            {/* <button
            onClick={saveConfiguration}
            className="flex items-center gap-2 px-6 py-3 bg-boton text-white rounded-md hover:bg-boton-hover transition-colors"
            >
            <span className="i-lucide-save" />
            <span>Guardar configuración</span>
            </button> */}
        </div>
        </form>
    );
    }