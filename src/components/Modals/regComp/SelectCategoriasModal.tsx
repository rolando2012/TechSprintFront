// components/Modals/regComp/SelectCategoriasModal.tsx
'use client'

import { useState } from 'react'

interface Props {
  areas: string[]               // Áreas seleccionadas en page.tsx
  selected: string[]            // Categorías ya seleccionadas
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

  const toggleCategory = (catKey: string) => {
    setSelectedCategories(prev =>
      prev.includes(catKey) ? prev.filter(c => c !== catKey) : [...prev, catKey]
    )
  }

  // Filtrar solo las áreas habilitadas
  const enabledEntries = Object.entries(CATEGORIAS).filter(
    ([areaName]) => areas.includes(areaName)
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col">
        {/* Header */}
        <h2 className="text-xl font-bold p-6 text-center">Selecciona Categorías</h2>

        {/* Body con scroll o mensaje */}
        <div
          className="px-6 overflow-y-auto flex-1"
          style={{ maxHeight: '50vh' }}
        >
          {enabledEntries.length === 0 ? (
            <p className="text-center text-gray-600">
              Debes seleccionar un área de <strong>Informática</strong> o <strong>Robótica</strong> para ver las categorías.
            </p>
          ) : (
            enabledEntries.map(([areaName, categoriesList]) => (
              <div key={areaName} className="mb-6">
                <h3 className="text-gray-800 mb-2 uppercase">{areaName}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-100 p-4 rounded-lg">
                  {categoriesList.map(cat => {
                    const catKey = `${areaName}-${cat}`
                    const checked = selectedCategories.includes(catKey)
                    return (
                      <label
                        key={catKey}
                        className="flex items-center gap-2 text-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCategory(catKey)}
                          className="accent-boton"
                        />
                        <span>{cat}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-6 border-t">
          <button
            type="button"
            onClick={() => onConfirm(selectedCategories)}
            className="bg-boton hover:bg-boton-hover text-white py-2 px-6 rounded-full flex-1"
          >
            Aceptar
          </button>
          <button
            type="button"
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
