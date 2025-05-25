'use client';

import React,{useState, useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tutorSchema, TutorFormData } from '@/lib/schemas/tutorSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Phone,
  Mail,
  CreditCard,
  Building2,
  MapPin,
  Globe,
  Briefcase,
} from 'lucide-react';
import {getAreas, Areas} from '@/lib/api/registro';

const departamentos = [
  { value: 'lp', label: 'La Paz' },
  { value: 'cb', label: 'Cochabamba' },
  { value: 'sc', label: 'Santa Cruz' },
  // ... más departamentos
];

const municipios = [
  { value: 'mlp', label: 'Municipio La Paz' },
  { value: 'ic', label: 'El Alto' },
  // ... más municipios según departamento
];


export default function RegistroTutor() {
  const form = useForm<TutorFormData>({
    resolver: zodResolver(tutorSchema),
    defaultValues: {
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      celular: '',
      email: '',
      carnet: '',
      institucion: '',
      departamento: '',
      municipio: '',
      area: '',
    },
  });
  const [areas, setAreas] = useState<Areas[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [errorAreas, setErrorAreas] = useState<string | null>(null);
  useEffect(() => {
    getAreas()
      .then(data => {
        setAreas(data);
        setLoadingAreas(false);
      })
      .catch(err => {
        setErrorAreas(err.message);
        setLoadingAreas(false);
      });
  }, []);


  function onSubmit(data: TutorFormData) {
    console.log('Datos enviados:', data);
    form.reset();
  }

  return (
     <div className="  flex items-center justify-center p-4">
      <div className=" px-8 w-full ">
        <h1 className="text-4xl font-extralight text-center mb-6">Registro de Tutor</h1>
        <h2 className="text-lg  text-gray-700 mb-6">
          Datos personales
        </h2>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            {/* Nombres */}
            <FormField
              control={form.control}
              name="nombres"
              render={({ field, fieldState }) => (
                <FormItem>
                  <div className="flex items-center mb-1">
                    <User className="mr-2 text-gray-600" />
                    <FormLabel >Nombres</FormLabel>
                  </div>
                  <FormControl>
                    <Input {...field} placeholder="Ingrese su nombre"
                    className='bg-white ' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Apellido Paterno */}
            <FormField
              control={form.control}
              name="apellidoPaterno"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center mb-1">
                    <User className="mr-2 text-gray-600" />
                    <FormLabel>Apellido paterno</FormLabel>
                  </div>
                  <FormControl>
                    <Input {...field} placeholder="Apellido paterno"
                    className='bg-white ' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Apellido Materno */}
            <FormField
              control={form.control}
              name="apellidoMaterno"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center mb-1">
                    <User className="mr-2 text-gray-600" />
                    <FormLabel>Apellido materno</FormLabel>
                  </div>
                  <FormControl>
                    <Input {...field} placeholder="Apellido materno"
                    className='bg-white ' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Celular */}
            <FormField
              control={form.control}
              name="celular"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center mb-1">
                    <Phone className="mr-2 text-gray-600" />
                    <FormLabel>Celular</FormLabel>
                  </div>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="+591 7xxxxxxx" 
                    className='bg-white '/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center mb-1">
                    <Mail className="mr-2 text-gray-600" />
                    <FormLabel>Email</FormLabel>
                  </div>
                  <FormControl>
                    <Input {...field} type="email" placeholder="correo@ejemplo.com"
                    className='bg-white ' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Carnet */}
            <FormField
              control={form.control}
              name="carnet"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center mb-1">
                    <CreditCard className="mr-2 text-gray-600" />
                    <FormLabel>Carnet</FormLabel>
                  </div>
                  <FormControl>
                    <Input {...field} placeholder="Carnet" 
                    className='bg-white '/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Institución */}
            <FormField
              control={form.control}
              name="institucion"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center mb-1">
                    <Building2 className="mr-2 text-gray-600" />
                    <FormLabel>Institución</FormLabel>
                  </div>
                  <FormControl>
                    <Input {...field} placeholder="Institución" 
                    className='bg-white '/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Departamento */}
            <FormField
              control={form.control}
              name="departamento"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center mb-1">
                    <Globe className="mr-2 text-gray-600" />
                    <FormLabel>Departamento</FormLabel>
                  </div>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value} >
                      <SelectTrigger className='bg-white w-full'>
                        <SelectValue placeholder="Seleccione departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {departamentos.map((d) => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Municipio */}
            <FormField
              control={form.control}
              name="municipio"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center mb-1">
                    <MapPin className="mr-2 text-gray-600" />
                    <FormLabel>Municipio</FormLabel>
                  </div>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className='bg-white w-full'>
                        <SelectValue placeholder="Seleccione municipio" />
                      </SelectTrigger>
                      <SelectContent>
                        {municipios.map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Área */}
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem className="w-full">
                  <div className="flex items-center mb-1">
                    <Briefcase className="mr-2 text-gray-600" />
                    <FormLabel>Área</FormLabel>
                  </div>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className="bg-white w-full">
                        <SelectValue
                          placeholder={
                            loadingAreas ? 'Cargando…' : errorAreas ? 'Error al cargar' : 'Seleccione área'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {errorAreas ? (
                          <SelectItem value="">Error: {errorAreas}</SelectItem>
                        ) : (
                          areas.map(a => (
                            <SelectItem key={a.codArea} value={String(a.codArea)}>
                              {a.nombreArea}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-center gap-4 w-full mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-boton hover:bg-boton-hover text-white rounded-2xl cursor-pointer"
              >
                Registrar
              </button>
              <button
                type="button"
                onClick={() => form.reset()}
                className="px-6 py-2 block bg-boton-2 hover:bg-boton-2-hover text-white rounded-2xl cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
           </form>
        </Form>
      </div>
    </div>
  );
}
