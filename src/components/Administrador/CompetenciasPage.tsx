"use client";
import React, { useState, useEffect, useRef } from 'react';
import { X, Save, AlertCircle, Edit } from 'lucide-react';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import {
  CompetenciaDetalle,
  EtapaCompetencia,
  getCompetenciaById as fetchCompetenciaByIdAPI,
  updateCompetencia as updateCompetenciaAPI
} from '@/lib/api/consulta';
import {
  Competencia,
  getCompetencias as fetchCompetenciasAPI,
} from '@/lib/api/competencia';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  competencia: CompetenciaDetalle | null;
  onSave: (data: any) => Promise<void>;
}

function EditCompetenciaModal({ isOpen, onClose, competencia, onSave }: EditModalProps) {
  const [formData, setFormData] = useState<{ nombreCompet: string; costo: string; etapas: (EtapaCompetencia & { editable: boolean })[] }>({
    nombreCompet: '',
    costo: '',
    etapas: []
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const [inscripcionStarted, setInscripcionStarted] = useState(false);

  useEffect(() => {
    if (isOpen && competencia) {
      firstInputRef.current?.focus();
      const today = new Date(); today.setHours(0,0,0,0);
      let insStart = false;
      const etapasWithFlag = competencia.etapas.map(e => {
        const start = new Date(e.fechaInicio); start.setHours(0,0,0,0);
        const editable = start > today;
        if (e.nombreEtapa === 'Inscripciones') {
          insStart = today >= start;
        }
        return { ...e, editable };
      });
      setInscripcionStarted(insStart);
      setFormData({ nombreCompet: competencia.nombreCompet, costo: competencia.costo, etapas: etapasWithFlag });
      setErrors({});
    }
  }, [isOpen, competencia]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombreCompet.trim()) newErrors.nombreCompet = 'El nombre es requerido';
    if (!formData.costo.trim()) newErrors.costo = 'El costo es requerido';
    if (isNaN(Number(formData.costo)) || Number(formData.costo) < 0) newErrors.costo = 'El costo debe ser un número válido';

    const etapas = [...formData.etapas].sort((a,b) => a.orden - b.orden);
    etapas.forEach((e, i) => {
      if (!e.editable) return;
      const ini = new Date(e.fechaInicio); const fin = new Date(e.fechaFin);
      if (ini >= fin) newErrors[`etapa_${e.codEtapa}_fechas`] = 'La fecha de inicio debe ser anterior a la fecha de fin';
      if (i < etapas.length - 1 && etapas[i+1].editable) {
        const nextIni = new Date(etapas[i+1].fechaInicio);
        if (fin >= nextIni) newErrors[`etapa_${e.codEtapa}_solapamiento`] =
          `La etapa "${e.nombreEtapa}" termina después de que inicie "${etapas[i+1].nombreEtapa}"`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: 'nombreCompet' | 'costo', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleDateChange = (codEtapa: number, field: 'fechaInicio' | 'fechaFin', value: string) => {
    setFormData(prev => ({
      ...prev,
      etapas: prev.etapas.map(e => e.codEtapa === codEtapa ? { ...e, [field]: value } : e)
    }));
    setErrors(prev => {
      const clone = { ...prev };
      Object.keys(clone).forEach(key => { if (key.startsWith(`etapa_${codEtapa}_`)) delete clone[key]; });
      return clone;
    });
  };

  const handleSubmit = async () => {
    if (!validateForm() || !competencia) return;
    setLoading(true);
    try {
      await onSave({
        nombreCompet: formData.nombreCompet,
        costo: formData.costo,
        etapas: formData.etapas.filter(e => e.editable).map(e => ({ codEtapa: e.codEtapa, nombreEtapa: e.nombreEtapa, fechaInicio: e.fechaInicio, fechaFin: e.fechaFin, orden: e.orden }))
      });
      onClose();
    } catch (err: any) {
      setErrors(prev => ({ ...prev, general: err?.response?.data?.error || 'Error al actualizar competencia' }));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !competencia) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">Editar Competencia</h2>
          <button onClick={onClose} aria-label="Cerrar" className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
        </div>
        <div className="p-6 space-y-6">
          {errors.general && <div className="p-3 bg-red-50 border rounded-md flex items-center gap-2"><AlertCircle size={16} className="text-red-500"/><span className="text-red-700">{errors.general}</span></div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombreCompet" className="block text-sm font-medium mb-1">Nombre</label>
              <input ref={firstInputRef} id="nombreCompet" value={formData.nombreCompet} onChange={e => handleInputChange('nombreCompet', e.target.value)} className={`w-full px-3 py-2 border rounded-md ${errors.nombreCompet ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.nombreCompet && <p className="mt-1 text-sm text-red-600">{errors.nombreCompet}</p>}
            </div>
            <div>
              <label htmlFor="costo" className="block text-sm font-medium mb-1">Costo (Bs.)</label>
              <input id="costo" type="number" step="1" min="0" value={formData.costo} onChange={e => handleInputChange('costo', e.target.value)} disabled={inscripcionStarted} className={`w-full px-3 py-2 border rounded-md ${errors.costo ? 'border-red-500' : 'border-gray-300'} ${inscripcionStarted ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
              {errors.costo && <p className="mt-1 text-sm text-red-600">{errors.costo}</p>}
              {inscripcionStarted && <p className="mt-1 text-sm text-yellow-600">No se puede editar el costo, la inscripción ya inició.</p>}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Etapas</h3>
            <div className="space-y-4">
              {formData.etapas.map(e => (
                <div key={e.codEtapa} className="border p-4 rounded-md">
                  <div className="flex items-center justify-between mb-2"><strong>{e.nombreEtapa}</strong>{!e.editable && <span className="text-yellow-600"> (Iniciada)</span>}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Fecha Inicio</label>
                      <input type="date" value={e.fechaInicio} disabled={!e.editable} onChange={ev => handleDateChange(e.codEtapa,'fechaInicio',ev.target.value)} className="w-full px-3 py-2 border rounded-md" />
                      {errors[`etapa_${e.codEtapa}_fechas`] && <p className="mt-1 text-sm text-red-600">{errors[`etapa_${e.codEtapa}_fechas`]}</p>}
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Fecha Fin</label>
                      <input type="date" value={e.fechaFin} disabled={!e.editable} onChange={ev => handleDateChange(e.codEtapa,'fechaFin',ev.target.value)} className="w-full px-3 py-2 border rounded-md" />
                      {errors[`etapa_${e.codEtapa}_solapamiento`] && <p className="mt-1 text-sm text-red-600">{errors[`etapa_${e.codEtapa}_solapamiento`]}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-md">Cancelar</button>
            <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2">{loading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/> : <><Save size={16}/> Guardar</>}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompetenciasPage() {
  const [competencias, setCompetencias] = useState<Competencia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModal, setEditModal] = useState<{ isOpen: boolean; competencia: CompetenciaDetalle | null }>({ isOpen: false, competencia: null });

  useEffect(() => {
    fetchCompetenciasAPI().then(data => setCompetencias(data)).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const handleEditClick = async (codComp: string) => {
    try {
      const detalle = await fetchCompetenciaByIdAPI(codComp);
      setEditModal({ isOpen: true, competencia: detalle });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (payload: any) => {
    if (!editModal.competencia) return;
    await updateCompetenciaAPI(editModal.competencia.codCompet, payload);
    const updated = await fetchCompetenciasAPI();
    setCompetencias(updated);
    setEditModal({ isOpen: false, competencia: null });
  };

  const closeModal = () => setEditModal({ isOpen: false, competencia: null });

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
        <Cog6ToothIcon className="w-12 h-12" />
        <h1 className="text-3xl font-bold ml-4">Gestión de Competencias</h1>
      </div>
      {isLoading ? (
        <div className="text-center py-8">Cargando competencias...</div>
      ) : competencias.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No hay competencias disponibles.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow mb-6">
          <div className="grid grid-cols-13 bg-gray-800 text-white text-sm">
            <div className="col-span-3 p-2 font-semibold">Nombre</div>
            <div className="col-span-2 p-2 font-semibold">Gestión</div>
            
            <div className="col-span-3 p-2 font-semibold">Inicio</div>
            <div className="col-span-3 p-2 font-semibold">Fin</div>
            <div className="col-span-1 p-2 font-semibold text-center">Costo</div>
            <div className="col-span-1 p-2 font-semibold text-center">Editar</div>
          </div>
          {competencias.map(c => (
            <div key={c.codCompet} className="grid grid-cols-13 bg-white border-b hover:bg-gray-50 text-sm transition-colors">
              <div className="col-span-3 p-2 font-medium text-gray-900">{c.nombreCompet}</div>
              <div className="col-span-2 p-2 font-medium text-gray-900">{c.gestion}</div>
              <div className="col-span-3 p-2 text-gray-700">{new Date(c.fechaIni).toLocaleDateString('es-BO')}</div>
              <div className="col-span-3 p-2 text-gray-700">{new Date(c.fechaFin).toLocaleDateString('es-BO')}</div>
              <div className="col-span-1 p-2 text-center text-gray-700 font-medium">{c.costo}</div>
              <div className="col-span-1 p-2 text-center"><button onClick={() => handleEditClick(c.codCompet)} aria-label="Editar" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-1 rounded-md transition-colors"><Edit size={16}/></button></div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6"><Link href="/administrador" className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all">Volver</Link></div>
      <EditCompetenciaModal isOpen={editModal.isOpen} onClose={closeModal} competencia={editModal.competencia} onSave={handleSave} />
    </div>
  );
}
