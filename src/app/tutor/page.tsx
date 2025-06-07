"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  FaUserCheck,
  FaCheckCircle,
  FaFileSignature,
} from "react-icons/fa";
import { SiSearxng } from "react-icons/si";

export default function TutorPage() {
  const router = useRouter();

  async function checkValidacion(): Promise<boolean> {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    
    Swal.fire({
      title: "Verificando fechas...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      // Fetch con configuración para evitar cache
      const res = await fetch(
        `${BASE_URL}/consulta/competencia/validacion-etapa-general`,
        {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          },
          cache: 'no-store' // Next.js 15 cache configuration
        }
      );

      if (!res.ok) {
        throw new Error("No hay etapa de validación disponible.");
      }

      const data = await res.json();
      const { competenciaNombre, validacionEtapa } = data;

      // Validación de datos
      if (!validacionEtapa || !validacionEtapa.fechaInicio || !validacionEtapa.horaInicio || 
          !validacionEtapa.fechaFin || !validacionEtapa.horaFin) {
        throw new Error("Datos de etapa de validación incompletos.");
      }

      // Función para convertir UTC a Bolivia (UTC-4)
      const convertToBoliviaTime = (fechaUTC: string, horaUTC: string): Date => {
        // Extraer fecha
        const fecha = new Date(fechaUTC);
        
        // Extraer hora (viene como "1970-01-01T04:00:00.000Z")
        const horaDate = new Date(horaUTC);
        const horas = horaDate.getUTCHours();
        const minutos = horaDate.getUTCMinutes();
        const segundos = horaDate.getUTCSeconds();
        
        // Crear fecha completa en UTC
        const fechaCompleta = new Date(Date.UTC(
          fecha.getUTCFullYear(),
          fecha.getUTCMonth(),
          fecha.getUTCDate(),
          horas,
          minutos,
          segundos
        ));
        
        // Convertir a hora Bolivia (UTC-4)
        // Restamos 4 horas para obtener la hora local de Bolivia
        const fechaBolivia = new Date(fechaCompleta.getTime() - (4 * 60 * 60 * 1000));
        
        return fechaBolivia;
      };

      // Convertir fechas a hora Bolivia
      const startBolivia = convertToBoliviaTime(validacionEtapa.fechaInicio, validacionEtapa.horaInicio);
      const endBolivia = convertToBoliviaTime(validacionEtapa.fechaFin, validacionEtapa.horaFin);
      
      // Obtener fecha actual en Bolivia
      const nowUTC = new Date();
      const nowBolivia = new Date(nowUTC.getTime() - (4 * 60 * 60 * 1000));

      // Cerrar modal de loading
      Swal.close();

      // Opciones de formateo para Bolivia
      const formatOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        
      };

      // Formatear fechas para mostrar
      const startFormatted = startBolivia.toLocaleString("es-BO", formatOptions);
      const endFormatted = endBolivia.toLocaleString("es-BO", formatOptions);

      console.log('Fechas validación debug:', {
        startUTC: validacionEtapa.fechaInicio,
        horaUTC: validacionEtapa.horaInicio,
        startBolivia: startBolivia.toISOString(),
        nowBolivia: nowBolivia.toISOString(),
        endBolivia: endBolivia.toISOString(),
        startFormatted,
        endFormatted
      });

      // Verificar estado de la etapa
      if (nowBolivia < startBolivia) {
        // Antes de la apertura
        await Swal.fire({
          icon: "info",
          title: "Aún no disponible",
          html: `
            <div style="text-align: left; padding: 15px;">
              <p><strong>La etapa de Validación de Requisitos de "${competenciaNombre}" se habilitará el:</strong></p>
              <div style="background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p style="color: #1976d2; font-weight: bold; font-size: 1.1em; margin: 0;">
                  📅 ${startFormatted}
                </p>
              </div>
             
            </div>
          `,
          confirmButtonText: "Entendido",
          confirmButtonColor: "#1976d2"
        });
        return false;
      }

      if (nowBolivia >= startBolivia && nowBolivia <= endBolivia) {
        // Durante el periodo válido
        return true;
      }

      if (nowBolivia > endBolivia) {
        // Después de la fecha de fin
        await Swal.fire({
          icon: "warning",
          title: "Período de validación finalizado",
          html: `
            <div style="text-align: left; padding: 15px;">
              <p><strong>La etapa de Validación de Requisitos de "${competenciaNombre}" finalizó el:</p>
              <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p style="color: #f57c00; font-weight: bold; font-size: 1.1em; margin: 0;">
                  📅 ${endFormatted}
                </p>
              </div>
              
            </div>
          `,
          confirmButtonText: "Entendido",
          confirmButtonColor: "#f57c00"
        });
        return false;
      }

      return false;

    } catch (err: any) {
      // Cerrar loading y mostrar error
      Swal.close();
      
      console.error('Error en checkValidacion:', err);
      
      await Swal.fire({
        icon: "error",
        title: "Error de conexión",
        html: `
          <div style="text-align: left; padding: 15px;">
            <p><strong>No se pudo verificar las fechas de validación:</strong></p>
            <div style="background-color: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="color: #d32f2f; font-weight: bold; margin: 0;">
                ${err.message || "Error desconocido al conectar con el servidor."}
              </p>
            </div>
            <p style="color: #666; font-size: 0.9em; text-align: center;">
              Por favor, verifica tu conexión a internet y vuelve a intentar.
            </p>
          </div>
        `,
        confirmButtonText: "Reintentar",
        confirmButtonColor: "#d32f2f",
        showCancelButton: true,
        cancelButtonText: "Volver"
      });
      
      return false;
    }
  }

  const handleValidar = async () => {
    try {
      const isAvailable = await checkValidacion();
      if (isAvailable) {
        router.push("/tutor/validar");
      }
    } catch (error) {
      console.error('Error al verificar validación:', error);
    }
  };

  const options = [
    {
      icon: <FaUserCheck size={70} />,
      label: "Participantes asignados",
      ruta: "/tutor/competidores",
      type: "link",
    },
    {
      icon: <FaCheckCircle size={70} />,
      label: "Validar inscripciones",
      type: "button",
      onClick: handleValidar,
    },
    {
      icon: <SiSearxng size={70} />,
      label: "Consultar estado competidor",
      ruta: "/tutor/consulta",
      type: "link",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      {/* Imagen UMSS */}
      <section className="w-full">
        <Image
          src="/images/umss.svg"
          alt="Universidad Mayor de San Simón"
          width={1200}
          height={500}
          className="w-full h-auto object-cover"
          priority
        />
      </section>


      {/* Opciones del Tutor */}
      <section className="bg-gray-200 py-10 px-4 flex flex-col md:flex-row justify-center gap-8 flex-1 items-center">
        {options.map((opt) =>
          opt.type === "link" ? (
            <Link
              href={opt.ruta!}
              key={opt.label}
              className="bg-bright-gray-300  rounded-xl p-6 w-full max-w-[220px] flex flex-col items-center 
                  shadow hover:shadow-md cursor-pointer hover:bg-bright-gray-400 
                  transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
              aria-label={opt.label}
            >
              <div className="text-6xl mb-4 text-gray-800 group-hover:text-gray-700 transition-colors">
                {opt.icon}
              </div>
              <p className="font-semibold text-center text-gray-800 text-lg mb-2">
                {opt.label}
              </p>
             
            </Link>
          ) : (
            <button
              key={opt.label}
              onClick={opt.onClick}
              className="bg-bright-gray-300  rounded-xl p-6 w-full max-w-[220px] flex flex-col items-center 
                  shadow hover:shadow-md cursor-pointer hover:bg-bright-gray-400 
                  transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
              aria-label={opt.label}
            >
              <div className="text-6xl mb-4 text-gray-800 group-hover:text-gray-700 transition-colors">
                {opt.icon}
              </div>
              <p className="font-semibold text-center text-gray-800 text-lg mb-2">
                {opt.label}
              </p>
            
            </button>
          )
        )}
      </section>
    </main>
  );
}