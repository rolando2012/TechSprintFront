'use client'

import { useState } from 'react'
import { FaFlask, FaChartBar, FaLayerGroup, FaDollarSign, FaBars, FaCheck } from 'react-icons/fa'
import SelectAreasModal from '@/components/Modals/regComp/SelectAreasModal'
import SelectNivelesModal from '@/components/Modals/regComp/SelectNivelesModal'
import SelectCategoriasModal from '@/components/Modals/regComp/SelectCategoriasModal'

export default function DatosCompetenciaPage() {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [selectedNiveles, setSelectedNiveles] = useState<string[]>([])
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([])
  const [costo, setCosto] = useState('')
  const [costoConfirmado, setCostoConfirmado] = useState('')

  const [showAreaModal, setShowAreaModal] = useState(false)
  const [showNivelModal, setShowNivelModal] = useState(false)
  const [showCategoriaModal, setShowCategoriaModal] = useState(false)

  const campos = [
    'Nombre y Apellidos',
    'Documento de Identidad',
    'Fecha De Nacimiento',
    'Correo Electrónico',
    'Teléfono de contacto',
    'Areas Seleccionadas',
    'Tutor Responsable',
  ]

  const [obligatorios, setObligatorios] = useState<Record<string, boolean>>({
    'Nombre y Apellidos': true,
    'Documento de Identidad': true,
    'Fecha De Nacimiento': true,
    'Correo Electrónico': true,
    'Teléfono de contacto': false,
    'Areas Seleccionadas': true,
    'Tutor Responsable': true,
  })

  const toggleObligatorio = (campo: string) => {
    setObligatorios(prev => ({ ...prev, [campo]: !prev[campo] }))
  }

  return (
    <section className="bg-[#e5e5e5] py-10 px-4 flex justify-center">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-8">
        <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
          <span className="text-black">⚙</span> Registro y configuración
        </h2>
        <p className="text-sm mb-6">Estructura de la competencia</p>

        <div className="space-y-4">
          {/* Áreas */}
          <div>
            <div className="flex items-center gap-2">
              <FaFlask />
              <label className="text-sm font-semibold">Áreas de competencia</label>
            </div>
            <div
              className="w-full flex justify-between items-center bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
              onClick={() => setShowAreaModal(true)}
            >
              <span className="font-semibold">{selectedAreas.length > 0 ? selectedAreas.join(', ') : 'Ingrese un área'}</span>
              <FaBars className="text-lg" />
            </div>
          </div>

          {/* Niveles */}
          <div>
            <div className="flex items-center gap-2">
              <FaChartBar />
              <label className="text-sm font-semibold">Niveles</label>
            </div>
            <div
              className="w-full flex justify-between items-center bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
              onClick={() => setShowNivelModal(true)}
            >
              <span className="font-semibold">{selectedNiveles.length > 0 ? selectedNiveles.join(', ') : 'Ingrese un nivel'}</span>
              <FaBars className="text-lg" />
            </div>
          </div>

          {/* Categorías */}
          <div>
            <div className="flex items-center gap-2">
              <FaLayerGroup />
              <label className="text-sm font-semibold">Categorías</label>
            </div>
            <div
              className="w-full flex justify-between items-center bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
              onClick={() => setShowCategoriaModal(true)}
            >
              <span className="font-semibold">{selectedCategorias.length > 0 ? selectedCategorias.join(', ') : 'Ingrese una categoría'}</span>
              <FaBars className="text-lg" />
            </div>
          </div>

          {/* Costos */}
          <div>
            <div className="flex items-center gap-2">
              <FaDollarSign />
              <label className="text-sm font-semibold">Costos</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                placeholder="Ingrese el costo"
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
                className="w-full px-4 py-2 bg-gray-200 rounded-md focus:outline-none"
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                onClick={() => setCostoConfirmado(costo)}
              >
                <FaCheck />
              </button>
            </div>
            {costoConfirmado && <p className="mt-1 text-sm font-semibold">{costoConfirmado} Bs.</p>}
          </div>
        </div>

        <hr className="my-8 border-gray-300" />

        <h3 className="text-center font-bold mb-4">Campos necesarios para el registro</h3>

        <div className="bg-[#e5e5e5] p-4 rounded-xl">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="p-2 font-semibold">Datos:</th>
                <th className="p-2 font-semibold text-center">Obligatorio:</th>
              </tr>
            </thead>
            <tbody>
              {campos.map((campo) => (
                <tr key={campo} className="border-t border-gray-300">
                  <td className="p-2 text-gray-700">{campo}</td>
                  <td className="p-2 flex justify-center gap-3">
                    <button
                      className={`w-10 h-8 rounded-full font-bold text-white text-sm ${obligatorios[campo] ? 'bg-blue-500' : 'bg-gray-400'}`}
                      onClick={() => setObligatorios((prev) => ({ ...prev, [campo]: true }))}
                    >
                      SI
                    </button>
                    <button
                      className={`w-10 h-8 rounded-full font-bold text-white text-sm ${!obligatorios[campo] ? 'bg-red-500' : 'bg-gray-400'}`}
                      onClick={() => setObligatorios((prev) => ({ ...prev, [campo]: false }))}
                    >
                      NO
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAreaModal && (
        <SelectAreasModal
          selected={selectedAreas}
          onClose={() => setShowAreaModal(false)}
          onConfirm={(values) => {
            setSelectedAreas(values)
            setShowAreaModal(false)
          }}
        />
      )}

      {showNivelModal && (
        <SelectNivelesModal
          selected={selectedNiveles}
          onClose={() => setShowNivelModal(false)}
          onConfirm={(values) => {
            setSelectedNiveles(values)
            setShowNivelModal(false)
          }}
        />
      )}

      {showCategoriaModal && (
        <SelectCategoriasModal
          selected={selectedCategorias}
          onClose={() => setShowCategoriaModal(false)}
          onConfirm={(values) => {
            setSelectedCategorias(values)
            setShowCategoriaModal(false)
          }}
        />
      )}
    </section>
  )
}
