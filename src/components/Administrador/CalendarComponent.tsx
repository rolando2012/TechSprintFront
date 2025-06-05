'use client'
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, List, Eye } from 'lucide-react';
import { fetchEtapasCompetencia, Etapa, getCompetencias, Competencia } from '@/lib/api/competencia';
import Link from 'next/link';
import Swal from 'sweetalert2';

const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const dayNames = ['Do','Lu','Ma','Mi','Ju','Vi','Sa'];

function getDaysInMonth(date: Date): (number | null)[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: (number|null)[] = [];
  for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
  return days;
}

function CalendarComponent() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeView, setActiveView] = useState<'calendar'|'list'>('calendar');
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [selectedCompetencia, setSelectedCompetencia] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    // Cargar lista de competencias al inicializar
    getCompetencias()
      .then(setCompetencias)
      .catch(console.error);
  }, []);

  const handleShowCalendar = async () => {
    if (!selectedCompetencia) return;   
    // Mostrar loading con SweetAlert2
    Swal.fire({
      title: 'Now loading',
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const etapasData = await fetchEtapasCompetencia(selectedCompetencia);
      setEtapas(etapasData);
      setShowCalendar(true);    
      // Cerrar loading y mostrar éxito
      Swal.fire({
        title: 'Finished!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error fetching etapas:', error);     
      // Mostrar error
      Swal.fire({
        title: 'Error!',
        text: `Error al cargar las etapas: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const navigateMonth = (dir: 'prev'|'next') => {
    setCurrentMonth(prev => {
      const m = new Date(prev);
      m.setMonth(m.getMonth() + (dir === 'next' ? 1 : -1));
      return m;
    });
  };

  function getDayColor(day: number | null) {
  if (day === null) return '';

  // 1) Construimos la fecha del calendario (a medianoche local)
  const date = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    day
  );
  date.setHours(0, 0, 0, 0);

  // 2) Buscamos la etapa, normalizando start y end
  const etapa = etapas.find(e => {
    const start = new Date(e.fechaInicio);
    start.setHours(0, 0, 0, 0);

    const end = new Date(e.fechaFin);
    // Si quieres que incluya TODO el día de fin, puedes poner 23:59:59
    end.setHours(23, 59, 59, 999);

    return date >= start && date <= end;
  });

  if (!etapa) return '';

  // 3) Si encontramos una etapa que “contiene” ese día, devolvemos la clase CSS
  switch (etapa.nombreEtapa) {
    case 'Inscripciones':
      return 'bg-blue-100 text-blue-800';
    case 'Validación de Requisitos':
      return 'bg-yellow-100 text-yellow-800';
    case 'Pago de Inscripciones':
      return 'bg-purple-100 text-purple-800';
    case 'Competición':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
}


  function getLegendColor(nombreEtapa: string) {
    const nombreLower = nombreEtapa.toLowerCase();
    if ( nombreLower == 'inscripción') {
      return 'bg-blue-200';
    } else if (nombreLower.includes('validacion') || nombreLower.includes('validación')) {
      return 'bg-yellow-200';
    } else if (nombreLower.includes('pago')) {
      return 'bg-purple-200';
    }  else if (nombreLower.includes('competencia')) {
      return 'bg-green-200';
    } else {
      return 'bg-slate-200';
    }
  }

  function getPeriodoLabel(nombreEtapa: string) {
    const nombreLower = nombreEtapa.toLowerCase();
    if ( nombreLower == 'inscripciones') {
      return 'Período de inscripción';
    } else if (nombreLower.includes('validacion') || nombreLower.includes('validación')) {
      return 'Período de validación';
    } else if (nombreLower.includes('pago')) {
      return 'Período de pago';
    } else if (nombreLower.includes('competición')) {
      return 'Período de competencia';
    } else {
      return nombreEtapa;
    }
  }

  const days = getDaysInMonth(currentMonth);
  const currentDate = new Date().toLocaleDateString('es-ES');
  const currentEtapa = etapas.find(e => {
    const now = new Date();
    const start = new Date(e.fechaInicio);
    const end = new Date(e.fechaFin);
    return now >= start && now <= end;
  });

 const selectedCompetenciaData = competencias.find(
  c => c.nombreCompet === selectedCompetencia
);

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">Calendario</h1>
      </div>

      {/* Selector de Competencia */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Seleccione la competencia</h2>
        
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <select
              value={selectedCompetencia}
              onChange={e => setSelectedCompetencia(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-boton focus:border-boton"
            >
              <option value="">Seleccionar competencia...</option>
              {competencias.map(c => (
                <option key={`${c.nombreCompet}-${c.gestion}`} value={c.nombreCompet}>
                  {c.nombreCompet} – {c.gestion}
                </option>
              ))}
            </select>

          </div>
           
          <button
            onClick={handleShowCalendar}
            disabled={!selectedCompetencia}
            className="px-4 py-2 bg-boton text-white rounded-md hover:bg-boton-hover disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2
            transition-all transform hover:scale-105 active:scale-95"
          >
            <Eye className="w-4 h-4" />
            Mostrar Calendario
          </button>
        </div>
      </div>

      {/* Contenido del Calendario - Solo se muestra si showCalendar es true */}
      {showCalendar && selectedCompetenciaData && (
        <>
          {/* Información de la competencia actual */}
          <div className="text-center mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {selectedCompetenciaData.nombreCompet}
            </h3>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="text-lg font-medium">Período Actual</span>
                <span className="text-lg font-medium">Fecha Actual</span>
              </div>
              <div className="text-lg flex justify-between">
                <span className="font-medium">
                  {currentEtapa ? currentEtapa.nombreEtapa : 'Sin etapa activa'}
                </span>
                <span>{currentDate}</span>
              </div>
            </div>

            {/* Date Range */}
            {currentEtapa && (
              <div className="flex justify-center mt-4 text-md text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {new Date(currentEtapa.fechaInicio).toLocaleDateString('es-ES')} - {' '}
                  {new Date(currentEtapa.fechaFin).toLocaleDateString('es-ES')}
                </span>
              </div>
            )}
          </div>

          {/* Calendar/List Toggle */}
          <div className="mb-4">
            <div className="text-xl font-medium text-gray-700 mb-2">
              Calendario de períodos
            </div>
            <div className="text-md text-gray-500 mb-3">
              Vista de todos los períodos de competencia
            </div>
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveView('calendar')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'calendar'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Calendario
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                Lista de Períodos
              </button>
            </div>
          </div>

          {/* Calendar View */}
          {activeView === 'calendar' && (
            <div className="mb-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-xl font-semibold text-gray-800">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      h-8 flex items-center justify-center text-sm rounded-md transition-colors
                      ${day ? 'hover:bg-gray-50 cursor-pointer' : ''}
                      ${day ? getDayColor(day) : ''}
                      ${day && !getDayColor(day) ? 'text-gray-700' : ''}
                    `}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* List View */}
          {activeView === 'list' && (
            <div className="mb-6 space-y-3">
              {etapas.map(etapa => (
                <div key={etapa.codEtapa} className="flex justify-between items-center py-3 px-2 border-l-4 border-gray-200 bg-gray-50 rounded-r-md">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{etapa.nombreEtapa}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Tipo: {getPeriodoLabel(etapa.nombreEtapa)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 text-right">
                    <div>{new Date(etapa.fechaInicio).toLocaleDateString('es-ES')}</div>
                    <div>{new Date(etapa.fechaFin).toLocaleDateString('es-ES')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="mb-6">
            <div className="text-xl font-medium text-gray-700 mb-3">Períodos</div>
            <div className="space-y-2">
              {[...new Set(etapas.map(e => getPeriodoLabel(e.nombreEtapa)))].map(periodo => (
                <div key={periodo} className="flex items-center">
                  <div className={`w-3 h-3 ${getLegendColor(periodo)} rounded mr-2`}></div>
                  <span className="text-lg text-gray-600">{periodo}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Link
        href="/administrador"
        className="sm:mr-auto px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 
        transition-all transform hover:scale-105 active:scale-95"
      >
        Volver
      </Link>
    </div>
  );
}

export default CalendarComponent;