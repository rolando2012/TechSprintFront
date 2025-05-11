'use client'

import { useState } from 'react'

interface Props {
  areas: string[]
  selected: string[]
  onConfirm: (values: string[]) => void
  onClose: () => void
}

const CATEGORIAS: Record<string, string[]> = {
  Informática: ['Guacamayo', 'Guanaco', 'Londra', 'Jucumari', 'Bufeo', 'Puma'],
  Robótica: ['Builders P', 'Builders S', 'Lego P', 'Lego S'],
}

export default function SelectCategoriasModal({
  areas,
  selected,
  onConfirm,
  onClose,
}: Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(selected)

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  // Filtrar solo las áreas habilitadas
  const enabledEntries = Object.entries(CATEGORIAS).filter(([areaName]) =>
    areas.includes(areaName)
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col">
        <h2 className="text-xl font-bold p-6 text-center">Categorías</h2>

        {/* Contenido con scroll o mensaje vacío */}
        <div className="px-6 overflow-y-auto flex-1 mb-4" style={{ maxHeight: '50vh' }}>
          {enabledEntries.length === 0 ? (
            <p className="text-center text-gray-600">
              Debes seleccionar un área de <strong>Informática</strong> o <strong>Robótica</strong> para ver las categorías.
            </p>
          ) : (
            enabledEntries.map(([areaName, categoriesList]) => (
              <div key={areaName} className="mb-6">
                <h3 className="text-gray-800 mb-2 uppercase">{areaName}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-100 p-4 rounded-lg">
                  {categoriesList.map(cat => (
                    <label
                      key={cat}
                      className="flex items-center gap-2 text-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="accent-boton"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Botones siempre visibles */}
        <div className="flex gap-4 p-6 border-t">
          <button
            onClick={() => onConfirm(selectedCategories)}
            className="bg-boton hover:bg-boton-hover text-white py-2 px-6 rounded-full flex-1"
          >
            Aceptar
          </button>
          <button
            onClick={onClose}
            className="bg-boton-2 hover:bg-boton-2-hover text-white py-2 px-6 rounded-full flex-1"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
