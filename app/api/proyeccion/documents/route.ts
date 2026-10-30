import { NextResponse } from 'next/server'
import { withErrorLog } from '@/lib/serverLog'
import { listMonths } from '@/lib/proyeccion'

export const dynamic = 'force-dynamic'

async function handleGET() {
  const months = listMonths()
  return NextResponse.json(months)
}

export const GET = withErrorLog('api/proyeccion/documents', handleGET)
