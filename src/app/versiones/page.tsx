// app/evento/page.tsx
import { Metadata } from "next";

// Defino las fechas de las etapas directamente aquí (puedes importarlas de un lib.ts común)
const EVENT_START_PRELAUNCH = new Date("2025-06-01T00:00:00Z");
const EVENT_END_PRELAUNCH   = new Date("2025-06-10T23:59:59Z");
const EVENT_START_LIVE      = new Date("2025-06-11T00:00:00Z");
const EVENT_END_LIVE        = new Date("2025-06-20T23:59:59Z");
const EVENT_START_CLOSED    = new Date("2025-06-21T00:00:00Z");
const EVENT_END_CLOSED      = new Date("2025-06-30T23:59:59Z");

/**
 * Podemos también definir metadata dinámicamente, por ejemplo para SEO.
 */
export const metadata: Metadata = {
  title: "Evento Especial",
  description: "Página del evento, disponible solo en fechas específicas",
};

export default async function EventoPage() {
  const now = new Date();

  // Determinamos la etapa
  let stageKey: "PRE_LAUNCH" | "LIVE" | "CLOSED";
  let message: string;

  if (now >= EVENT_START_PRELAUNCH && now <= EVENT_END_PRELAUNCH) {
    stageKey = "PRE_LAUNCH";
    message = "La página aún no está disponible. ¡Vuelve pronto!";
  } else if (now >= EVENT_START_LIVE && now <= EVENT_END_LIVE) {
    stageKey = "LIVE";
    message = "";
  } else if (now >= EVENT_START_CLOSED && now <= EVENT_END_CLOSED) {
    stageKey = "CLOSED";
    message = "El evento ha finalizado. Gracias por tu interés.";
  } else {
    // Fuera de todas las etapas definidas
    stageKey = "PRE_LAUNCH";
    message = "Este contenido no está disponible en este momento.";
  }

  // Si no estamos en “LIVE”, devolvemos el mensaje (Server Component).
  if (stageKey !== "LIVE") {
    return (
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "1rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          🚫 Acceso Restringido
        </h1>
        <p style={{ fontSize: "1.2rem", textAlign: "center" }}>{message}</p>
      </main>
    );
  }

  // Si sí es “LIVE”, devolvemos el contenido normal:
  return (
    <main style={{ padding: "2rem" }}>
      <h1>🎉 ¡Bienvenido al Evento en Vivo!</h1>
      <p>
        Aquí va todo el contenido que solo se ve durante el rango de fechas
        activas.
      </p>
      {/* … resto de tu UI del evento … */}
    </main>
  );
}
