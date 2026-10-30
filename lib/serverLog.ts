import { getLogger, flushLogs } from '@ai4u/platform/logger'
import { errClass } from './errClass'

/**
 * Registro de errores de servidor hacia platform_logs. Este sitio maneja datos de personas
 * (contactos, comentarios scrapeados), así que NUNCA se registra el texto del error crudo:
 * solo la clase/código/status + frames (errClass). Tampoco cuerpos, cabeceras ni URLs con query.
 */
type Fields = Record<string, unknown>

/** Registra y envía de inmediato (en serverless la función puede congelarse al responder). */
export async function reportError(component: string, fields: Fields, msg: string, e: unknown): Promise<void> {
  try {
    getLogger(component).error({ ...fields, err: errClass(e) }, msg)
    await flushLogs()
  } catch { /* la telemetría nunca debe romper la ruta */ }
}

/** Igual que reportError pero con nivel warn (errores esperados o de mejor esfuerzo). */
export async function reportWarn(component: string, fields: Fields, msg: string, e: unknown): Promise<void> {
  try {
    getLogger(component).warn({ ...fields, err: errClass(e) }, msg)
    await flushLogs()
  } catch { /* la telemetría nunca debe romper la ruta */ }
}

/**
 * Envuelve un handler: si lanza, registra y RELANZA el mismo error, de modo que la respuesta
 * (500 de Next) es idéntica a la de antes. Sin cambio de status ni de cuerpo.
 */
export function withErrorLog<A extends unknown[], R>(
  component: string,
  handler: (...args: A) => Promise<R> | R,
): (...args: A) => Promise<R> {
  return async (...args: A) => {
    try {
      return await handler(...args)
    } catch (e) {
      await reportError(component, { route: component }, 'unhandled route error', e)
      throw e
    }
  }
}
