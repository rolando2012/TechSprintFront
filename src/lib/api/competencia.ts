

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type Stage = {
    id: number
    name: string
    startDate: string  // "YYYY-MM-DD"
    endDate: string
    startTime: string  // "HH:mm"
    endTime: string
  }
  
  export async function registrarCompetencia(
    selectedAreas: string[],
    nivelesMap: Record<string, string[]>,
    categoriasMap: Record<string, string[]>,
    costoConfirmado: number ,
    stages: Stage[]
  ) {
    const res = await fetch(`${BASE_URL}/administrador/competencia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedAreas, nivelesMap, categoriasMap, costoConfirmado, stages })
    })
  
    if (!res.ok) {
      const { error } = await res.json()
      throw new Error(error || 'Error desconocido al registrar competencia')
    }
  
    return await res.json()
  }
  