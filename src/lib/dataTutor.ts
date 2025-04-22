// data/dataTutor.ts

export interface Student {
    id: string;
    nombre: string;
    grado: string;
    area: string;
  }
  
  export interface Tutor {
    id: string;
    nombre: string;
    especialidad: string;
    areas: string[];
  }
  
  export const students: Student[] = [
    {
      id: "1",
      nombre: "Denilson Luna",
      grado: "5to Secundaria",
      area: "Matematicas"
    },
    {
      id: "2",
      nombre: "Maria Gonzalez",
      grado: "4to Secundaria",
      area: "Ciencias"
    },
    {
      id: "3",
      nombre: "Juan Rodriguez",
      grado: "3ro Secundaria",
      area: "Literatura"
    }
  ];
  
  export const tutors: Tutor[] = [
    {
      id: "t1",
      nombre: "Prof. Carlos Mendez",
      especialidad: "Matemáticas Avanzadas",
      areas: ["Matematicas"]
    },
    {
      id: "t2",
      nombre: "Dra. Ana Martinez",
      especialidad: "Algebra y Geometría",
      areas: ["Matematicas"]
    },
    {
      id: "t3",
      nombre: "Lic. Roberto Sanchez",
      especialidad: "Física y Química",
      areas: ["Ciencias", "Matematicas"]
    },
    {
      id: "t4",
      nombre: "Prof. Laura Jimenez",
      especialidad: "Literatura Hispánica",
      areas: ["Literatura"]
    }
  ];