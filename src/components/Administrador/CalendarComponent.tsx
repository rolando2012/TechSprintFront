'use client'

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, List } from 'lucide-react';

interface Period {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  color: 'blue' | 'yellow' | 'purple' | 'green';
}

interface CalendarComponentProps {
  currentPeriod?: string;
  currentDate?: string;
  periods?: Period[];
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  currentPeriod = "Inscripción",
  currentDate = "09/04/2025",
  periods = [
    {
      id: 'inscription',
      name: 'Período de Inscripción',
      startDate: '01/04/2025',
      endDate: '30/04/2025',
      color: 'blue'
    },
    {
      id: 'validation',
      name: 'Período de Validación',
      startDate: '01/05/2025',
      endDate: '15/05/2025',
      color: 'yellow'
    },
    {
      id: 'payment',
      name: 'Período de Pago',
      startDate: '16/05/2025',
      endDate: '25/05/2025',
      color: 'purple'
    },
    {
      id: 'competence',
      name: 'Período de Competencia',
      startDate: '26/05/2025',
      endDate: '10/06/2025',
      color: 'green'
    }
  ]
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 4)); // May 2025
  const [activeView, setActiveView] = useState<'calendar' | 'list'>('calendar');

  const monthNames = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ];

  const dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getDayColor = (day: number) => {
    if (!day) return '';
    
    const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = currentDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Check which period this date belongs to
    for (const period of periods) {
      const startDate = new Date(period.startDate.split('/').reverse().join('-'));
      const endDate = new Date(period.endDate.split('/').reverse().join('-'));
      
      if (currentDate >= startDate && currentDate <= endDate) {
        switch (period.color) {
          case 'blue':
            return 'bg-blue-100 text-blue-800';
          case 'yellow':
            return 'bg-yellow-100 text-yellow-800';
          case 'purple':
            return 'bg-purple-100 text-purple-800';
          case 'green':
            return 'bg-green-100 text-green-800';
          default:
            return '';
        }
      }
    }
    
    return '';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Calendario</h1>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span className="font-medium">Período Actual</span>
            <span className="font-medium">Fecha Actual</span>
          </div>
          <div className="flex justify-between">
            <span>Estado actual de la competencia</span>
            <span>{currentDate}</span>
          </div>
          <div className="text-left">
            <span className="font-medium">{currentPeriod}</span>
          </div>
        </div>

        {/* Date Range */}
        <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span>01/04/2025 - 30/04/2025</span>
        </div>
      </div>

      {/* Calendar/List Toggle */}
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700 mb-2">
          Calendario de períodos
        </div>
        <div className="text-xs text-gray-500 mb-3">
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
            <h2 className="text-lg font-semibold text-gray-800">
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
          {periods.map(period => (
            <div key={period.id} className="flex justify-between items-center py-2">
              <span className="text-sm font-medium text-gray-700">{period.name}</span>
              <span className="text-sm text-gray-500">{period.startDate} - {period.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-700 mb-2">Períodos</div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Período de inscripción</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Período de validación</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Período de pago</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-200 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Período de competencia</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
        Volver
      </button>
    </div>
  );
};

export default CalendarComponent;