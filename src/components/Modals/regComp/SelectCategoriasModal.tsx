'use client'

import { useState, useEffect } from 'react'

interface Props {
  selected: string[]            // Categorías ya seleccionadas
  onConfirm: (values: string[]) => void
  onClose: () => void
}

type CategoriaAPI = {
  nombreArea: string
  nivelesEspeciales: Array<{ nombreNivel: string; gradoRange: string }>
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SelectCategoriasModal({
  selected,
  onConfirm,
  onClose,
}: Props) {
  const [data, setData] = useState<CategoriaAPI[] | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(selected)

  useEffect(() => {
    fetch(`${BASE_URL}/administrador/niveles`)
      .then(res => res.json())
      .then((json: CategoriaAPI[]) => setData(json))
      .catch(console.error)
  }, [])

  const toggleCategory = (catKey: string) => {
    setSelectedCategories(prev =>
      prev.includes(catKey) ? prev.filter(c => c !== catKey) : [...prev, catKey]
    )
  }

  if (!data) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-6">Cargando categorías...</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col">
        {/* Header */}
        <h2 className="text-xl font-bold p-6 text-center">Selecciona Categorías</h2>

        {/* Body con scroll */}
        <div
          className="px-6 overflow-y-auto flex-1 space-y-6"
          style={{ maxHeight: '50vh' }}
        >
          {data.map(areaObj => (
            <div key={areaObj.nombreArea} className="mb-6">
              <h3 className="text-gray-800 mb-2 uppercase">{areaObj.nombreArea}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-100 p-4 rounded-lg">
                {areaObj.nivelesEspeciales.map(nivel => {
                  const catKey = `${areaObj.nombreArea}-${nivel.nombreNivel}`
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
                      <div className="flex flex-col">
                        <span>{nivel.nombreNivel}</span>
                        <small className="text-xs text-gray-500">{nivel.gradoRange}</small>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
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