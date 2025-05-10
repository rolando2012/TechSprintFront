'use client'

import { useState } from 'react'
import { IoFlask } from 'react-icons/io5'
import { FaRegChartBar, FaCheck } from "react-icons/fa";
import { BsFileRuled } from "react-icons/bs";
import { BsCurrencyDollar } from "react-icons/bs";
import { BsMenuApp } from "react-icons/bs";
import { FaCircleCheck } from "react-icons/fa6";

import SelectAreasModal from '@/components/Modals/regComp/SelectAreasModal'
import SelectNivelesModal from '@/components/Modals/regComp/SelectNivelesModal'
import SelectCategoriasModal from '@/components/Modals/regComp/SelectCategoriasModal'
import { inter } from '@/config/fonts'

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
    <div className="min-h-screen w-full flex justify-center">
      <div className=" rounded-2xl  w-full max-w-4xl p-8">
        <div className="space-y-4">
          {/* Áreas */}
          <div>
            <div className="flex items-center gap-2">
              <IoFlask className='w-4 h-4'/>
              <label className="text-xl ">Áreas de competencia</label>
            </div>
            <div
              className="w-full flex justify-between items-center bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
              onClick={() => setShowAreaModal(true)}
            >
              <span >{selectedAreas.length > 0 ? selectedAreas.join(', ') : 'Ingrese un área'}</span>
              <BsMenuApp className="text-lg" />
            </div>
          </div>
          <hr className="my-1 border-b-2 border-gray-300" />

          {/* Niveles */}
          <div>
            <div className="flex items-center gap-2">
              <FaRegChartBar />
              <label className="text-xl">Niveles</label>
            </div>
            <div
              className="w-full flex justify-between items-center bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
              onClick={() => setShowNivelModal(true)}
            >
              <span >{selectedNiveles.length > 0 ? selectedNiveles.join(', ') : 'Ingrese un nivel'}</span>
              <BsMenuApp className="text-lg" />
            </div>
          </div>
          <hr className="my-1 border-b-2 border-gray-300" />

          {/* Categorías */}
          <div>
            <div className="flex items-center gap-2">
              <BsFileRuled />
              <label className="text-xl ">Categorías</label>
            </div>
            <div
              className="w-full flex justify-between items-center bg-gray-200 px-4 py-2 rounded-md cursor-pointer"
              onClick={() => setShowCategoriaModal(true)}
            >
              <span >{selectedCategorias.length > 0 ? selectedCategorias.join(', ') : 'Ingrese una categoría'}</span>
              <BsMenuApp className="text-lg" />
            </div>
          </div>
          <hr className="my-1 border-b-2 border-gray-300" />

          {/* Costos */}
          <div>
            <div className="flex items-center gap-2">
              <BsCurrencyDollar />
              <label className="text-xl ">Costos</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                placeholder="Ingrese el costo"
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
                className="w-full px-4 py-2 bg-gray-200 rounded-md focus:outline-none"
              />
              <button
                className="bg-boton hover:bg-boton-hover text-white p-2 rounded-full"
                onClick={() => setCostoConfirmado(costo)}
              >
                <FaCheck />
              </button>
            </div>
            {costoConfirmado && <p className="mt-1 text-xl ">{costoConfirmado} Bs.</p>}
          </div>
        </div>
        <hr className="my-1 border-b-2 border-gray-300" />

        <h3 className="text-2xl text-center text-gray-700 mb-4">Campos necesarios para el registro</h3>

        <div className="bg-[#e5e5e5] p-4 rounded-xl">
          <table className="w-full  text-left">
            <thead>
              <tr>
                <th className="p-2 text-lg">Datos:</th>
                <th className="p-2 text-lg text-center">Obligatorio:</th>
              </tr>
            </thead>
            <tbody>
              {campos.map((campo) => (
                <tr key={campo} className="border-t border-gray-300">
                  <td className="p-2 text-gray-700">{campo}</td>
                  <td className="p-2 flex justify-center gap-3">
                    <button
                      className={`w-10 h-8 rounded-full font-semibold text-white text-sm ${obligatorios[campo] ? 'bg-boton hover:bg-boton-hover' : 'bg-gray-400 hover:bg-boton-3-hover'}`}
                      onClick={() => setObligatorios((prev) => ({ ...prev, [campo]: true }))}
                    >
                      SI
                    </button>
                    <button
                      className={`w-10 h-8 rounded-full font-semibold text-white text-sm ${!obligatorios[campo] ? 'bg-boton-2 hover:bg-boton-2-hover' : 'bg-gray-400 hover:bg-boton-3-hover'}`}
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
    </div>
  )
}
