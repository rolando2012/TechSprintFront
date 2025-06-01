'use client';
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useRegistro } from '@/app/registro/competidor/context';
import { useRouter } from 'next/navigation';
import { personalDataSchema, PersonalData } from '@/lib/schemas/ValidarRegComp';
import { getGrados, getNivelesByGrado } from '@/lib/dataInscripcion';
import { inter } from '@/config/fonts';
import { Departamento, getDepartamentos, Municipio, getMunicipios } from '@/lib/api/registro';
import {
  User,
  IdCard,
  Mail,
  Calendar,
  MapPin,
  School,
  BookOpen,
  Layers,
  Phone,
} from 'lucide-react';

export default function Page() {
  const router = useRouter();
  const { personalData, setPersonalData } = useRegistro();
  const [localData, setLocalData] = useState<PersonalData>(personalData);
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalData, string>>>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof PersonalData>>(new Set());

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [grados, setGrados] = useState<string[]>([]);
  const [niveles, setNiveles] = useState<string[]>([]);

  const today = new Date();

  const getAge = (born: string) => {
    if (!born) return 0;
    const [y, m, d] = born.split('-').map(Number);
    const b = new Date(y, m - 1, d);
    let age = today.getFullYear() - b.getFullYear();
    const mm = today.getMonth() - b.getMonth();
    if (mm < 0 || (mm === 0 && today.getDate() < b.getDate())) age--;
    return age;
  };

  const age = getAge(localData.fechaNacimiento);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deps = await getDepartamentos();
        setDepartamentos(deps);
      } catch (error) {
        console.error('Error fetching departamentos:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!localData.departamento) {
      setMunicipios([]);
      return;
    }
    (async () => {
      try {
        const mun = await getMunicipios(localData.departamento);
        setMunicipios(mun);
      } catch (error) {
        console.error('Error fetching municipios:', error);
      }
    })();
  }, [localData.departamento]);

  useEffect(() => {
    setGrados(getGrados());
  }, []);

  useEffect(() => {
    if (localData.grado) {
      setNiveles(getNivelesByGrado(localData.grado));
    }
  }, []); // solo al montar, para repoblar según datos previos

  const onDepartamentoChange = (codDept: string) => {
    setLocalData(d => ({ ...d, departamento: codDept, municipio: '' }));
    if (errors.departamento) validateField('departamento', codDept);
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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const field = e.target.name as keyof PersonalData;
    const value = e.target.value;
    setTouchedFields(prev => new Set(prev).add(field));
    validateField(field, value);
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target as { name: keyof PersonalData; value: string };
    setLocalData(d => ({ ...d, [name]: value }));
    validateField(name, value);
  };

  const validateForm = () => {
    try {
      personalDataSchema.parse(localData);
      setErrors({});
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errs: any = {};
        e.errors.forEach(err => {
          errs[err.path[0] as keyof PersonalData] = err.message;
        });
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

  const formFieldStyle = 'bg-gray-200 rounded-3xl p-3 w-full border-none';
  const fieldContainerStyle = 'mb-4 border-b-2 border-gray-300 pb-4';
  const labelContainerStyle = 'flex items-center font-medium text-gray-700 w-1/3';
  const inputContainerStyle = 'w-2/3 font-semibold';

  return (
    <div className="w-full mx-auto bg-gray-100 p-6 rounded-md">
      <h2 className="text-lg text-gray-700 mb-4">Datos personales</h2>
      <form id="registroForm" onSubmit={onSubmit} className="space-y-4">
        {/* Nombre */}
        <div className={fieldContainerStyle}>
          <div className="flex items-center">
            <label htmlFor="nombre" className={labelContainerStyle}>
              <User className="h-5 w-5 text-gray-500 mr-2" />
              Nombre(s)
            </label>
            <div className={`${inputContainerStyle} ${inter.className}`}>
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
              <User className="h-5 w-5 text-gray-500 mr-2" />
              Apellido(s)
            </label>
            <div className={`${inputContainerStyle} ${inter.className}`}>
              <input
                id="apellido"
                name="apellido"
                type="text"
                value={localData.apellido}
                onChange={handleChange}
                onBlur={handleBlur}
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
              <IdCard className="h-5 w-5 text-gray-500 mr-2" />
              Carnet de identidad
            </label>
            <div className={`${inputContainerStyle} ${inter.className}`}>
              <input
                id="carnetIdentidad"
                name="carnetIdentidad"
                type="text"
                value={localData.carnetIdentidad}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${formFieldStyle} ${errors.carnetIdentidad ? 'border border-red-500' : ''}`}
                placeholder="Carnet de identidad"
              />
              {errors.carnetIdentidad && (
                <p className="text-red-500 text-xs mt-1">{errors.carnetIdentidad}</p>
              )}
            </div>
          </div>
        </div>

        {/* Correo Electrónico */}
        <div className={fieldContainerStyle}>
          <div className="flex items-center">
            <label htmlFor="correoElectronico" className={labelContainerStyle}>
              <Mail className="h-5 w-5 text-gray-500 mr-2" />
              Correo electrónico
            </label>
            <div className={`${inputContainerStyle} ${inter.className}`}>
              <input
                id="correoElectronico"
                name="correoElectronico"
                type="email"
                value={localData.correoElectronico}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${formFieldStyle} ${errors.correoElectronico ? 'border border-red-500' : ''}`}
                placeholder="Correo electrónico"
              />
              {errors.correoElectronico && (
                <p className="text-red-500 text-xs mt-1">{errors.correoElectronico}</p>
              )}
            </div>
          </div>
        </div>

        {/* Fecha de Nacimiento */}
        <div className={fieldContainerStyle}>
          <div className="flex items-center">
            <label htmlFor="fechaNacimiento" className={labelContainerStyle}>
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              Fecha de nacimiento
            </label>
            <div className={`${inputContainerStyle} ${inter.className}`}>
              <input
                id="fechaNacimiento"
                name="fechaNacimiento"
                type="date"
                value={localData.fechaNacimiento}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${formFieldStyle} ${errors.fechaNacimiento ? 'border border-red-500' : ''}`}
              />
              {errors.fechaNacimiento && (
                <p className="text-red-500 text-xs mt-1">{errors.fechaNacimiento}</p>
              )}
              {localData.fechaNacimiento && (age < 8 || age > 20) && (
                <p className="text-red-500 text-xs mt-1">
                  Debes tener entre 8 y 20 años (tienes {age}).
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Departamento */}
        <div className={fieldContainerStyle}>
          <div className="flex items-center">
            <label htmlFor="departamento" className={labelContainerStyle}>
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              Departamento
            </label>
            <div className={`${inputContainerStyle} ${inter.className}`}>
              <select
                id="departamento"
                name="departamento"
                value={localData.departamento}
                onChange={e => onDepartamentoChange(e.target.value)}
                onBlur={handleBlur}
                className={`${formFieldStyle} ${errors.departamento ? 'border border-red-500' : ''}`}
              >
                <option value="">Seleccione un departamento</option>
                {departamentos.map(dep => (
                  <option key={dep.codDept} value={dep.codDept}>
                    {dep.nombreDept}
                  </option>
                ))}
              </select>
              {errors.departamento && (
                <p className="text-red-500 text-xs mt-1">{errors.departamento}</p>
              )}
            </div>
          </div>
        </div>

        {/* Municipio */}
        <div className={fieldContainerStyle}>
          <div className="flex items-center">
            <label htmlFor="municipio" className={labelContainerStyle}>
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              Municipio
            </label>
            <div
              className={`${inputContainerStyle} ${inter.className} ${
                !localData.departamento ? 'opacity-60' : ''
              }`}
            >
              <select
                id="municipio"
                name="municipio"
                value={localData.municipio}
                onChange={e => {
                  setLocalData(d => ({ ...d, municipio: e.target.value }));
                  if (errors.municipio) validateField('municipio', e.target.value);
                }}
                onBlur={handleBlur}
                disabled={!localData.departamento}
                className={`${formFieldStyle} ${errors.municipio ? 'border border-red-500' : ''}`}
              >
                <option value="">Seleccione un municipio</option>
                {municipios.map(mun => (
                  <option key={mun.codMun} value={mun.codMun}>
                    {mun.nombreMun}
                  </option>
                ))}
              </select>
              {errors.municipio && (
                <p className="text-red-500 text-xs mt-1">{errors.municipio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Colegio */}
        <div className={fieldContainerStyle}>
          <div className="flex items-center">
            <label htmlFor="colegio" className={labelContainerStyle}>
              <School className="h-5 w-5 text-gray-500 mr-2" />
              Colegio/institución
            </label>
            <div className={`${inputContainerStyle} ${inter.className}`}>
              <input
                id="colegio"
                name="colegio"
                type="text"
                value={localData.colegio}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${formFieldStyle} ${errors.colegio ? 'border border-red-500' : ''}`}
                placeholder="Colegio/institución"
              />
              {errors.colegio && (
                <p className="text-red-500 text-xs mt-1">{errors.colegio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Grado */}
        <div className={fieldContainerStyle}>
          <div className="flex items-center">
            <label htmlFor="grado" className={labelContainerStyle}>
              <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
              Grado
            </label>
            <div className={`${inputContainerStyle} ${inter.className}`}>
              <select
                id="grado"
                name="grado"
                value={localData.grado}
                onChange={e => onGradoChange(e.target.value)}
                onBlur={handleBlur}
                className={`${formFieldStyle} ${errors.grado ? 'border border-red-500' : ''}`}
              >
                <option value="">Seleccione un grado</option>
                {grados.map(gr => (
                  <option key={gr} value={gr}>
                    {gr}
                  </option>
                ))}
              </select>
              {errors.grado && (
                <p className="text-red-500 text-xs mt-1">{errors.grado}</p>
              )}
            </div>
          </div>
        </div>

        {/* Nivel */}
        <div className={fieldContainerStyle}>
          <div className="flex items-center">
            <label htmlFor="nivel" className={labelContainerStyle}>
              <Layers className="h-5 w-5 text-gray-500 mr-2" />
              Nivel
            </label>
            <div
              className={`${inputContainerStyle} ${inter.className} ${
                !localData.grado ? 'opacity-60' : ''
              }`}
            >
              <select
                id="nivel"
                name="nivel"
                value={localData.nivel}
                onChange={e => {
                  setLocalData(d => ({ ...d, nivel: e.target.value }));
                  if (errors.nivel) validateField('nivel', e.target.value);
                }}
                onBlur={handleBlur}
                disabled={!localData.grado}
                className={`${formFieldStyle} ${errors.nivel ? 'border border-red-500' : ''}`}
              >
                <option value="">Seleccione un nivel</option>
                {niveles.map(niv => (
                  <option key={niv} value={niv}>
                    {niv}
                  </option>
                ))}
              </select>
              {errors.nivel && (
                <p className="text-red-500 text-xs mt-1">{errors.nivel}</p>
              )}
            </div>
          </div>
        </div>

        {/* Celular */}
        <div className={fieldContainerStyle}>
          <div className="flex items-center">
            <label htmlFor="celular" className={labelContainerStyle}>
              <Phone className="h-5 w-5 text-gray-500 mr-2" />
              Celular
            </label>
            <div className={`${inputContainerStyle} ${inter.className}`}>
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
              {errors.celular && (
                <p className="text-red-500 text-xs mt-1">{errors.celular}</p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
