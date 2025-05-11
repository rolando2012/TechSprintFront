'use client'

import { useState } from 'react'
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa'

type Props = {
  areas: string[]
  selected: string[]
  onConfirm: (values: string[]) => void
  onClose: () => void
}

const NIVELES: Record<string, string[]> = {
  'Astronomía - astrofísica': [
    '3P','4P','5P','6P',
    '1ro Secundaria','2do Secundaria','3ro Secundaria','4to Secundaria','5to Secundaria','6to Secundaria'
  ],
  Biología: ['2do Secundaria','3ro Secundaria','4to Secundaria','5to Secundaria','6to Secundaria'],
  Física: ['4to Secundaria','5to Secundaria','6to Secundaria'],
  Matemáticas: ['1ro Secundaria','2do Secundaria','3ro Secundaria','4to Secundaria','5to Secundaria','6to Secundaria'],
  Química: ['2do Secundaria','3ro Secundaria','4to Secundaria','5to Secundaria','6to Secundaria']
}

export default function SelectNivelesModal({ areas, selected, onConfirm, onClose }: Props) {
  const [selectedNiveles, setSelectedNiveles] = useState<string[]>(selected)

  const toggleNivel = (key: string, enabled: boolean) => {
    if (!enabled) return
    setSelectedNiveles(prev =>
      prev.includes(key) ? prev.filter(n => n !== key) : [...prev, key]
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col">
        <h2 className="text-2xl font-bold p-6 text-center">Niveles</h2>

        {/* Contenido con scroll */}
        <div className="px-6 overflow-y-auto flex-1 space-y-6 mb-4" style={{ maxHeight: '60vh' }}>
          {Object.entries(NIVELES).map(([area, niveles]) => {
            const enabled = areas.includes(area)
            return (
              <div key={area}>
                <h3 className={`font-bold mb-2 ${enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                  {area}
                </h3>
                <div className="flex flex-wrap gap-4 bg-gray-100 p-2 rounded-md">
                  {niveles.map(nivel => {
                    const key = `${area}-${nivel}`
                    const checked = selectedNiveles.includes(key)
                    return (
                      <label
                        key={key}
                        className={`flex items-center gap-2 text-sm font-medium ${
                          enabled ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
                        }`}
                        onClick={() => toggleNivel(key, enabled)}
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

        {/* Botones siempre al fondo */}
        <div className="flex gap-4 p-6 border-t">
          <button
            onClick={() => onConfirm(selectedNiveles)}
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
