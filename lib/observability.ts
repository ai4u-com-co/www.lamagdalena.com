import { configureTransport, setServiceName } from "@ai4u/platform/logger"
import { SERVICE_ID } from "@/lib/service"

/**
 * Arranca la observabilidad central: nombra el servicio en los logs y, si hay
 * ingest configurado (PLATFORM_INGEST_URL + INGEST_SECRET), activa el envío de
 * logs al panel admin (@ai4u/platform). Se llama UNA vez desde instrumentation.ts.
 */
let started = false
export function bootstrapObservability(): void {
  if (started) return
  started = true

  setServiceName(process.env.SERVICE_ID ?? SERVICE_ID)
  const endpoint = process.env.PLATFORM_INGEST_URL
  const secret = process.env.INGEST_SECRET
  if (endpoint && secret) {
    configureTransport({ endpoint, secret })
  } else if (endpoint || secret) {
    console.warn("[observability] PLATFORM_INGEST_URL e INGEST_SECRET deben ir juntos; transporte de logs desactivado")
  }
}
