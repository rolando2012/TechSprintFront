import React, { useState } from 'react';
import { tutors, students } from '@/lib/dataTutor';

interface TutorAssignmentProps {
  studentId: string;
}

const TutorAssignment: React.FC<TutorAssignmentProps> = ({ studentId }) => {
  const [selectedTutor, setSelectedTutor] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // Find the current student based on the provided ID
  const student = students.find(s => s.id === studentId);
  
  if (!student) {
    return <div className="p-4 text-red-600">Estudiante no encontrado</div>;
  }
  
  // Filter tutors by the student's subject area
  const availableTutors = tutors.filter(tutor => 
    tutor.areas.includes(student.area)
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!selectedTutor) {
      setError('Por favor seleccione un tutor antes de enviar');
      return;
    }
    
    // Here you would typically save the assignment to a database
    // For demo purposes, we'll just show a success message
    setSuccess(`Tutor asignado correctamente a ${student.nombre}`);
    
    // Reset form after successful submission
    // setSelectedTutor(''); // Uncomment if you want to reset the selection
  };
  
  return (
    <div className="min-h-screen w-full md:max-w-4xl lg:max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Asignación de tutor o tutores</h2>
      <p className="text-gray-600 mb-6">Seleccione tutor para su área respectiva</p>
      
      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-t border-gray-200">
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Nombre completo</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Grado</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Area(s) de competencia</th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Tutor asignado</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-4">{student.nombre}</td>
                <td className="py-3 px-4">{student.grado}</td>
                <td className="py-3 px-4">{student.area}</td>
                <td className="py-3 px-4">
                  <div className="relative">
                    <select
                      value={selectedTutor}
                      onChange={(e) => setSelectedTutor(e.target.value)}
                      className="appearance-none border rounded-md py-2 px-3 pr-8 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Selecciona tutor"
                    >
                      <option value="">Selecciona tutor</option>
                      {availableTutors.map((tutor) => (
                        <option key={tutor.id} value={tutor.id}>
                          {tutor.nombre}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Asignar Tutor
          </button>
        </div>
      </form>
    </div>
  );
};

export default TutorAssignment;