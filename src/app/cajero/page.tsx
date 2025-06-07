"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import { FaMoneyCheckAlt, FaHistory } from "react-icons/fa";

export default function CajeroPage() {
  const router = useRouter();

  async function checkPago(): Promise<boolean> {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    
    Swal.fire({
      title: "Verificando fechas...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      // Fetch con configuración para evitar cache
      const res = await fetch(`${BASE_URL}/consulta/competencia/pago-etapa-general`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        cache: 'no-store' // Next.js 15 cache configuration
      });

      if (!res.ok) {
        throw new Error("No hay etapa de pago disponible.");
      }

      const data = await res.json();
      const { competenciaNombre, pagoEtapa } = data;

      // Validación de datos
      if (!pagoEtapa || !pagoEtapa.fechaInicio || !pagoEtapa.horaInicio || 
          !pagoEtapa.fechaFin || !pagoEtapa.horaFin) {
        throw new Error("Datos de etapa de pago incompletos.");
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
      const startBolivia = convertToBoliviaTime(pagoEtapa.fechaInicio, pagoEtapa.horaInicio);
      const endBolivia = convertToBoliviaTime(pagoEtapa.fechaFin, pagoEtapa.horaFin);
      
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
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/La_Paz'
      };

      // Formatear fechas para mostrar
      const startFormatted = startBolivia.toLocaleString("es-BO", formatOptions);
      const endFormatted = endBolivia.toLocaleString("es-BO", formatOptions);

      console.log('Fechas debug:', {
        startUTC: pagoEtapa.fechaInicio,
        horaUTC: pagoEtapa.horaInicio,
        startBolivia: startBolivia.toISOString(),
        nowBolivia: nowBolivia.toISOString(),
        endBolivia: endBolivia.toISOString()
      });

      // Verificar estado de la etapa
      if (nowBolivia < startBolivia) {
        // Antes de la apertura
        await Swal.fire({
          icon: "info",
          title: "Aún no disponible",
          html: `
            <div style="text-align: left; padding: 10px;">
              <p><strong>La etapa de Pago de Inscripciones de "${competenciaNombre}" se habilitará el:</strong></p>
              <p style="color: #0066cc; font-weight: bold; margin-top: 10px;">
                📅 ${startFormatted}
              </p>
              <p style="color: #666; margin-top: 10px; font-size: 0.9em;">
                (Hora de Bolivia)
              </p>
            </div>
          `,
          confirmButtonText: "Entendido"
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
          title: "Fecha de pago finalizada",
          html: `
            <div style="text-align: left; padding: 10px;">
              <p><strong>La etapa de Pago de Inscripciones de "${competenciaNombre}" finalizó el:</strong></p>
              <p style="color: #cc0000; font-weight: bold; margin-top: 10px;">
                📅 ${endFormatted}
              </p>
              <p style="color: #666; margin-top: 10px; font-size: 0.9em;">
                (Hora de Bolivia)
              </p>
            </div>
          `,
          confirmButtonText: "Entendido"
        });
        return false;
      }

      return false;

    } catch (err: any) {
      // Cerrar loading y mostrar error
      Swal.close();
      
      console.error('Error en checkPago:', err);
      
      await Swal.fire({
        icon: "error",
        title: "Error de conexión",
        html: `
          <div style="text-align: left; padding: 10px;">
            <p><strong>No se pudo verificar las fechas de pago:</strong></p>
            <p style="color: #cc0000; margin-top: 10px;">
              ${err.message || "Error desconocido al conectar con el servidor."}
            </p>
            <p style="color: #666; margin-top: 15px; font-size: 0.9em;">
              Por favor, verifica tu conexión a internet y vuelve a intentar.
            </p>
          </div>
        `,
        confirmButtonText: "Reintentar",
        showCancelButton: true,
        cancelButtonText: "Volver"
      });
      
      return false;
    }
  }

  const handlePagosPendientes = async () => {
    try {
      const isAvailable = await checkPago();
      if (isAvailable) {
        router.push("/cajero/pendientes");
      }
    } catch (error) {
      console.error('Error al verificar pagos:', error);
    }
  };

  const handleHistorialPagos = () => {
    router.push("/cajero/historial");
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      {/* Encabezado */}
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


      {/* Botones */}
      <section className="bg-gray-200 py-10 px-4 flex flex-col md:flex-row gap-8 justify-center items-center flex-1">
        <button
          onClick={handlePagosPendientes}
          className="bg-[#B4B9C5] rounded-xl p-6 w-full max-w-[250px] flex flex-col items-center shadow-lg 
                      cursor-pointer hover:bg-[#9EA4B0] hover:shadow-xl transition-all duration-300 
                     hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Ver pagos pendientes"
        >
          <FaMoneyCheckAlt size={70} className="mb-4 text-gray-800" />
          <p className="font-semibold text-gray-800 text-lg">Pagos pendientes</p>
         
        </button>

        <button
          onClick={handleHistorialPagos}
          className="bg-[#B4B9C5] rounded-xl p-6 w-full max-w-[250px] flex flex-col items-center shadow-lg 
                      cursor-pointer hover:bg-[#9EA4B0] hover:shadow-xl transition-all duration-300 
                     hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Ver historial de pagos"
        >
          <FaHistory size={70} className="mb-4 text-gray-800" />
          <p className="font-semibold text-gray-800 text-lg">Historial de pagos</p>
        
        </button>
      </section>
    </main>
  );
}