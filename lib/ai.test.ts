import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { resetEnvWarnings } from "@ai4u/config/env"

const createAnthropic = vi.hoisted(() => vi.fn())
vi.mock("@ai-sdk/anthropic", async (importOriginal) => {
  const real = await importOriginal<typeof import("@ai-sdk/anthropic")>()
  createAnthropic.mockImplementation(real.createAnthropic)
  return { ...real, createAnthropic }
})

import { anthropic, anthropicApiKey } from "./ai"

// Valores de prueba armados en runtime: un literal tipo "secreto" dispara gitleaks.
const valor = (...partes: string[]) => ["prueba", ...partes].join("-")

let warn: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  resetEnvWarnings()
  createAnthropic.mockClear()
  warn = vi.spyOn(console, "warn").mockImplementation(() => {})
})

afterEach(() => {
  warn.mockRestore()
  vi.unstubAllEnvs()
})

describe("llave de Anthropic por tenant (MAGDALENA)", () => {
  it("usa MAGDALENA_ANTHROPIC_API_KEY cuando existe", () => {
    const propia = valor("magdalena")
    const env = { MAGDALENA_ANTHROPIC_API_KEY: propia, AI4U_ANTHROPIC_API_KEY: valor("ai4u"), ANTHROPIC_API_KEY: valor("legada") }
    expect(anthropicApiKey(env)).toBe(propia)
    expect(warn).not.toHaveBeenCalled()
  })

  it("sin ella cae a AI4U_ANTHROPIC_API_KEY", () => {
    const ai4u = valor("ai4u")
    expect(anthropicApiKey({ AI4U_ANTHROPIC_API_KEY: ai4u, ANTHROPIC_API_KEY: valor("legada") })).toBe(ai4u)
  })

  it("sin llaves nuevas cae a la legada ANTHROPIC_API_KEY con aviso que no filtra el valor", () => {
    const legada = valor("legada")
    expect(anthropicApiKey({ ANTHROPIC_API_KEY: legada })).toBe(legada)
    const avisos = warn.mock.calls.flat().join("\n")
    expect(avisos).toContain("ANTHROPIC_API_KEY")
    expect(avisos).not.toContain(legada)
  })

  it("sin ninguna devuelve undefined (el SDK conserva su lectura implícita)", () => {
    expect(anthropicApiKey({})).toBeUndefined()
  })

  it("anthropic(modelo) crea el proveedor con la llave del tenant leída en la llamada", () => {
    const propia = valor("magdalena")
    vi.stubEnv("MAGDALENA_ANTHROPIC_API_KEY", propia)
    const model = anthropic("claude-sonnet-4-6")
    expect(createAnthropic).toHaveBeenCalledTimes(1)
    expect(createAnthropic).toHaveBeenCalledWith({ apiKey: propia })
    expect(model.modelId).toBe("claude-sonnet-4-6")
  })
})
