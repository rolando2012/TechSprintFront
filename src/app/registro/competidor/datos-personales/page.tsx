'use client';
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useRegistro } from '@/app/registro/competidor/context';
import { useRouter } from 'next/navigation';
import { personalDataSchema, PersonalData } from '@/lib/schemas/ValidarRegComp';
import {
  getDepartamentos,
  getMunicipiosByDepartamento,
  getGrados,
  getNivelesByGrado,
} from '@/lib/dataInscripcion';

export default function Page() {
  const router = useRouter();
  const { personalData, setPersonalData } = useRegistro();
  const [localData, setLocalData] =  useState<PersonalData>(personalData);
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalData, string>>>({});

  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [grados, setGrados] = useState<string[]>([]);
  const [niveles, setNiveles] = useState<string[]>([]);

  // Carga maestros
  useEffect(() => {
    setDepartamentos(getDepartamentos());
    setGrados(getGrados());
  }, []);

  // Al montar, repoblar municipios y niveles según datos previos
  useEffect(() => {
    if (localData.departamento) {
      setMunicipios(getMunicipiosByDepartamento(localData.departamento));
    }
    if (localData.grado) {
      setNiveles(getNivelesByGrado(localData.grado));
    }
  }, []); // sólo al primer render

   // Cuando cambian dep/grado en el form
   const onDepartamentoChange = (dep: string) => {
    setLocalData(d => ({ ...d, departamento: dep, municipio: '' }));
    setMunicipios(dep ? getMunicipiosByDepartamento(dep) : []);
    if (errors.departamento) validateField('departamento', dep);
  };


  const onGradoChange = (gr: string) => {
    setLocalData(d => ({ ...d, grado: gr, nivel: '' }));
    setNiveles(gr ? getNivelesByGrado(gr) : []);
    if (errors.grado) validateField('grado', gr);
  };

  const validateField = (field: keyof PersonalData, value: string) => {
    try {
      z.object({ [field]: personalDataSchema.shape[field] }).parse({ [field]: value });
      setErrors(e => ({ ...e, [field]: undefined }));
    } catch (err) {
      const zErr = err as any;
      setErrors(e => ({ ...e, [field]: zErr.errors[0].message }));
    }
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setLocalData(d => ({ ...d, [name]: value }));
  };

  const validateForm = () => {
    try {
      personalDataSchema.parse(localData);
      setErrors({});
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errs: any = {};
        e.errors.forEach(err => errs[err.path[0] as keyof PersonalData] = err.message);
        setErrors(errs);
      }
      return false;
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setPersonalData(localData);
    router.push('/registro/competidor/inscripcion');
  };

  const formFieldStyle = "bg-gray-200 rounded-3xl p-3 w-full";
  const fieldContainerStyle = "mb-4 border-b-2 border-gray-300 pb-4";
  const labelContainerStyle = "flex items-center text-gray-700 w-1/3";
  const inputContainerStyle = "w-2/3";

  return (
    <form id="registroForm" onSubmit={onSubmit} className="space-y-4">
      {/* Nombre */}
      <div className={fieldContainerStyle}>
        <div className="flex items-center">
          <label htmlFor="nombre" className={labelContainerStyle}>
            <span className="mr-2">👤</span> Nombre(s)
          </label>
          <div className={inputContainerStyle}>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={localData.nombre}
              onChange={handleChange}
              className={`${formFieldStyle} ${errors.nombre ? 'border border-red-500' : ''}`}
              placeholder="Nombre(s)"
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>
        </div>
      </div>

      {/* Apellido */}
      <div className={fieldContainerStyle}>
        <div className="flex items-center">
          <label htmlFor="apellido" className={labelContainerStyle}>
            <span className="mr-2">👤</span> Apellido(s)
          </label>
          <div className={inputContainerStyle}>
            <input
              id="apellido"
              name="apellido"
              type="text"
              value={localData.apellido}
              onChange={handleChange}
              className={`${formFieldStyle} ${errors.apellido ? 'border border-red-500' : ''}`}
              placeholder="Apellido(s)"
            />
            {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
          </div>
        </div>
      </div>

      {/* Carnet de Identidad */}
      <div className={fieldContainerStyle}>
        <div className="flex items-center">
          <label htmlFor="carnetIdentidad" className={labelContainerStyle}>
            <span className="mr-2">🪪</span> Carnet de identidad
          </label>
          <div className={inputContainerStyle}>
            <input
              id="carnetIdentidad"
              name="carnetIdentidad"
              type="text"
              value={localData.carnetIdentidad}
              onChange={handleChange}
              className={`${formFieldStyle} ${errors.carnetIdentidad ? 'border border-red-500' : ''}`}
              placeholder="Carnet de identidad"
            />
            {errors.carnetIdentidad && <p className="text-red-500 text-xs mt-1">{errors.carnetIdentidad}</p>}
          </div>
        </div>
      </div>

      {/* Correo Electrónico */}
      <div className={fieldContainerStyle}>
        <div className="flex items-center">
          <label htmlFor="correoElectronico" className={labelContainerStyle}>
            <span className="mr-2">📧</span> Correo electrónico
          </label>
          <div className={inputContainerStyle}>
            <input
              id="correoElectronico"
              name="correoElectronico"
              type="email"
              value={localData.correoElectronico}
              onChange={handleChange}
              className={`${formFieldStyle} ${errors.correoElectronico ? 'border border-red-500' : ''}`}
              placeholder="Correo electrónico"
            />
            {errors.correoElectronico && <p className="text-red-500 text-xs mt-1">{errors.correoElectronico}</p>}
          </div>
        </div>
      </div>

      {/* Fecha de Nacimiento */}
      <div className={fieldContainerStyle}>
        <div className="flex items-center">
          <label htmlFor="fechaNacimiento" className={labelContainerStyle}>
            <span className="mr-2">🎂</span> Fecha de nacimiento
          </label>
          <div className={inputContainerStyle}>
            <input
              id="fechaNacimiento"
              name="fechaNacimiento"
              type="date"
              value={localData.fechaNacimiento}
              onChange={handleChange}
              className={`${formFieldStyle} ${errors.fechaNacimiento ? 'border border-red-500' : ''}`}
            />
            {errors.fechaNacimiento && <p className="text-red-500 text-xs mt-1">{errors.fechaNacimiento}</p>}
          </div>
        </div>
      </div>

      {/* Departamento */}
      <div className={fieldContainerStyle}>
        <div className="flex items-center">
          <label htmlFor="departamento" className={labelContainerStyle}>
            <span className="mr-2">🏙️</span> Departamento
          </label>
          <div className={inputContainerStyle}>
            <select
              id="departamento"
              name="departamento"
              value={localData.departamento}
              onChange={e => onDepartamentoChange(e.target.value)}
              className={`${formFieldStyle} ${errors.departamento ? 'border border-red-500' : ''}`}
            >
              <option value="">Seleccione un departamento</option>
              {departamentos.map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>
            {errors.departamento && <p className="text-red-500 text-xs mt-1">{errors.departamento}</p>}
          </div>
        </div>
      </div>

      {/* Municipio */}
      <div className={fieldContainerStyle}>
        <div className="flex items-center">
          <label htmlFor="municipio" className={labelContainerStyle}>
            <span className="mr-2">📍</span> Municipio
          </label>
          <div className={inputContainerStyle}>
            <select
              id="municipio"
              name="municipio"
              value={localData.municipio}
              onChange={e => {
                setLocalData(d => ({ ...d, municipio: e.target.value }));
                if (errors.municipio) validateField('municipio', e.target.value);
              }}
              disabled={!localData.departamento}
              className={`${formFieldStyle} ${errors.municipio ? 'border border-red-500' : ''}`}
            >
              <option value="">Seleccione un municipio</option>
              {municipios.map(mun => <option key={mun} value={mun}>{mun}</option>)}
            </select>
            {errors.municipio && <p className="text-red-500 text-xs mt-1">{errors.municipio}</p>}
          </div>
        </div>
      </div>

      {/* Colegio */}
      <div className={fieldContainerStyle}>
        <div className="flex items-center">
          <label htmlFor="colegio" className={labelContainerStyle}>
            <span className="mr-2">🏫</span> Colegio/institución
          </label>
          <div className={inputContainerStyle}>
            <input
              id="colegio"
              name="colegio"
              type="text"
              value={localData.colegio}
              onChange={handleChange}
              className={`${formFieldStyle} ${errors.colegio ? 'border border-red-500' : ''}`}
              placeholder="Colegio/institución"
            />
            {errors.colegio && <p className="text-red-500 text-xs mt-1">{errors.colegio}</p>}
          </div>
        </div>
      </div>

      {/* Grado */}
      <div className={fieldContainerStyle}>
        <div className="flex items-center">
          <label htmlFor="grado" className={labelContainerStyle}>
            <span className="mr-2">📚</span> Grado
          </label>
          <div className={inputContainerStyle}>
            <select
              id="grado"
              name="grado"
              value={localData.grado}
              onChange={e => onGradoChange(e.target.value)}
              className={`${formFieldStyle} ${errors.grado ? 'border border-red-500' : ''}`}
            >
              <option value="">Seleccione un grado</option>
              {grados.map(gr => <option key={gr} value={gr}>{gr}</option>)}
            </select>
            {errors.grado && <p className="text-red-500 text-xs mt-1">{errors.grado}</p>}
          </div>
        </div>
      </div>

      {/* Nivel */}
      <div className={fieldContainerStyle}>
        <div className="flex items-center">
          <label htmlFor="nivel" className={labelContainerStyle}>
            <span className="mr-2">🎓</span> Nivel
          </label>
          <div className={inputContainerStyle}>
            <select
              id="nivel"
              name="nivel"
              value={localData.nivel}
              onChange={e => {
                setLocalData(d => ({ ...d, nivel: e.target.value }));
                if (errors.nivel) validateField('nivel', e.target.value);
              }}
              disabled={!localData.grado}
              className={`${formFieldStyle} ${errors.nivel ? 'border border-red-500' : ''}`}
            >
              <option value="">Seleccione un nivel</option>
              {niveles.map(niv => <option key={niv} value={niv}>{niv}</option>)}
            </select>
            {errors.nivel && <p className="text-red-500 text-xs mt-1">{errors.nivel}</p>}
          </div>
        </div>
      </div>

      {/* Celular */}
      <div className={fieldContainerStyle}>
        <div className="flex items-center">
          <label htmlFor="celular" className={labelContainerStyle}>
            <span className="mr-2">📱</span> Celular
          </label>
          <div className={inputContainerStyle}>
            <input
              id="celular"
              name="celular"
              type="text"
              value={localData.celular}
              onChange={handleChange}
              className={`${formFieldStyle} ${errors.celular ? 'border border-red-500' : ''}`}
              placeholder="Celular"
            />
            {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular}</p>}
          </div>
        </div>
      </div>
    </form>
  );
}