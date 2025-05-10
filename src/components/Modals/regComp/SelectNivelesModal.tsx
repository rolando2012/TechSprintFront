'use client'

import { useState } from 'react'
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa'

type Props = {
  selected: string[]
  onConfirm: (values: string[]) => void
  onClose: () => void
}

const NIVELES: Record<string, string[]> = {
  'ASTRONOMIA - ASTROFISICA': [
    '3 P', '4 P', '5 P', '6 P',
    '1 sec', '2 sec', '3 sec', '4 sec', '5 sec', '6 sec'
  ],
  'BIOLOGIA': ['2 sec', '3 sec', '4 sec', '5 sec', '6 sec'],
  'FISICA': ['4 sec', '5 sec', '6 sec'],
  'MATEMATICAS': ['1 sec', '2 sec', '3 sec', '4 sec', '5 sec', '6 sec'],
  'QUIMICA': ['2 sec', '3 sec', '4 sec', '5 sec', '6 sec']
}

export default function SelectNivelesModal({ selected, onConfirm, onClose }: Props) {
  const [selectedNiveles, setSelectedNiveles] = useState<string[]>(selected)

  const toggleNivel = (nivel: string) => {
    setSelectedNiveles((prev) =>
      prev.includes(nivel) ? prev.filter((n) => n !== nivel) : [...prev, nivel]
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-xl relative">
        <h2 className="text-2xl font-bold mb-6 text-center">Niveles</h2>

        <div className="space-y-6 mb-6">
          {Object.entries(NIVELES).map(([area, niveles]) => (
            <div key={area}>
              <h3 className="font-bold text-gray-900 mb-2">{area}</h3>
              <div className="flex flex-wrap gap-4 bg-gray-100 p-2 rounded-md">
                {niveles.map((nivel) => (
                  <label
                    key={nivel}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => toggleNivel(`${area}-${nivel}`)}
                  >
                    <span className="text-xl text-blue-500">
                      {selectedNiveles.includes(`${area}-${nivel}`) ? <FaCheckSquare /> : <FaRegSquare />}
                    </span>
                    <span className="text-sm font-medium">{nivel}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={() => onConfirm(selectedNiveles)}
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
