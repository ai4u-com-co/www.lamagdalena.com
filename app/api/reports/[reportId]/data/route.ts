import { NextRequest, NextResponse } from 'next/server'
import { withErrorLog } from '@/lib/serverLog'
import { getRawData } from '@/lib/supabase'

interface Params {
  params: Promise<{ reportId: string }>
}

async function handleGET(_request: NextRequest, { params }: Params) {
  const { reportId } = await params
  const data = await getRawData(reportId)
  return NextResponse.json(data)
}

export const GET = withErrorLog('api/reports/data', handleGET)
