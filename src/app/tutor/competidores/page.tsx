import ParticipantesAsignados from '@/components/Tutor/ParticipantesAsignados';


export default function ParticipantesPage() {

  // In a real app, you'd get this ID from a session or URL parameter
  const tutorId = "7";

  return (
    <div className="container mx-auto px-4 py-8">
      <ParticipantesAsignados tutorId={tutorId} />
    </div>
  );
}