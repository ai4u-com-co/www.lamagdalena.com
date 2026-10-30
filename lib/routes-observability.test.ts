import { describe, expect, it, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// --- logger de plataforma mockeado -------------------------------------------------------------
const logged: { level: string; fields: Record<string, unknown>; msg: string }[] = []
const flush = vi.fn(async () => {})
const mk = (level: string) => (a: unknown, b?: unknown) => {
  if (typeof a === 'string') logged.push({ level, fields: {}, msg: a })
  else logged.push({ level, fields: a as Record<string, unknown>, msg: String(b) })
}
vi.mock('@ai4u/platform/logger', () => ({
  getLogger: () => ({ error: mk('error'), warn: mk('warn'), info: mk('info'), debug: mk('debug') }),
  flushLogs: () => flush(),
  configureTransport: vi.fn(),
  setServiceName: vi.fn(),
}))

// --- next/server: `after` ejecuta el callback al final (lo guardamos para esperarlo) -----------
const pending: Array<() => unknown> = []
vi.mock('next/server', async () => {
  const actual = await vi.importActual<typeof import('next/server')>('next/server')
  return { ...actual, after: (fn: () => unknown) => { pending.push(fn) } }
})
async function drainAfter() {
  while (pending.length) await pending.shift()!()
}

// --- dependencias de datos ---------------------------------------------------------------------
const PII = 'ana.perez@cliente-ejemplo.com'
const boom = () => new Error(`falló para ${PII} https://x.test/p?token=abc123secret`)

const job = {
  reportId: 'r1', clientName: 'Cliente', dateFrom: '2026-01-01', dateTo: '2026-01-02',
  selectedNetworks: ['instagram'], keywords: [], hashtags: [], accounts: [], status: 'error',
  apifyRunIds: { instagram: 'run1' }, apifyCompletedRuns: [] as string[], processedRunIds: [] as string[],
}
const supa = {
  loadJob: vi.fn(), loadRawData: vi.fn(), updateJobStatus: vi.fn(), saveRawData: vi.fn(),
  saveAnalysis: vi.fn(), savePdf: vi.fn(), getRawData: vi.fn(), saveJob: vi.fn(), listReports: vi.fn(),
  loadAnalysis: vi.fn(),
}
vi.mock('@/lib/supabase', () => supa)
const apify = { fetchDatasetItems: vi.fn(), getRunCostUsd: vi.fn(), getRunInfo: vi.fn(), startActorRun: vi.fn() }
vi.mock('@/lib/apify', () => apify)
const claude = { analyzeData: vi.fn() }
vi.mock('@/lib/claude', () => claude)
vi.mock('@/lib/url', () => ({ getBaseUrl: () => 'https://example.test' }))
const sovDb = { getSovJob: vi.fn(), updateSovJob: vi.fn(), appendSovRawData: vi.fn(), saveSovJob: vi.fn(), listSovJobs: vi.fn() }
vi.mock('@/lib/sov-supabase', () => sovDb)
const sovCalc = { calculateSov: vi.fn(), generateSovInsights: vi.fn() }
vi.mock('@/lib/sov-calculator', () => sovCalc)
const proy = { computeSummary: vi.fn(), listMonths: vi.fn(), loadIncomePDFs: vi.fn(), loadCostContext: vi.fn(), buildSystemPrompt: vi.fn() }
vi.mock('@/lib/proyeccion', () => proy)
vi.mock('@/lib/ai', () => ({ anthropic: () => ({}) }))
const aiSdk = { generateText: vi.fn() }
vi.mock('ai', () => aiSdk)

const req = (url: string, init?: ConstructorParameters<typeof NextRequest>[1]) =>
  new NextRequest(url, init)
const params = <T extends Record<string, string>>(o: T) => ({ params: Promise.resolve(o) })

function expectLoggedSafely(level = 'error') {
  const hit = logged.find(l => l.level === level)
  expect(hit, `se esperaba un log ${level}`).toBeTruthy()
  const dump = JSON.stringify(logged.map(l => ({ ...l, fields: { ...l.fields, err: String((l.fields.err as Error)?.message) + String((l.fields.err as Error)?.stack) } })))
  expect(dump).not.toContain(PII)
  expect(dump).not.toContain('abc123secret')
  expect(flush).toHaveBeenCalled()
}

beforeEach(() => {
  logged.length = 0
  pending.length = 0
  flush.mockClear()
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  process.env.APIFY_WEBHOOK_SECRET = 's3cret'
  Object.values({ ...supa, ...apify, ...claude, ...sovDb, ...sovCalc, ...proy, ...aiSdk }).forEach(f => (f as ReturnType<typeof vi.fn>).mockReset())
  supa.updateJobStatus.mockImplementation(async (_id: string, patch: object) => ({ ...job, ...patch }))
})

describe('pipelines en after()', () => {
  it('retry: si el análisis falla en after(), se registra y se sigue respondiendo {ok:true}', async () => {
    const { POST } = await import('../app/api/reports/[reportId]/retry/route')
    supa.loadJob.mockResolvedValue(job)
    supa.loadRawData.mockResolvedValue([{ a: 1 }])
    claude.analyzeData.mockRejectedValue(boom())
    const res = await POST(req('https://x.test/api/reports/r1/retry', { method: 'POST' }), params({ reportId: 'r1' }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    await drainAfter()
    expectLoggedSafely()
    // el comportamiento de negocio no cambia: el job queda en error
    expect(supa.updateJobStatus).toHaveBeenLastCalledWith('r1', { status: 'error', error: expect.any(String) })
  })

  it('retry: fallo al leer raw data -> sigue siendo 400 y queda registrado', async () => {
    const { POST } = await import('../app/api/reports/[reportId]/retry/route')
    supa.loadJob.mockResolvedValue(job)
    supa.loadRawData.mockRejectedValue(boom())
    const res = await POST(req('https://x.test/api/reports/r1/retry', { method: 'POST' }), params({ reportId: 'r1' }))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'No data available to retry — rescraping required' })
    expectLoggedSafely('warn')
  })

  it('webhook de reportes: fallo del análisis en after() se registra; respuesta {ok:true}', async () => {
    const { POST } = await import('../app/api/reports/[reportId]/apify-webhook/route')
    supa.loadJob.mockResolvedValue({ ...job, status: 'scraping_posts' })
    apify.fetchDatasetItems.mockResolvedValue([{ id: 'p1' }])
    supa.getRawData.mockResolvedValue([])
    supa.saveRawData.mockResolvedValue(undefined)
    supa.updateJobStatus.mockImplementation(async (_id: string, patch: object) => ({ ...job, ...patch, apifyCompletedRuns: ['run1'] }))
    claude.analyzeData.mockRejectedValue(boom())
    const res = await POST(
      req('https://x.test/api/reports/r1/apify-webhook?secret=s3cret', { method: 'POST', body: JSON.stringify({ eventType: 'ACTOR.RUN.SUCCEEDED', resource: { id: 'run9', defaultDatasetId: 'd1' } }) }),
      params({ reportId: 'r1' }),
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    await drainAfter()
    expectLoggedSafely()
  })

  it('webhook de reportes: excepción fuera de after() se registra; respuesta {ok:true}', async () => {
    const { POST } = await import('../app/api/reports/[reportId]/apify-webhook/route')
    supa.loadJob.mockResolvedValue({ ...job, status: 'scraping_posts' })
    apify.fetchDatasetItems.mockRejectedValue(boom())
    const res = await POST(
      req('https://x.test/api/reports/r1/apify-webhook?secret=s3cret', { method: 'POST', body: JSON.stringify({ eventType: 'ACTOR.RUN.SUCCEEDED', resource: { id: 'run9', defaultDatasetId: 'd1' } }) }),
      params({ reportId: 'r1' }),
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expectLoggedSafely()
  })

  it('webhook SOV: fallo del análisis (triggerAnalysis en after) se registra', async () => {
    const { POST } = await import('../app/api/sov/[sovId]/apify-webhook/route')
    sovDb.getSovJob.mockResolvedValue({ sovId: 's1', apifyRunIds: { brand_instagram: 'run1' }, apifyCompletedRuns: [], rawData: {}, brand: {}, competitors: [], clientName: 'C' })
    apify.fetchDatasetItems.mockResolvedValue([])
    sovDb.appendSovRawData.mockResolvedValue({ completedRuns: ['brand_instagram'], totalExpected: 1 })
    sovCalc.calculateSov.mockImplementation(() => { throw boom() })
    sovDb.updateSovJob.mockResolvedValue(undefined)
    const res = await POST(
      req('https://x.test/api/sov/s1/apify-webhook?secret=s3cret', { method: 'POST', body: JSON.stringify({ eventType: 'ACTOR.RUN.SUCCEEDED', actorRunId: 'run1', defaultDatasetId: 'd1' }) }),
      params({ sovId: 's1' }),
    )
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    await drainAfter()
    expectLoggedSafely()
    expect(sovDb.updateSovJob).toHaveBeenLastCalledWith('s1', { status: 'error', error: expect.any(String) })
  })
})

describe('rutas que responden 500 con cuerpo propio: mismo cuerpo, ahora registradas', () => {
  it('POST /api/sov', async () => {
    const { POST } = await import('../app/api/sov/route')
    sovDb.saveSovJob.mockRejectedValue(boom())
    apify.startActorRun.mockResolvedValue('run1')
    const res = await POST(req('https://x.test/api/sov', { method: 'POST', body: JSON.stringify({
      clientName: 'C', dateFrom: '2026-01-01', dateTo: '2026-01-05', selectedNetworks: ['instagram'], brand: { name: 'B' },
    }) }))
    expect(res.status).toBe(500)
    expect(((await res.json()) as { error: string }).error).toContain('falló para') // contrato de respuesta intacto
    expectLoggedSafely()
  })

  it('POST /api/reports', async () => {
    const { POST } = await import('../app/api/reports/route')
    supa.saveJob.mockRejectedValue(boom())
    const res = await POST(req('https://x.test/api/reports', { method: 'POST', body: JSON.stringify({
      clientName: 'C', dateFrom: '2026-01-01', dateTo: '2026-01-05', selectedNetworks: ['instagram'],
    }) }))
    expect(res.status).toBe(500)
    expect(((await res.json()) as { error: string }).error).toContain('falló para')
    expectLoggedSafely()
  })

  it('POST /api/proyeccion/summary', async () => {
    const { POST } = await import('../app/api/proyeccion/summary/route')
    proy.computeSummary.mockImplementation(() => { throw boom() })
    const res = await POST(new Request('https://x.test/api/proyeccion/summary', { method: 'POST', body: JSON.stringify({ months: ['A'] }) }))
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'Internal Server Error' })
    expectLoggedSafely()
  })

  it('GET one-pager', async () => {
    const { GET } = await import('../app/api/reports/[reportId]/one-pager/route')
    supa.loadJob.mockRejectedValue(boom())
    const res = await GET(req('https://x.test/api/reports/r1/one-pager'), params({ reportId: 'r1' }))
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'Error generating one-pager' })
    expectLoggedSafely()
  })

  it('POST proyeccion/chat', async () => {
    const { POST } = await import('../app/api/proyeccion/chat/route')
    proy.loadCostContext.mockReturnValue('')
    proy.loadIncomePDFs.mockReturnValue([])
    proy.buildSystemPrompt.mockReturnValue('')
    aiSdk.generateText.mockRejectedValue(boom())
    const res = await POST(new Request('https://x.test/api/proyeccion/chat', { method: 'POST', body: JSON.stringify({ prompt: 'hola', selectedMonths: [] }) }))
    expect(res.status).toBe(500)
    expect(((await res.json()) as { error: string }).error).toContain('falló para')
    expectLoggedSafely()
  })

  it('POST /api/sov/[id]/recover: análisis fallido -> 500 {error:"Analysis failed"}', async () => {
    const { POST } = await import('../app/api/sov/[sovId]/recover/route')
    const j = { sovId: 's1', status: 'scraping', apifyRunIds: {}, apifyCompletedRuns: [], totalExpectedRuns: 0, rawData: {}, brand: {}, competitors: [], clientName: 'C' }
    sovDb.getSovJob.mockResolvedValue(j)
    sovDb.updateSovJob.mockResolvedValue(undefined)
    sovCalc.calculateSov.mockImplementation(() => { throw boom() })
    const res = await POST(req('https://x.test/api/sov/s1/recover', { method: 'POST' }), params({ sovId: 's1' }))
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'Analysis failed' })
    expectLoggedSafely()
  })
})

describe('rutas sin try/catch: el error se registra y se RELANZA igual (misma respuesta de Next)', () => {
  it('GET download', async () => {
    const { GET } = await import('../app/api/reports/[reportId]/download/route')
    const err = boom()
    supa.loadJob.mockRejectedValue(err)
    await expect(GET(req('https://x.test/api/reports/r1/download'), params({ reportId: 'r1' }))).rejects.toBe(err)
    expectLoggedSafely()
  })

  it('GET data', async () => {
    const { GET } = await import('../app/api/reports/[reportId]/data/route')
    const err = boom()
    supa.getRawData.mockRejectedValue(err)
    await expect(GET(req('https://x.test/api/reports/r1/data'), params({ reportId: 'r1' }))).rejects.toBe(err)
    expectLoggedSafely()
  })

  it('GET pulse-finance autorizado', async () => {
    process.env.MISSION_CONTROL_SECRET = 'mc'
    const { GET } = await import('../app/api/pulse-finance/route')
    const err = boom()
    proy.listMonths.mockImplementation(() => { throw err })
    await expect(GET(req('https://x.test/api/pulse-finance', { headers: { 'x-mc-secret': 'mc' } }))).rejects.toBe(err)
    expectLoggedSafely()
  })

  it('pulse-finance sin secreto sigue siendo 401', async () => {
    process.env.MISSION_CONTROL_SECRET = 'mc'
    const { GET } = await import('../app/api/pulse-finance/route')
    const res = await GET(req('https://x.test/api/pulse-finance'))
    expect(res.status).toBe(401)
    expect(await res.json()).toEqual({ error: 'No autorizado' })
  })
})
