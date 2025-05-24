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
import { adlam } from '@/config/fonts'

function groupByArea(items: string[]): Record<string, string[]> {
  return items.reduce((acc, key) => {
    const [area, ...rest] = key.split('-')
    const val = rest.join('-')
    if (!acc[area]) acc[area] = []
    acc[area].push(val)
    return acc
  }, {} as Record<string, string[]>)
}

function groupedText(grouped: Record<string, string[]>): string {
  return Object.entries(grouped)
    .map(([area, vals]) => `${area}: ${vals.join(', ')}`)
    .join('\n')
}

export default function DatosCompetenciaPage() {
  const {
    selectedAreas,
    nivelesMap,
    categoriasMap,
    costoConfirmado,
    setSelectedAreas,
    setNivelesMap,
    setCategoriasMap,
    setCostoConfirmado,
  } = useRegistro()

  const [tmpNiveles, setTmpNiveles] = useState<string[]>([])
  const [tmpCategorias, setTmpCategorias] = useState<string[]>([])
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

  const nivelesGrouped = Object.keys(nivelesMap).length
  ? nivelesMap
  : {} as Record<string, string[]>
const nivelesDisplay = Object.keys(nivelesGrouped).length
  ? groupedText(nivelesGrouped)
  : 'Ingrese un nivel'

const categoriasGrouped = Object.keys(categoriasMap).length
  ? categoriasMap
  : {} as Record<string, string[]>
const categoriasDisplay = Object.keys(categoriasGrouped).length
  ? groupedText(categoriasGrouped)
  : 'Ingrese una categoría'

    const handleConfirmNiveles = (vals: string[]) => {
      setTmpNiveles(vals)
      setShowNivelModal(false)
      setNivelesMap(groupByArea(vals))
    }

    const handleConfirmCategorias = (vals: string[]) => {
      setTmpCategorias(vals)
      setShowCategoriaModal(false)
      setCategoriasMap(groupByArea(vals))
    }
  
    const handleConfirmAreas = (vals: string[]) => {
      setSelectedAreas(vals)
      setShowAreaModal(false)
      // resetea niveles y categorías si quitas un área
      setTmpNiveles([])
      setNivelesMap({})
      setTmpCategorias([])
      setCategoriasMap({})
    }

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = {
      areas: selectedAreas.length === 0,
      niveles: Object.keys(nivelesMap).length === 0,
      categorias: Object.keys(categoriasMap).length === 0,
      costo: costoConfirmado.trim() === '',
    }
    setErrors(newErrors)

    if (Object.values(newErrors).some((v) => v)) return

    // 1) console.log de todos los datos
    console.log({ selectedAreas, nivelesMap, categoriasMap, costoConfirmado })
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
              className={`w-full flex justify-between items-center px-4 py-2 rounded-md cursor-pointer bg-gray-200`}
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
                Seleccione una área.
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
              className={`bg-gray-200 rounded-md cursor-pointer`}
              onClick={() => setShowNivelModal(true)}
            >
              <div
                className={`
                  ${adlam.className}
                  w-full flex items-start
                  px-4 py-2
                `}
              >
                {/* Contenedor de texto con wrapping y scroll si hay muchas líneas */}
                <div
                  className="
                    flex-1
                    whitespace-pre-wrap break-words
                    max-h-24 overflow-y-auto
                    pr-2
                  "
                >
                  {nivelesDisplay}
                </div>

                {/* Icono siempre al lado, sin empujar al texto */}
                <BsMenuApp className="text-lg flex-shrink-0" />
              </div>
            </div>
            {errors.niveles && (
              <p className="text-red-500 text-sm mt-1">
                Seleccione un nivel.
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
                className={errors.categorias ? 'bg-red-200' : 'bg-gray-200'}
                onClick={() => setShowCategoriaModal(true)}
              >
              <pre className={` ${adlam.className} w-full flex justify-between items-center px-4 py-2 rounded-md cursor-pointer bg-gray-200`}>
                {categoriasDisplay}
                <BsMenuApp className="text-lg" />
              </pre>     
            </div>
            {errors.categorias && (
              <p className="text-red-500 text-sm">
                Seleccione una categoría.
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
          onConfirm={handleConfirmAreas}
        />
      )}
      
      {showNivelModal && (
        <SelectNivelesModal
          selected={tmpNiveles}
          onClose={() => setShowNivelModal(false)}
          onConfirm={handleConfirmNiveles}
        />
      )}
      
      {showCategoriaModal && (
        <SelectCategoriasModal
          selected={tmpCategorias}
          onClose={() => setShowCategoriaModal(false)}
          onConfirm={handleConfirmCategorias}
        />
      )}
    </div>
  )
}
