import { redact } from './safeErr'

/**
 * Error para logs de rutas que procesan datos de terceros (comentarios, perfiles, textos scrapeados).
 * Conserva solo la CLASE del error (name), su código/status y los frames del stack; NUNCA el texto
 * del mensaje, que puede repetir contenido de personas (por ejemplo, un error del modelo o de la BD
 * que cite el prompt o una fila).
 */
export function errClass(e: unknown): Error {
  const o = (e && typeof e === 'object' ? e : {}) as { name?: unknown; code?: unknown; status?: unknown; statusCode?: unknown }
  const name = typeof o.name === 'string' && o.name ? o.name : 'Error'
  const code = typeof o.code === 'string' || typeof o.code === 'number' ? ` code=${String(o.code).slice(0, 40)}` : ''
  const st = o.statusCode ?? o.status
  const status = typeof st === 'number' ? ` status=${st}` : ''
  const out = new Error(redact(`${name}${code}${status}`).slice(0, 200))
  Object.defineProperty(out, 'name', { value: redact(name).slice(0, 100), enumerable: false, writable: true, configurable: true })
  const frames = e instanceof Error && e.stack ? e.stack.split('\n').filter(l => /^\s+at\s/.test(l)).slice(0, 8).join('\n') : ''
  out.stack = frames ? redact(`${out.name}: ${out.message}\n${frames}`).slice(0, 1500) : undefined
  return out
}
