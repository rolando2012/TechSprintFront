'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { FaRegChartBar } from 'react-icons/fa'
import { BsFileRuled, BsCurrencyDollar, BsMenuApp } from 'react-icons/bs'

import SelectNivelesModal from '@/components/Modals/regComp/SelectNivelesModal'
import SelectCategoriasModal from '@/components/Modals/regComp/SelectCategoriasModal'
import { useRegistro } from '@/lib/context/RegistroContext'
import { adlam } from '@/config/fonts'
import { validarNombreUnico, registrarCompetencia } from '@/lib/api/competencia'

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
    nombre,
    costo,
    setNombre,
    setCosto,
    nivelesMap,
    categoriasMap,
    setNivelesMap,
    setCategoriasMap,
  } = useRegistro()

  const [tmpNiveles, setTmpNiveles] = useState<string[]>([])
  const [tmpCategorias, setTmpCategorias] = useState<string[]>([])
  const [showNivelModal, setShowNivelModal] = useState(false)
  const [showCategoriaModal, setShowCategoriaModal] = useState(false)

  const [errors, setErrors] = useState({
    nombre: false,
    nombreUnique: '',
    niveles: false,
    categorias: false,
    costo: false,
  })

  const router = useRouter()

  const nivelesDisplay = Object.keys(nivelesMap).length
    ? groupedText(nivelesMap)
    : 'Ingrese un nivel'
  const categoriasDisplay = Object.keys(categoriasMap).length
    ? groupedText(categoriasMap)
    : 'Ingrese una categoría'

  const clearLevelCatError = () => {
    setErrors(prev => ({ ...prev, niveles: false, categorias: false }))
  }

  const handleConfirmNiveles = (vals: string[]) => {
    setTmpNiveles(vals)
    setShowNivelModal(false)
    setNivelesMap(groupByArea(vals))
    clearLevelCatError()
  }

  const handleConfirmCategorias = (vals: string[]) => {
    setTmpCategorias(vals)
    setShowCategoriaModal(false)
    setCategoriasMap(groupByArea(vals))
    clearLevelCatError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let timerInterval: NodeJS.Timeout
    const costoValue = parseFloat(costo)
    const nivelCatEmpty =
      Object.keys(nivelesMap).length === 0 &&
      Object.keys(categoriasMap).length === 0

    // Validaciones locales
    const newErrors = {
      nombre: nombre.trim() === '' || nombre.length > 100,
      nombreUnique: '',
      niveles: nivelCatEmpty,
      categorias: nivelCatEmpty,
      costo: isNaN(costoValue) || costoValue <= 0,
    }
    setErrors(newErrors)
    if (Object.values(newErrors).some(v => v === true)) return

    timerInterval = setInterval(() => {}, 100)
    Swal.fire({
      title: 'Validando datos…',
      html: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    })

    try {
      const isUnique = await validarNombreUnico(nombre.trim())
      if (!isUnique) {
        Swal.close()
        clearInterval(timerInterval)
        setErrors(prev => ({ ...prev, nombreUnique: 'Ese nombre ya está en uso.' }))
        return
      }
      Swal.fire({
        icon: 'success',
        title: 'Datos correctos',
        showConfirmButton: false,
        timer: 2000
      })
      setTimeout(() => router.push('/administrador/lista/crear/fechas'), 2000)
    } catch (err: any) {
      Swal.close()
      clearInterval(timerInterval)
      setErrors(prev => ({ ...prev, nombreUnique: err.message || 'Error validando nombre' }))
      return
    } finally {
      Swal.close()
      clearInterval(timerInterval)
    }
  }
    

  return (
    <div className="w-full flex justify-center">
      <form
        id="registroForm"
        onSubmit={handleSubmit}
        className="rounded-2xl w-full max-w-4xl p-8 space-y-4"
      >
        {/* Nombre */}
        <div>
          <label className="flex items-center gap-2 text-xl">
            <MdDriveFileRenameOutline /> Nombre de competencia
          </label>
          <input
            type="text"
            value={nombre}
            onChange={e => {
              setNombre(e.target.value)
              if (errors.nombre) setErrors(prev => ({ ...prev, nombre: false }))
              if (errors.nombreUnique) setErrors(prev => ({ ...prev, nombreUnique: '' }))
            }}
            maxLength={100}
            className={`w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none ${
              errors.nombre || errors.nombreUnique ? 'border-red-500 border' : ''
            }`}
            placeholder="Ingrese el nombre de la competencia"
          />
          {errors.nombre && (
            <p className="text-red-500 text-sm mt-1">
              El nombre es obligatorio y debe tener máximo 100 caracteres.
            </p>
          )}
          {errors.nombreUnique && (
            <p className="text-red-500 text-sm mt-1">
              {errors.nombreUnique}
            </p>
          )}
        </div>

        {/* Niveles */}
        <div>
          <label className="flex items-center gap-2 text-xl">
            <FaRegChartBar /> Niveles
          </label>
          <div
            className={`bg-gray-200 rounded-md cursor-pointer ${
              errors.niveles ? 'border-red-500 border' : ''
            }`}
            onClick={() => setShowNivelModal(true)}
          >
            <div className={`${adlam.className} w-full flex items-start px-4 py-2`}>
              <div className="flex-1 whitespace-pre-wrap break-words max-h-24 overflow-y-auto pr-2">
                {nivelesDisplay}
              </div>
              <BsMenuApp className="text-lg flex-shrink-0" />
            </div>
          </div>
          {errors.niveles && (
              <p className="text-red-500 text-sm mt-1">
                Seleccione al menos un nivel o una categoría.
              </p>
            )}
        </div>

        {/* Categorías */}
        <div>
          <label className="flex items-center gap-2 text-xl">
            <BsFileRuled /> Categorías
          </label>
          <div
            className={`bg-gray-200 rounded-md cursor-pointer ${
              errors.categorias ? 'border-red-500 border' : ''
            }`}
            onClick={() => setShowCategoriaModal(true)}
          >
            <div className={`${adlam.className} w-full flex items-start px-4 py-2`}>
              <div className="flex-1 whitespace-pre-wrap break-words max-h-24 overflow-y-auto pr-2">
                {categoriasDisplay}
              </div>
              <BsMenuApp className="text-lg flex-shrink-0" />
            </div>
          </div>
           {errors.categorias && (
              <p className="text-red-500 text-sm mt-1">
                Seleccione al menos un nivel o una categoría.
              </p>
            )}
        </div>

        {/* Costo */}
        <div>
          <label className="flex items-center gap-2 text-xl">
            <BsCurrencyDollar /> Costo (Bs.)
          </label>
          <input
            type="number"
            step="1"
            value={costo}
            onChange={e => {
              setCosto(e.target.value)
              if (errors.costo) setErrors(prev => ({ ...prev, costo: false }))
            }}
            className={`w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none ${
              errors.costo ? 'border-red-500 border' : ''
            }`}
            placeholder="Ingrese el costo"
          />
          {errors.costo && (
            <p className="text-red-500 text-sm mt-1">
              El costo es obligatorio y no puede ser negativo ni 0.
            </p>
          )}
        </div>
      </form>

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
  )}