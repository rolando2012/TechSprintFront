import { useState } from 'react';
import { z } from 'zod';
import { forwardRef } from 'react';

type Props = {
  onSubmitSuccess: () => void;
};


// Define validation schema
const personalDataSchema = z.object({
  nombre: z.string().min(1, { message: 'El nombre es requerido' }),
  apellido: z.string().min(1, { message: 'El apellido es requerido' }),
  carnetIdentidad: z.string().min(1, { message: 'El carnet de identidad es requerido' }),
  correoElectronico: z.string().email({ message: 'Ingrese un correo electrónico válido' }),
  fechaNacimiento: z.string().min(1, { message: 'La fecha de nacimiento es requerida' }),
  departamento: z.string().min(1, { message: 'El departamento es requerido' }),
  municipio: z.string().min(1, { message: 'El municipio es requerido' }),
  colegio: z.string().min(1, { message: 'El colegio/institución es requerido' }),
  grado: z.string().min(1, { message: 'El grado o nivel es requerido' }),
  celular: z.string().min(1, { message: 'El número de celular es requerido' }).regex(/^\d+$/, { message: 'El número de celular debe contener solo dígitos' }),
});

type PersonalData = z.infer<typeof personalDataSchema>;

const PersonalDataForm = forwardRef<HTMLFormElement, Props>(({ onSubmitSuccess }, ref) => {
  const [formData, setFormData] = useState<PersonalData>({
    nombre: '',
    apellido: '',
    carnetIdentidad: '',
    correoElectronico: '',
    fechaNacimiento: '',
    departamento: '',
    municipio: '',
    colegio: '',
    grado: '',
    celular: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PersonalData, string>>>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof PersonalData>>(new Set());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate field on change if it has been touched
    if (touchedFields.has(name as keyof PersonalData)) {
      validateField(name as keyof PersonalData, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name as keyof PersonalData;
    
    // Mark field as touched
    setTouchedFields((prev) => new Set(prev).add(field));
    
    // Validate on blur
    validateField(field, value);
  };

  const validateField = (field: keyof PersonalData, value: string) => {
    try {
      const fieldSchema = z.object({ [field]: personalDataSchema.shape[field] });
      fieldSchema.parse({ [field]: value });
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((e) => e.path[0] === field)?.message;
        setErrors((prev) => ({ ...prev, [field]: fieldError }));
      }
    }
  };

  const validateForm = () => {
    try {
      personalDataSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof PersonalData, string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof PersonalData;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
        
        // Mark all fields as touched
        setTouchedFields(new Set(Object.keys(formData) as Array<keyof PersonalData>));
      }
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // if (validateForm()) {
      console.log('Form data is valid:', formData);
      // Here you would typically submit the form or move to the next step
      alert('Formulario válido. Pasando a la siguiente página...');
      onSubmitSuccess();
    // } else {
    //   console.log('Form data is invalid');
    // }
  };


  return (
    <div className="max-w-lg mx-auto bg-gray-100 p-6 rounded-md">
      <h2 className="text-lg font-medium text-gray-700 mb-4">Datos personales</h2>
      
      <form ref={ref} onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre(s)"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`flex-1 border-b-2 bg-transparent py-2 pl-2 focus:outline-none ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
        </div>

        <div className="relative">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              name="apellido"
              placeholder="Apellido(s)"
              value={formData.apellido}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`flex-1 border-b-2 bg-transparent py-2 pl-2 focus:outline-none ${errors.apellido ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
        </div>

        <div className="relative">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              name="carnetIdentidad"
              placeholder="Carnet de identidad"
              value={formData.carnetIdentidad}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`flex-1 border-b-2 bg-transparent py-2 pl-2 focus:outline-none ${errors.carnetIdentidad ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.carnetIdentidad && <p className="text-red-500 text-xs mt-1">{errors.carnetIdentidad}</p>}
        </div>

        <div className="relative">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <input
              type="email"
              name="correoElectronico"
              placeholder="Correo electrónico"
              value={formData.correoElectronico}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`flex-1 border-b-2 bg-transparent py-2 pl-2 focus:outline-none ${errors.correoElectronico ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.correoElectronico && <p className="text-red-500 text-xs mt-1">{errors.correoElectronico}</p>}
        </div>

        <div className="relative">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="date"
              name="fechaNacimiento"
              placeholder="Fecha de nacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`flex-1 border-b-2 bg-transparent py-2 pl-2 focus:outline-none ${errors.fechaNacimiento ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.fechaNacimiento && <p className="text-red-500 text-xs mt-1">{errors.fechaNacimiento}</p>}
        </div>

        <div className="relative">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              name="departamento"
              placeholder="Departamento"
              value={formData.departamento}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`flex-1 border-b-2 bg-transparent py-2 pl-2 focus:outline-none ${errors.departamento ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.departamento && <p className="text-red-500 text-xs mt-1">{errors.departamento}</p>}
        </div>

        <div className="relative">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              name="municipio"
              placeholder="Municipio"
              value={formData.municipio}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`flex-1 border-b-2 bg-transparent py-2 pl-2 focus:outline-none ${errors.municipio ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.municipio && <p className="text-red-500 text-xs mt-1">{errors.municipio}</p>}
        </div>

        <div className="relative">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <input
              type="text"
              name="colegio"
              placeholder="Colegio/institución"
              value={formData.colegio}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`flex-1 border-b-2 bg-transparent py-2 pl-2 focus:outline-none ${errors.colegio ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.colegio && <p className="text-red-500 text-xs mt-1">{errors.colegio}</p>}
        </div>

        <div className="relative">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <input
              type="text"
              name="grado"
              placeholder="Grado o nivel"
              value={formData.grado}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`flex-1 border-b-2 bg-transparent py-2 pl-2 focus:outline-none ${errors.grado ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.grado && <p className="text-red-500 text-xs mt-1">{errors.grado}</p>}
        </div>

        <div className="relative">
          <div className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <input
              type="text"
              name="celular"
              placeholder="Celular"
              value={formData.celular}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`flex-1 border-b-2 bg-transparent py-2 pl-2 focus:outline-none ${errors.celular ? 'border-red-500' : 'border-gray-300'}`}
            />
          </div>
          {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular}</p>}
        </div>
      </form>
    </div>
  );
});

PersonalDataForm.displayName = 'PersonalDataForm'; 
export default PersonalDataForm;