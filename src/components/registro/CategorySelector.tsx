import React, { useState, useEffect } from 'react';
import { getCategoriesArea, Category as ApiCategory, AreaCategories } from '@/lib/api/registro';
import Swal from 'sweetalert2';
import { useRegistro } from '@/app/registro/competidor/context';

// Define la forma de una categoría local
type Category = {
  id: string;
  grade: string;
  level: string;
  price: number;
  codNivel: number;
};

// Estructura de categorías en el componente
interface Categories {
  primary: Category[];
  secondary: Category[];
}

interface CategorySelectorProps {
  area: string;  // codArea como string, se convertirá a number al llamar la API
  onInscription: (insc: { area: string; categoria: 'Primaria' | 'Secundaria'; nivel: string }) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ area, onInscription }) => {
  const { personalData } = useRegistro();
  const [categories, setCategories] = useState<Categories>({
    primary: [],
    secondary: [],
  });

  useEffect(() => {
    if (!area) {
      setCategories({ primary: [], secondary: [] });
      return;
    }
  
    const fetchCategories = async () => {
      try {
        const data: AreaCategories = await getCategoriesArea(area);
  
        // para primaria:
        const primary = data.primary.map((c: ApiCategory) => ({
          id:   (c.codGrado  ?? c.codNivel)!.toString(),
          grade: c.rango ?? c.grade,
          level: c.level,
          price: c.price,
          // Asegúrate de rellenar codNivel:
          codNivel: c.codGrado ?? c.codNivel!
        }));
  
        // para secundaria:
        const secondary = data.secondary.map((c: ApiCategory) => ({
          id:   (c.codGrado  ?? c.codNivel)!.toString(),
          grade: c.rango ?? c.grade,
          level: c.level,
          price: c.price,
          codNivel: c.codGrado ?? c.codNivel!
        }));
  
        setCategories({ primary, secondary });
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories({ primary: [], secondary: [] });
      }
    };
  
    fetchCategories();
  }, [area]);
  
  
  const handleClick = (categoria: 'Primaria' | 'Secundaria', nivel: string) => {
    if (personalData.grado !== categoria) {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso denegado',
        text: `Los estudiantes de ${personalData.grado.toLowerCase()} no pueden inscribirse en competencias de ${categoria.toLowerCase()}.`,

        confirmButtonColor: '#00abe4',
      });
      return;
    }

    onInscription({area, categoria, nivel});
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* PRIMARIA */}
      {categories.primary.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-md">
        <div className="bg-gray-200 p-4 rounded-t-md">
          <h2 className="text-xl font-thin text-gray-700">Primaria</h2>
          <p className="text-sm text-gray-600">Categoría</p>
        </div>
          <div className="divide-y">
            {categories.primary.map(cat => (
              <div key={cat.codNivel} className="p-4 flex justify-between items-center">
                <div>
                  <p>{cat.grade}</p>
                  <span className="px-2 py-1 rounded-full">{cat.level}</span>
                </div>
                <button
                  type='button'
                  onClick={() => handleClick('Primaria', cat.level)}
                  className="bg-boton hover:bg-boton-hover text-white px-6 py-2 rounded-md transition"
                >
                  Inscribirse
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECUNDARIA */}
      {categories.secondary.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-md">
          <div className="bg-gray-200 p-4 rounded-t-md">
            <h2 className="text-xl font-thin text-gray-700">Secundaria</h2>
            <p className="text-sm text-gray-600">Categoría</p>
          </div>
          <div className="divide-y">
            {categories.secondary.map(cat => (
              <div key={cat.codNivel} className="p-4 flex justify-between items-center">
                <div>
                  <p>{cat.grade}</p>
                  <span className="px-2 py-1 rounded-full">{cat.level}</span>
                </div>
                <button
                  type='button'
                  onClick={() => handleClick('Secundaria', cat.level)}
                  className="bg-boton hover:bg-boton-hover text-white px-6 py-2 rounded-md transition"
                >
                  Inscribirse
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
