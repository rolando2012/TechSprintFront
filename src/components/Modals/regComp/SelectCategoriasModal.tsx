'use client'

import { useState } from 'react'

interface Props {
  selected: string[]
  onConfirm: (values: string[]) => void
  onClose: () => void
}

const CATEGORIAS: Record<string, string[]> = {
  INFORMATICA: ['guacamayo', 'guanaco', 'londra', 'jucumari', 'bufeo', 'puma'],
  ROBOTICA: ['builders P', 'builders S', 'Lego P', 'Lego S'],
}

export default function SelectCategoriasModal({ selected, onConfirm, onClose }: Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(selected)

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-xl">
        <h2 className="text-xl font-bold mb-6 text-center">Categorias</h2>

        <div className="space-y-6">
          {Object.entries(CATEGORIAS).map(([area, categorias]) => (
            <div key={area}>
              <h3 className="font-bold text-gray-800 mb-2 uppercase">{area}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-100 p-4 rounded-lg">
                {categorias.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 text-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="accent-blue-500"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between gap-4 mt-8">
          <button
            onClick={() => onConfirm(selectedCategories)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full w-full"
          >
            Aceptar
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full w-full"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
