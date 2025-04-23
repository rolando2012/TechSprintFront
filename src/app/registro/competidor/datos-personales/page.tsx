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
  const [touchedFields, setTouchedFields] = useState<Set<keyof PersonalData>>(new Set());

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

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const field = e.target.name as keyof PersonalData;
    const value = e.target.value;
    // Marca como tocado
    setTouchedFields(prev => new Set(prev).add(field));
    // Dispara la validación de ese campo
    validateField(field, value);
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

  const formFieldStyle = "bg-gray-200 rounded-3xl p-3 w-full border-none";
  const fieldContainerStyle = "mb-4 border-b-2 border-gray-300 pb-4";
  const labelContainerStyle = "flex items-center text-gray-700 w-1/3";
  const inputContainerStyle = "w-2/3";

  return (
    <div className="w-full mx-auto bg-gray-100 p-6 rounded-md">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Datos personales</h2>
    <form id="registroForm" onSubmit={onSubmit} className="space-y-4">
      <div className={fieldContainerStyle}>
        <div className="flex items-center">
          <label htmlFor="nombre" className={labelContainerStyle}>
          <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </span>
             Nombre(s)
          </label>
          <div className={inputContainerStyle}>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={localData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
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
          <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </span>
            Apellido(s)
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
          <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </span>
          Carnet de identidad
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
          <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
            Correo electrónico
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
          <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </span>
             Fecha de nacimiento
          </label>
          <div className={inputContainerStyle}>
            <input
              id="fechaNacimiento"
              name="fechaNacimiento"
              type="date"
              value={localData.fechaNacimiento}
              max={new Date().toISOString().split("T")[0]}
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
          <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
              </span>
          Departamento
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
          <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </span>
            Municipio
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
          <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </span>
            Colegio/institución
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
          <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </span>
            Grado
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
          <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </span>
            Nivel
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
          <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </span>
            Celular
          </label>
          <div className={inputContainerStyle}>
            <input
              id="celular"
              name="celular"
              type="text"
              value={localData.celular}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${formFieldStyle} ${errors.celular ? 'border border-red-500' : ''}`}
              placeholder="Celular"
            />
            {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular}</p>}
          </div>
        </div>
      </div>
    </form>
    </div>
  );
}