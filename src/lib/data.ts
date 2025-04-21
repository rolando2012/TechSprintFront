// This file simulates a database or API service
// In a real app, you would fetch this data from a backend

export interface Category {
    id: string;
    grade: string;
    level: string;
    price: number;
  }
  
  interface Categories {
    primary: Category[];
    secondary: Category[];
  }
  
  // Data based on the images provided
  export const getCategoriesForArea = (area: string): Categories => {
    switch (area.toLowerCase()) {
      case 'informatica':
        return {
          primary: [
            { id: 'pri-5-info', grade: '5to Primaria', level: 'Guacamayo', price: 20 },
            { id: 'pri-6-info', grade: '6to Primaria', level: 'Guacamayo', price: 25 }
          ],
          secondary: [
            { id: 'sec-1-info', grade: '1ro Secundaria', level: 'Guanaco', price: 30 },
            { id: 'sec-2-info', grade: '2do Secundaria', level: 'Londra', price: 35 },
            { id: 'sec-3-info', grade: '3ro Secundaria', level: 'Jucumari', price: 40 },
            { id: 'sec-4-info', grade: '4to Secundaria', level: 'Bufeo', price: 45 },
            { id: 'sec-5-info', grade: '5to Secundaria', level: 'Puma', price: 50 }
          ]
        };
      case 'astronomia':
        return {
          primary: [
            { id: 'pri-3-astro', grade: '3ro Primaria', level: '3P', price: 20 },
            { id: 'pri-4-astro', grade: '4to Primaria', level: '4P', price: 25 },
            { id: 'pri-5-astro', grade: '5to Primaria', level: '5P', price: 30 },
            { id: 'pri-6-astro', grade: '6to Primaria', level: '6P', price: 35 }
          ],
          secondary: [
            { id: 'sec-1-astro', grade: '1ro Secundaria', level: '1S', price: 40 },
            { id: 'sec-2-astro', grade: '2do Secundaria', level: '2S', price: 45 },
            { id: 'sec-3-astro', grade: '3ro Secundaria', level: '3S', price: 50 },
            { id: 'sec-4-astro', grade: '4to Secundaria', level: '4S', price: 55 },
            { id: 'sec-5-astro', grade: '5to Secundaria', level: '5S', price: 60 },
            { id: 'sec-6-astro', grade: '6to Secundaria', level: '6S', price: 65 }
          ]
        };
      case 'robotica':
        return {
          primary: [
            { id: 'pri-5-6-robo-1', grade: '5to a 6to Primaria', level: 'Builders P', price: 40 },
            { id: 'pri-5-6-robo-2', grade: '5to a 6to Primaria', level: 'Lego P', price: 45 }
          ],
          secondary: [
            { id: 'sec-1-3-robo', grade: '1ro a 3ro Secundaria', level: 'Lego S', price: 50 }
          ]
        };
      case 'biologia':
        return {
          primary: [],
          secondary: [
            { id: 'sec-2-bio', grade: '2do Secundaria', level: '2S', price: 30 },
            { id: 'sec-3-bio', grade: '3ro Secundaria', level: '3S', price: 35 },
            { id: 'sec-4-bio', grade: '4to Secundaria', level: '4S', price: 40 },
            { id: 'sec-5-bio', grade: '5to Secundaria', level: '5S', price: 45 },
            { id: 'sec-6-bio', grade: '6to Secundaria', level: '6S', price: 50 }
          ]
        };
      case 'fisica':
        return {
          primary: [],
          secondary: [
            { id: 'sec-4-fis', grade: '4to Secundaria', level: '4S', price: 35 },
            { id: 'sec-5-fis', grade: '5to Secundaria', level: '5S', price: 40 },
            { id: 'sec-6-fis', grade: '6to Secundaria', level: '6S', price: 45 }
          ]
        };
      case 'matematicas':
        return {
          primary: [
            { id: 'pri-1-mat', grade: '1ro Primaria', level: 'Primer Nivel', price: 20 }
          ],
          secondary: [
            { id: 'sec-2-mat', grade: '2do Secundaria', level: 'Segundo Nivel', price: 30 },
            { id: 'sec-3-mat', grade: '3ro Secundaria', level: 'Tercer Nivel', price: 35 },
            { id: 'sec-4-mat', grade: '4to Secundaria', level: 'Cuarto Nivel', price: 40 },
            { id: 'sec-5-mat', grade: '5to Secundaria', level: 'Quinto Nivel', price: 45 },
            { id: 'sec-6-mat', grade: '6to Secundaria', level: 'Sexto Nivel', price: 50 }
          ]
        };
      case 'quimica':
        return {
          primary: [],
          secondary: [
            { id: 'sec-2-qui', grade: '2do Secundaria', level: '2S', price: 30 },
            { id: 'sec-3-qui', grade: '3ro Secundaria', level: '3S', price: 35 },
            { id: 'sec-4-qui', grade: '4to Secundaria', level: '4S', price: 40 },
            { id: 'sec-5-qui', grade: '5to Secundaria', level: '5S', price: 45 },
            { id: 'sec-6-qui', grade: '6to Secundaria', level: '6S', price: 50 }
          ]
        };
      default:
        return {
          primary: [],
          secondary: []
        };
    }
  };