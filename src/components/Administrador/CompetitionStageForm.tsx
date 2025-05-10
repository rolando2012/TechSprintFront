"use client";

import { useState } from "react";
import { Calendar, Clock, Trash2 } from "lucide-react";
import { FaRegPlusSquare } from "react-icons/fa";

interface Stage {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    }

    export default function CompetitionStageForm() {
    const [stages, setStages] = useState<Stage[]>([
        {
        id: 1,
        name: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        startTime: "08:00",
        endTime: "18:00",
        },
    ]);

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
    };

    const saveConfiguration = () => {
        console.log("Saving configuration:", stages);
        // Here you would implement the actual save logic
        // e.g., API call to save the stages data
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
        }).format(date);
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
        {stages.map((stage, index) => (
            <div
            key={stage.id}
            className="mb-8 border-l-4 border-boton bg-white rounded-lg shadow p-6"
            >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Etapa {index + 1}</h2>
                <button
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
                </div>
                </div>
            </div>
            </div>
        ))}

        <div className="flex justify-between items-center mt-8">
            <button
            onClick={addStage}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
            <FaRegPlusSquare className="h-6 w-6"/>
            <span>Agregar etapa</span>
            </button>

            <button
            onClick={saveConfiguration}
            className="flex items-center gap-2 px-6 py-3 bg-boton text-white rounded-md hover:bg-boton-hover transition-colors"
            >
            <span className="i-lucide-save" />
            <span>Guardar configuración</span>
            </button>
        </div>
        </div>
    );
    }