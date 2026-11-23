import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { DEFAULT_MODEL, MODEL_OPTIONS } from "./chat-models"
import { claudeCostFromUsage } from "./claude-pricing"

const leer = (rel: string) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), "utf8")

describe("selector de modelos del chat (generación 5.5)", () => {
  it("ofrece los IDs canónicos 5.5 con contexto de 1M y Sonnet por defecto", () => {
    expect(MODEL_OPTIONS.map((m) => m.id)).toEqual(["claude-haiku-5.5", "claude-sonnet-5.5", "claude-opus-5.5"])
    expect(MODEL_OPTIONS.every((m) => m.ctxK === 1000)).toBe(true)
    expect(DEFAULT_MODEL).toBe("claude-sonnet-5.5")
  })
})

describe("costo de Claude (Sonnet 5.5: $2/$10 por MTok)", () => {
  it("1M de entrada + 1M de salida cuesta 12 USD", () => {
    expect(claudeCostFromUsage({ inputTokens: 1_000_000, outputTokens: 1_000_000 })).toBeCloseTo(12, 6)
  })
  it("usage vacío cuesta 0", () => {
    expect(claudeCostFromUsage({})).toBe(0)
  })
})

describe("llamadas al modelo usan el slug de API con guiones", () => {
  it.each(["./claude.ts", "./sov-calculator.ts", "../app/api/proyeccion/chat/route.ts"])("%s", (f) => {
    const src = leer(f)
    expect(src).toContain("anthropic('claude-sonnet-5-5')")
    expect(src).not.toMatch(/claude-sonnet-4[.-]6/)
  })
})
