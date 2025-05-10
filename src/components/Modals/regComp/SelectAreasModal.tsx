'use client'

import { useState } from 'react'
import { FaCheckSquare, FaRegSquare } from 'react-icons/fa'

type Props = {
    selected: string[]
    onConfirm: (values: string[]) => void
    onClose: () => void
  }

const AREAS = [
  'Astronomía - astrofísica',
  'Biología',
  'Física',
  'Informática',
  'Matemáticas',
  'Química',
  'Robótica'
]

export default function SelectAreasModal({ selected, onConfirm, onClose }: Props) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>(selected)

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-xl relative">
        <h2 className="text-2xl font-bold mb-6 text-center">Selecciona las áreas</h2>

        <div className="space-y-3 mb-6">
          {AREAS.map((area) => (
            <div
              key={area}
              className="flex items-center justify-between px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
              onClick={() => toggleArea(area)}
            >
              <span className=" text-gray-800">{area}</span>
              <span className="text-2xl text-boton">
                {selectedAreas.includes(area) ? <FaCheckSquare /> : <FaRegSquare />}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={() => onConfirm(selectedAreas)}
            className="bg-boton hover:bg-boton-hover text-white  py-2 px-6 rounded-full w-full"
          >
            Aceptar
          </button>
          <button
            onClick={onClose}
            className="bg-boton-2 hover:bg-boton-2-hover text-white  py-2 px-6 rounded-full w-full"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
