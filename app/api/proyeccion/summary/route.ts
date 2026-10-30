import { NextResponse } from 'next/server'
import { reportError } from '@/lib/serverLog'
import { computeSummary } from '@/lib/proyeccion'

export async function POST(request: Request) {
  try {
    const { months } = await request.json()
    if (!months || !Array.isArray(months)) {
      return NextResponse.json({ error: 'months array is required' }, { status: 400 })
    }

    const summary = computeSummary(months)
    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error computing summary:', error)
    await reportError('api/proyeccion/summary', {}, 'falló el cálculo del resumen financiero', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
