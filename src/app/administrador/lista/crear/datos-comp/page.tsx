'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { IoFlask } from 'react-icons/io5'
import { FaRegChartBar, FaCheck } from 'react-icons/fa'
import { BsFileRuled, BsCurrencyDollar, BsMenuApp } from 'react-icons/bs'

import SelectAreasModal from '@/components/Modals/regComp/SelectAreasModal'
import SelectNivelesModal from '@/components/Modals/regComp/SelectNivelesModal'
import SelectCategoriasModal from '@/components/Modals/regComp/SelectCategoriasModal'
import { useRegistro } from '@/lib/context/RegistroContext'

export default function DatosCompetenciaPage() {
  const {
    selectedAreas,
    selectedNiveles,
    selectedCategorias,
    costoConfirmado,
    setSelectedAreas,
    setSelectedNiveles,
    setSelectedCategorias,
    setCostoConfirmado,
  } = useRegistro()

  const [costoInput, setCostoInput] = useState('')
  const [showAreaModal, setShowAreaModal] = useState(false)
  const [showNivelModal, setShowNivelModal] = useState(false)
  const [showCategoriaModal, setShowCategoriaModal] = useState(false)

  const [errors, setErrors] = useState({
    areas: false,
    niveles: false,
    categorias: false,
    costo: false,
  })

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = {
      areas: selectedAreas.length === 0,
      niveles: selectedNiveles.length === 0,
      categorias: selectedCategorias.length === 0,
      costo: costoConfirmado.trim() === '',
    }
    setErrors(newErrors)

    if (Object.values(newErrors).some((v) => v)) return

    // 1) console.log de todos los datos
    console.log({
      selectedAreas,
      selectedNiveles,
      selectedCategorias,
      costo: costoConfirmado,
    })

    // 2) Envío por POST
    try {
      await fetch('/api/competencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          areas: selectedAreas,
          niveles: selectedNiveles,
          categorias: selectedCategorias,
          costo: costoConfirmado,
        }),
      })
    } catch (err) {
      console.error('Error enviando datos:', err)
    }

    // 3) Navegar al siguiente paso
    router.push('/administrador/lista/crear/fechas')
  }

  return (
    <div className="w-full flex justify-center">
      <form
        id="registroForm"
        onSubmit={handleSubmit}
        className="rounded-2xl w-full max-w-4xl p-8"
      >
        <div className="space-y-4">
          {/* Áreas */}
          <div>
            <div className="flex items-center gap-2">
              <IoFlask className="w-4 h-4" />
              <label className="text-xl">Áreas de competencia</label>
            </div>
            <div
              className={`w-full flex justify-between items-center px-4 py-2 rounded-md cursor-pointer ${
                errors.areas ? 'bg-red-200' : 'bg-gray-200'
              }`}
              onClick={() => setShowAreaModal(true)}
            >
              <span>
                {selectedAreas.length > 0
                  ? selectedAreas.join(', ')
                  : 'Ingrese un área'}
              </span>
              <BsMenuApp className="text-lg" />
            </div>
            {errors.areas && (
              <p className="text-red-500 text-sm">
                Seleccione al menos una área.
              </p>
            )}
          </div>

          <hr className="my-1 border-b-2 border-gray-300" />

          {/* Niveles */}
          <div>
            <div className="flex items-center gap-2">
              <FaRegChartBar />
              <label className="text-xl">Niveles</label>
            </div>
            <div
              className={`w-full flex justify-between items-center px-4 py-2 rounded-md cursor-pointer bg-gray-200`}
              onClick={() => setShowNivelModal(true)}
            >
              <span>
                {selectedNiveles.length > 0
                  ? selectedNiveles.join(', ')
                  : 'Ingrese un nivel'}
              </span>
              <BsMenuApp className="text-lg" />
            </div>
            {errors.niveles && (
              <p className="text-red-500 text-sm">
                Seleccione al menos un nivel.
              </p>
            )}
          </div>

          <hr className="my-1 border-b-2 border-gray-300" />

          {/* Categorías */}
          <div>
            <div className="flex items-center gap-2">
              <BsFileRuled />
              <label className="text-xl">Categorías</label>
            </div>
            <div
              className={`w-full flex justify-between items-center px-4 py-2 rounded-md cursor-pointer bg-gray-200 `}
              onClick={() => setShowCategoriaModal(true)}
            >
              <span>
                {selectedCategorias.length > 0
                  ? selectedCategorias.join(', ')
                  : 'Ingrese una categoría'}
              </span>
              <BsMenuApp className="text-lg" />
            </div>
            {errors.categorias && (
              <p className="text-red-500 text-sm">
                Seleccione al menos una categoría.
              </p>
            )}
          </div>

          <hr className="my-1 border-b-2 border-gray-300" />

          {/* Costos */}
          <div>
            <div className="flex items-center gap-2">
              <BsCurrencyDollar />
              <label className="text-xl">Costos</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                placeholder="Ingrese el costo"
                value={costoInput}
                onChange={(e) => setCostoInput(e.target.value)}
                className={`w-full px-4 py-2 rounded-md focus:outline-none bg-gray-200 `}
              />
              <button
                type="button"
                className="bg-boton hover:bg-boton-hover text-white p-2 rounded-full"
                onClick={() => setCostoConfirmado(costoInput)}
              >
                <FaCheck />
              </button>
            </div>
            {costoConfirmado && (
              <p className="mt-1 text-xl">{costoConfirmado} Bs.</p>
            )}
            {errors.costo && (
              <p className="text-red-500 text-sm">
                El campo de costo es obligatorio.
              </p>
            )}
          </div>
        </div>
      </form>

      {/* Modales */}
      {showAreaModal && (
        <SelectAreasModal
          selected={selectedAreas}
          onClose={() => setShowAreaModal(false)}
          onConfirm={(vals) => {
            setSelectedAreas(vals)
            setShowAreaModal(false)
          }}
        />
      )}
      {showNivelModal && (
        <SelectNivelesModal
          areas={selectedAreas} 
          selected={selectedNiveles}
          onClose={() => setShowNivelModal(false)}
          onConfirm={(vals) => {
            setSelectedNiveles(vals)
            setShowNivelModal(false)
          }}
        />
      )}
      {showCategoriaModal && (
        <SelectCategoriasModal
          areas={selectedAreas} 
          selected={selectedCategorias}
          onClose={() => setShowCategoriaModal(false)}
          onConfirm={(vals) => {
            setSelectedCategorias(vals)
            setShowCategoriaModal(false)
          }}
        />
      )}
    </div>
  )
}
