import { z } from "zod";

export const tutorSchema = z.object({
  nombres: z.string().nonempty({ message: "El nombre es requerido" }),
  apellidoPaterno: z.string().nonempty({ message: "El apellido paterno es requerido" }),
  apellidoMaterno: z.string().nonempty({ message: "El apellido materno es requerido" }),
  celular: z
    .string()
    .nonempty({ message: "El celular es requerido" })
    .regex(/^\+?\d{7,15}$/, { message: "Formato de celular inválido" }),
  email: z.string().email({ message: "Email inválido" }),
  carnet: z.string().nonempty({ message: "El carnet es requerido" }),
  institucion: z.string().nonempty({ message: "La institución es requerida" }),
  departamento: z.string().nonempty({ message: "El departamento es requerido" }),
  municipio: z.string().nonempty({ message: "El municipio es requerido" }),
  area: z.string().nonempty({ message: "El área es requerida" }),
});

export type TutorFormData = z.infer<typeof tutorSchema>;
