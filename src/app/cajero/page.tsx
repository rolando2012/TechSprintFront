"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import { FaMoneyCheckAlt, FaHistory } from "react-icons/fa";

export default function CajeroPage() {
  const router = useRouter();
  async function checkPago(): Promise<boolean> {
    let timerInterval: NodeJS.Timeout;
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    // 1. Abrir SweetAlert2 con didOpen
    await Swal.fire({
      title: "Verificando fechas...",
      html: `
        <div>
          <p>No cierre la ventana del navegador</p>
          <p>Tiempo restante: <b></b> ms</p>
        </div>
      `,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: async () => {
        Swal.showLoading();

        // Cada 100ms actualizamos el <b> con getTimerLeft (no hay timer real, es solo efecto visual).
        timerInterval = setInterval(() => {
          const content = Swal.getHtmlContainer();
          if (content) {
            const b = content.querySelector("b");
            if (b) {
              b.textContent = Swal.getTimerLeft()?.toString() ?? "0";
            }
          }
        }, 100);

        // 2. Hacer fetch al endpoint
        try {
          const res = await fetch(`${BASE_URL}/consulta/competencia/etapa-info-general`);
          if (!res.ok) {
            throw new Error("Fallo al consultar la etapa activa");
          }
          const json = await res.json();

          // 3. Si json.etapaInfo === null → no hay etapa activa
          if (json.etapaInfo === null) {
            clearInterval(timerInterval);
            Swal.close();
            await Swal.fire({
              icon: "info",
              title: "Sin competencia activa",
              text: "No hay ninguna competencia con etapas vigentes en este momento.",
              confirmButtonText: "Aceptar",
            });
            return;
          }

          // 4. Si json.etapaActiva existe → hay una etapa activa
          const etapaActiva = json.etapaActiva;
          const competenciaNombre = json.competenciaNombre;
          const pagoEtapa = json.pagoEtapa;

          // 5. Comprobar si la etapa activa es “Pago de Inscripciones”
          if (etapaActiva.nombreEtapa === "Pago de Inscripciones") {
            clearInterval(timerInterval);
            Swal.close();
            return;
          }

          // 6. Si la etapa activa NO es “Pago de Inscripciones”, preparamos mensaje
          let mensaje = `Actualmente estamos en la etapa:\n
   → "${etapaActiva.nombreEtapa}"\n
de la competencia: "${competenciaNombre}".\n\n`;

          if (pagoEtapa) {
            mensaje += `La etapa de Pago de Inscripciones se habilitará el:\n
   → ${pagoEtapa.fechaInicio} a las ${pagoEtapa.horaInicio} (UTC).`;
          } else {
            mensaje += "La etapa de Pago de Inscripciones no está configurada en el sistema.";
          }

          clearInterval(timerInterval);
          Swal.close();
          await Swal.fire({
            icon: "info",
            title: "Acceso Restringido",
            html: `<pre style="white-space: pre-wrap; text-align: left;">${mensaje}</pre>`,
            confirmButtonText: "Aceptar",
          });
        } catch (error: any) {
          console.error("Error validando etapa de pago:", error);
          clearInterval(timerInterval);
          Swal.close();
          await Swal.fire({
            icon: "error",
            title: "Error interno",
            text: error.message || "No se pudo validar la etapa actual. Intenta más tarde.",
            confirmButtonText: "Aceptar",
          });
        }
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    });

    // 7. Tras cerrar el primer modal, volvemos a consultar para devolver true/false…
    //    Esto es necesario porque no podemos retornar directamente desde didOpen.
    try {
      const finalRes = await fetch(`${BASE_URL}/consulta/competencia/etapa-info-general`);
      if (!finalRes.ok) {
        return false;
      }
      const finalJson = await finalRes.json();
      // Si no hay etapa activa, devolvemos false
      if (finalJson.etapaInfo === null) {
        return false;
      }
      // Si sí hay etapaActiva, comprobamos nombreEtapa
      if (finalJson.etapaActiva.nombreEtapa === "Pago de Inscripciones") {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  const handlePagosPendientes = async () => {
    const ok = await checkPago();
    if (ok) {
      router.push("/cajero/pendientes");
    }
  };

  const handleHistorialPagos = async () => {
    const ok = await checkPago();
    if (ok) {
      router.push("/cajero/historial");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      {/* Imagen de encabezado */}
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

      {/* Opciones del cajero */}
      <section className="bg-gray-200 py-10 px-4 flex flex-col md:flex-row justify-center gap-8 flex-wrap">
        {/* Botón Pagos pendientes */}
        <button
          onClick={handlePagosPendientes}
          className="bg-[#B4B9C5] rounded-xl p-6 max-w-[220px] flex flex-col items-center shadow 
                     cursor-pointer hover:bg-bright-gray-400 
                     hover:shadow-md text-center  transition-all transform hover:scale-105 active:scale-95"
        >
          <div className="text-6xl mb-4 text-gray-800">
            <FaMoneyCheckAlt size={70} />
          </div>
          <p className="font-semibold text-gray-800">Pagos pendientes</p>
        </button>

        {/* Botón Historial de pagos */}
        <button
          onClick={handleHistorialPagos}
          className="bg-[#B4B9C5] rounded-xl p-6 max-w-[220px] flex flex-col items-center shadow 
                     cursor-pointer hover:bg-bright-gray-400 
                     hover:shadow-md text-center  transition-all transform hover:scale-105 active:scale-95"
        >
          <div className="text-6xl mb-4 text-gray-800">
            <FaHistory size={70} />
          </div>
          <p className="font-semibold text-gray-800">Historial de pagos</p>
        </button>
      </section>
    </main>
  );
}
