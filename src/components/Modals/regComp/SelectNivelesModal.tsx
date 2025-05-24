'use client'

import { useState, useEffect } from 'react'
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa'

interface Props {
  selected: string[]
  onConfirm: (values: string[]) => void
  onClose: () => void
}
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type GradoAPI = {
  nombreArea: string
  areaGrado: Array<{ grado: { numero: number; ciclo: 'Primaria' | 'Secundaria' } }>
}

export default function SelectNivelesModal({
  selected,
  onConfirm,
  onClose,
}: Props) {
  const [data, setData] = useState<GradoAPI[] | null>(null)
  const [selectedNiveles, setSelectedNiveles] = useState<string[]>(selected)

  useEffect(() => {
    fetch(`${BASE_URL}/administrador/grados`)
      .then(res => res.json())
      .then((json: GradoAPI[]) => setData(json))
      .catch(console.error)
  }, [])

  const toggleNivel = (key: string) => {
    setSelectedNiveles(prev =>
      prev.includes(key) ? prev.filter(n => n !== key) : [...prev, key]
    )
  }

  if (!data) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-6">Cargando niveles...</div>
      </div>
    )
  }

  // Helper: convertir grado numérico + ciclo en etiqueta (e.g. '3P', '1S')
  const labelFor = (numero: number, ciclo: string) =>
    `${numero}${ciclo === 'Primaria' ? 'P' : 'S'}`

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col">
        {/* Header */}
        <h2 className="text-2xl font-bold p-6 text-center">Selecciona Niveles</h2>

        {/* Body con scroll */}
        <div
          className="px-6 overflow-y-auto flex-1 space-y-6"
          style={{ maxHeight: '60vh' }}
        >
          {data.map(areaObj => {
            const area = areaObj.nombreArea
            return (
              <div key={area}>
                <h3 className="font-bold mb-2 text-gray-900">{area}</h3>
                <div className="flex flex-wrap gap-4 bg-gray-100 p-2 rounded-md">
                  {areaObj.areaGrado.map(({ grado }) => {
                    const nivel = labelFor(grado.numero, grado.ciclo)
                    const key = `${area}-${nivel}`
                    const checked = selectedNiveles.includes(key)
                    return (
                      <label
                        key={key}
                        className="flex items-center gap-2 text-sm font-medium cursor-pointer"
                        onClick={() => toggleNivel(key)}
                      >
                        {checked ? <FaCheckSquare /> : <FaRegSquare />}
                        <span>{nivel}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-6 border-t">
          <button
            type="button"
            onClick={() => onConfirm(selectedNiveles)}
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