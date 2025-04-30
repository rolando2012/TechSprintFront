import "../globals.css";
import TablaParticipantes from "./TablaParticipantes";
import Link from "next/link";
export default function ParticipantesAsignados() {
  return (
    <div className="flex flex-col min-h-screen bg-[#2C3E50]">
      {/* Menú */}
      <div className="bg-gray-800 flex justify-center gap-8 py-2">
        <Link href="/registro/tutor" className="text-white font-semibold hover:text-gray-300">Inicio</Link>
        <Link href="/registro/tutor/participantes_asignados" className="text-white font-semibold hover:text-gray-300">Participantes asignados</Link>
        <Link href="#" className="text-white font-semibold hover:text-gray-300">Validar inscripciones</Link>
        <Link href="#" className="text-white font-semibold hover:text-gray-300">Proceso de inscripciones</Link>
      </div>
      
      <h1>Participantes Asignados</h1>
      <TablaParticipantes />
    </div>
  );
}
