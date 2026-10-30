// Next.js instrumentation hook: corre una vez al arrancar el runtime de servidor.
// Nombra el servicio (lib/service.ts) y configura el transporte de logs de
// @ai4u/platform con PLATFORM_INGEST_URL + INGEST_SECRET (lib/observability.ts).
// Solo servidor (runtime nodejs): no entra al bundle del navegador.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { bootstrapObservability } = await import("@/lib/observability")
    bootstrapObservability()
  }
}
