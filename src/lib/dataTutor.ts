export interface Tutor {
  id: string;
  nombre: string;
  especialidad: string;
  areas: string[];
}

export const tutors: Tutor[] = [
  {
    id: "t1",
    nombre: "Prof. Carlos Mendez",
    especialidad: "Matemáticas Avanzadas",
    areas: ["Robotica"]
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
  },
 {
   id: "t5",
   nombre: "Ing. Diana Torres",
   especialidad: "Ingeniería en Informática",
   areas: ["Informatica"]
 },
 {
   id: "t6",
   nombre: "Lic. Mario Vargas",
   especialidad: "Biología Molecular",
   areas: ["Biologia"]
 },
];
