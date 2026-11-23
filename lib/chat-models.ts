// Catálogo de modelos del selector del chat «Sabio IA». El id viaja como `body.model`
// al backend `magdalena-backend`. Generación 5.5: contexto de 1M tokens en los tres.
export type ModelId = "claude-haiku-5.5" | "claude-sonnet-5.5" | "claude-opus-5.5"

export const DEFAULT_MODEL: ModelId = "claude-sonnet-5.5"

export const MODEL_OPTIONS: Array<{ id: ModelId; label: string; description: string; ctxK: number }> = [
  { id: "claude-haiku-5.5",  label: "Rápido",       description: "Claude Haiku 5.5 — consultas simples y rápidas, menor costo ($0,10/$0,50 por MTok, hasta 100K de prompt)", ctxK: 1000 },
  { id: "claude-sonnet-5.5", label: "Balanceado",   description: "Claude Sonnet 5.5 — ideal para la mayoría de consultas (predeterminado) ($2/$10 por MTok)",             ctxK: 1000 },
  { id: "claude-opus-5.5",   label: "Máxima IA ⚡", description: "Claude Opus 5.5 — análisis complejos y razonamiento profundo. Más costoso ($4/$20 por MTok).",         ctxK: 1000 },
]
