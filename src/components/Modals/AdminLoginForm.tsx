'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { LoginSchema } from '@/lib/schemas/zood'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface Props {
  onClose: () => void
  onLogin?: () => void
}

export default function AdminLoginForm({ onClose, onLogin }: Props) {
  const router = useRouter()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      code: '',
    },
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    console.log(values)
    // router.push('/administrador')
    onLogin?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-[#e2e5ea] rounded-2xl w-full max-w-3xl p-10 shadow-lg relative">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Bienvenido al servicio TechSprint para administrador(es)
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <Image
            src="/images/admin.png"
            alt="Administrador"
            width={200}
            height={200}
            className="object-contain"
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-800 font-normal text-md'>Correo:</FormLabel>
                    <FormControl>
                      <Input
                        className='bg-white text-gray-800 font-normal text-lg'
                        placeholder="Example@something.domain"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-800 font-normal text-md'>Contraseña:</FormLabel>
                    <FormControl>
                      <Input
                        className='bg-white text-gray-800 font-normal text-lg'
                        type="password"
                        placeholder="************"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-800 font-normal text-md'>Código:</FormLabel>
                    <FormControl>
                      <Input
                        className='bg-white text-gray-800 font-normal text-lg'
                        placeholder="CodAdmin123"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                <button
                  type="submit"
                  className="bg-boton hover:bg-boton-hover text-white font-normal py-2 px-6 rounded-full"
                >
                  Ingresar
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-boton-2 hover:bg-boton-2-hover text-white font-normal py-2 px-6 rounded-full"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}