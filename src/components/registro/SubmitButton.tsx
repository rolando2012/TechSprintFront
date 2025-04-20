"use client";
import {useFormStatus} from 'react-dom'
import { adlam } from "@/config/fonts";

export default function SubmitButton () {
    const {pending} = useFormStatus()
  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending}
      className={`bg-boton hover:bg-boton-hover text-white ${adlam.className} py-2 px-3 rounded-2xl`}>
    {pending ? "Cargando..." : "Enviar"}
    </button>
  )
}
