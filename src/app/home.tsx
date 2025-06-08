"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { adlam, inter } from "@/config/fonts";
import LoginModal from "@/components/Modals/LoginModal";

type Role = "admin" | "tutor" | "competidor" | "cajero";

export default function Home() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleOpenLogin = (role: Role) => {
    setSelectedRole(role);
    setShowModal(true);
  };

async function checkInscripcion(): Promise<boolean> {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  
  Swal.fire({
    title: "Verificando fechas...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    // Fetch con configuración para evitar cache
    const res = await fetch(
      `${BASE_URL}/consulta/competencia/inscripcion-etapa-general`,
      {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store'
      }
    );

    if (!res.ok) {
      throw new Error("Fuera de periodo de Inscripciones.");
    }

    const data = await res.json();
    const { competenciaNombre, inscripcionEtapa } = data;

    // Validación de datos
    if (!inscripcionEtapa || !inscripcionEtapa.fechaInicio || !inscripcionEtapa.horaInicio || 
        !inscripcionEtapa.fechaFin || !inscripcionEtapa.horaFin) {
      throw new Error("Datos de etapa de inscripción incompletos.");
    }

    // Función para crear fecha completa en hora de Bolivia
    const createBoliviaDateTime = (fechaISO: string, horaISO: string): Date => {
      // Extraer fecha (YYYY-MM-DD)
      const fecha = new Date(fechaISO);
      
      // Extraer hora (viene como "1970-01-01T04:00:00.000Z")
      const horaDate = new Date(horaISO);
      const horas = horaDate.getUTCHours();
      const minutos = horaDate.getUTCMinutes();
      const segundos = horaDate.getUTCSeconds();
      
      // Crear fecha completa directamente en Bolivia (sin conversiones UTC)
      // Usar los componentes de fecha directamente
      const fechaCompleta = new Date(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate(),
        horas,
        minutos,
        segundos
      );
      
      return fechaCompleta;
    };

    // Crear fechas de inicio y fin en hora Bolivia
    const startBolivia = createBoliviaDateTime(inscripcionEtapa.fechaInicio, inscripcionEtapa.horaInicio);
    const endBolivia = createBoliviaDateTime(inscripcionEtapa.fechaFin, inscripcionEtapa.horaFin);
    
    // Obtener fecha actual de Bolivia
    const nowBolivia = new Date();

    // Cerrar modal de loading
    Swal.close();

    // Opciones de formateo para Bolivia
    const formatOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/La_Paz'
    };

    // Formatear fechas para mostrar
    const startFormatted = startBolivia.toLocaleString("es-BO", formatOptions);
    const endFormatted = endBolivia.toLocaleString("es-BO", formatOptions);

    // Debug para verificar fechas
    console.log('Fechas inscripción debug:', {
      fechaInicioOriginal: inscripcionEtapa.fechaInicio,
      horaInicioOriginal: inscripcionEtapa.horaInicio,
      startBolivia: startBolivia.toString(),
      nowBolivia: nowBolivia.toString(),
      endBolivia: endBolivia.toString(),
      startFormatted,
      endFormatted,
      comparacion: {
        antesDeInicio: nowBolivia < startBolivia,
        dentroDelPeriodo: nowBolivia >= startBolivia && nowBolivia <= endBolivia,
        despuesDelFin: nowBolivia > endBolivia
      }
    });

    // Verificar estado de la etapa
    if (nowBolivia < startBolivia) {
      // Antes de la apertura
      await Swal.fire({
        icon: "info",
        title: "Inscripciones aún no abiertas",
        html: `
          <div style="text-align: left; padding: 15px;">
            <p><strong>La etapa de Inscripciones de "${competenciaNombre}" se habilitará el:</strong></p>
            <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2196f3;">
              <p style="color: #1976d2; font-weight: bold; font-size: 1.1em; margin: 0;">
                📅 ${startFormatted}
              </p>
            </div>
            <p style="color: #666; font-size: 0.9em; text-align: center;">
              (Hora de Bolivia)
            </p>
          </div>
        `,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#2196f3"
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
        title: "Periodo de Inscripciones finalizado",
        html: `
          <div style="text-align: left; padding: 15px;">
            <p><strong>La etapa de Inscripciones de "${competenciaNombre}" finalizó el:</strong></p>
            <div style="background-color: #fff8e1; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ff9800;">
              <p style="color: #f57c00; font-weight: bold; font-size: 1.1em; margin: 0;">
                📅 ${endFormatted}
              </p>
            </div>
            <p style="color: #666; font-size: 0.9em; text-align: center;">
              (Hora de Bolivia)
            </p>
          </div>
        `,
        confirmButtonText: "Entendido",
        confirmButtonColor: "#ff9800"
      });
      return false;
    }

    return false;

  } catch (err: any) {
    // Cerrar loading y mostrar error
    Swal.close();
    
    console.error('Error en checkInscripcion:', err);
    
    await Swal.fire({
      icon: "error",
      title: "Error de conexión",
      html: `
        <div style="text-align: left; padding: 15px;">
          <p><strong>No se pudo verificar el periodo de inscripciones:</strong></p>
          <div style="background-color: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #f44336;">
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
      confirmButtonColor: "#f44336",
      showCancelButton: true,
      cancelButtonText: "Volver"
    });
    
    return false;
  }
}

  const handleComienza = async () => {
    if (await checkInscripcion()) {
      router.push("/registro/competidor/datos-personales");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <main className="flex-1 flex flex-col gap-24">
        {/* Bienvenida */}
        <section className="bg-bright-gray-700 text-white px-6 py-12 flex flex-col md:flex-row gap-10 items-center w-full">
          <div className="container max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <Image
              src="/images/competencia.svg"
              alt="Competencia"
              width={600}
              height={400}
              className="rounded-xl shadow-lg"
              priority
            />
            <div className="max-w-xl">
              <h1
                className={`${inter.className} text-4xl text-center font-bold mb-6`}
              >
                ¡Bienvenido a TechSprint!
              </h1>
               <p className={`${inter.className} text-center mb-4 text-lg`}>
                TechSprint es el punto de partida para los futuros innovadores. Nuestra plataforma reúne a estudiantes,
                docentes y entusiastas de la tecnología en un espacio donde la pasión por el conocimiento se convierte en acción.
              </p>
              <p className={`${inter.className} text-center mb-6 text-lg`}>
                Participá en competencias emocionantes de Matemáticas, Robótica, Computación, Astronomía y mucho más.
                🌟 ¡Inscribite. Compite. Superate! {' '}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handleComienza}
                  className={`bg-boton hover:bg-boton-hover text-white cursor-pointer ${adlam.className} 
                            text-lg font-semibold px-6 py-3 rounded-full transition-all transform hover:scale-105 active:scale-95`}
                >
                  Comienza el desafío
                </button>
              </div>
            </div>
          </div>
        </section>

         {/* Sección Roles */}
        <section className="bg-gray-100 py-16 w-full">
          <div className="container max-w-screen-xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-center mb-10">INICIA SESIÓN COMO:</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
              {[
                { label: 'ADMINISTRADOR', img: 'admin.svg', value: 'admin' },
                { label: 'TUTOR', img: 'tutor.svg', value: 'tutor' },
                { label: 'COMPETIDOR', img: 'competidor.svg', value: 'competidor' },
                { label: 'CAJERO', img: 'cajero.svg', value: 'cajero' },
              ].map(({ label, img, value }) => (
                <div key={value}>
                  <Image src={`/images/${img}`} alt={label} width={100} height={100} className="mx-auto" />
                  <button
                    onClick={() => handleOpenLogin(value as Role)}
                    className="mt-4 bg-boton text-white px-6 py-3 text-sm font-bold rounded-full hover:bg-boton-hover 
                    transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    {label}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Noticias */}
        <section className="bg-[#434854] text-white py-16 w-full">
          <div className="container max-w-screen-xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-10">NOTICIAS</h2>
            <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">PERIODO DE INSCRIPCIÓN</h3>
                <p className="mb-4">del 1 al 31 de Abril 2025</p>
                <Image src="/images/calendario.svg" alt="Calendario" width={250} height={200} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">CONVOCATORIA</h3>
                <Image src="/images/convocatoria.svg" alt="Convocatoria" width={250} height={200} />
                <a
                  href="/descargas/convocatoria.pdf"
                  download
                  className="inline-block mt-4 bg-boton text-white px-5 py-2 rounded-full hover:bg-boton-hover transition"
                >
                  Descargar PDF
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Áreas */}
        <section className="bg-white py-16 w-full">
          <div className="container max-w-screen-xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-10">NUESTRAS ÁREAS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {[
                { label: 'MATEMÁTICA', img: 'matematica.svg' },
                { label: 'ROBÓTICA', img: 'robotica.svg' },
                { label: 'COMPUTACIÓN', img: 'computacion.svg' },
                { label: 'ASTRONOMÍA', img: 'astronomia.svg' },
              ].map(({ label, img }) => (
                <div key={label} className="text-center">
                  <Image src={`/images/${img}`} alt={label} width={350} height={200} className="mx-auto rounded-md" />
                  <p className="mt-4 text-lg">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      {/* Modal de Login */}
      {showModal && selectedRole && (
        <LoginModal
          role={selectedRole}
          onClose={() => {
            setShowModal(false)
            setSelectedRole(null)
          }}
        />
      )}
    </div>
  )
}
