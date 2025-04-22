import { z } from 'zod';

export const personalDataSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  apellido: z.string().min(1, 'El apellido es obligatorio'),
  carnetIdentidad: z
    .string()
    .min(1, 'El número de cédula es obligatorio')
    .regex(/^[0-9]+$/, 'Solo se permiten números'),
  correoElectronico: z
    .string()
    .min(1, 'El correo electrónico es obligatorio')
    .email('Ingrese un correo válido'),
  fechaNacimiento: z
    .string()
    .min(1, 'La fecha de nacimiento es obligatoria')
    .refine(val => !isNaN(Date.parse(val)), 'Fecha inválida'),
  departamento: z.string().min(1, 'Seleccione un departamento'),
  municipio: z.string().min(1, 'Seleccione un municipio'),
  colegio: z.string().min(1, 'El colegio es obligatorio'),
  grado: z.string().min(1, 'Seleccione un grado'),
  nivel: z.string().min(1, 'Seleccione un nivel'),
  celular: z
    .string()
    .min(1, 'El celular es obligatorio')
    .regex(/^\+?[0-9]{8}$/, 'Número de celular inválido(debe ser de 8 dígitos)'),
});

/**
 * Tipo TypeScript inferido a partir del esquema Zod.
 */
export type PersonalData = z.infer<typeof personalDataSchema>;
