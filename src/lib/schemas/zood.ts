import { object, string } from "zod"
 
export const LoginSchema = object({
    email: string({ required_error: "El email es obligatorio" })
        .min(1, "El email es obligatorio")
        .email("Email invalidp "),
    password: string({ required_error: "La contraseña es obligatoria" })
        .min(1, "La contraseña es obligatoria")
        .min(4, "Password must be more than 4 characters")
        .max(30, "Password must be less than 32 characters"),
    code: string({required_error: "El codigo es obligatorio"})
        .min(1,"El codigo es obligatorio")
})