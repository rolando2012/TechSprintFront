import { useState, useEffect } from 'react';
import { getCategoriesForArea } from '@/lib/data';

// Define la forma de una categoría
interface Category {
  id: string;
  grade: string;
  level: string;
  price: number;
}

// Define la estructura de los datos que contiene las categorías
interface Categories {
  primary: Category[];
  secondary: Category[];
}

interface CategorySelectorProps {
  area: string;
  onInscription: (level: string, category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ area, onInscription }) => {
  // Usa el tipo Categories en lugar de any
  const [categories, setCategories] = useState<Categories>({
    primary: [],
    secondary: []
  });

  useEffect(() => {
    // Fetch categories based on the selected area
    const fetchedCategories = getCategoriesForArea(area);
    setCategories(fetchedCategories);
  }, [area]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Sección Primaria */}
      {categories.primary.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-md">
          <div className="bg-gray-200 p-4 rounded-t-md">
            <h2 className="text-lg font-semibold text-gray-700">Primaria</h2>
            <p className="text-sm text-gray-600">Categoría</p>
          </div>
          <div className="divide-y">
            {categories.primary.map((category: Category) => (
              <div key={category.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">{category.grade}</p>
                  <span className="inline-block bg-gray-200 px-4 py-1 rounded-full text-sm">
                    {category.level}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-800">Bs {category.price}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 flex justify-center">
            <button
              onClick={() => onInscription('Primaria', area)}
              type='button'
              className="bg-boton hover:bg-boton-hover text-white px-6 py-2 rounded-md transition"
            >
              Inscribirse
            </button>
          </div>
        </div>
      )}

      {/* Sección Secundaria */}
      {categories.secondary.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-md">
          <div className="bg-gray-200 p-4 rounded-t-md">
            <h2 className="text-lg font-semibold text-gray-700">Secundaria</h2>
            <p className="text-sm text-gray-600">Categoría</p>
          </div>
          <div className="divide-y">
            {categories.secondary.map((category: Category) => (
              <div key={category.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">{category.grade}</p>
                  <span className="inline-block bg-gray-200 px-4 py-1 rounded-full text-sm">
                    {category.level}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-800">Bs {category.price}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 flex justify-center">
            <button
              onClick={() => onInscription('Secundaria', area)}
              type='button'
              className="bg-boton hover:bg-boton-hover text-white px-6 py-2 rounded-md transition"
            >
              Inscribirse
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
