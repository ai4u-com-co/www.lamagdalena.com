import { createAnthropic, type AnthropicProvider } from '@ai-sdk/anthropic'
import { getProviderKey, type EnvSource } from '@ai4u/config/env'

/** Tenant dueño de la llave de IA de esta app (app de un solo tenant: La Magdalena). */
const TENANT = 'magdalena'

/**
 * Llave de Anthropic según el contrato de @ai4u/config (`getProviderKey`):
 * `MAGDALENA_ANTHROPIC_API_KEY` → `AI4U_ANTHROPIC_API_KEY` → `ANTHROPIC_API_KEY` (legada, con aviso).
 * `undefined` si no hay ninguna: el AI SDK vuelve a su lectura implícita de `ANTHROPIC_API_KEY`,
 * igual que antes de este cambio.
 */
export function anthropicApiKey(env?: EnvSource): string | undefined {
  return getProviderKey('ANTHROPIC', TENANT, env)?.key
}

/**
 * Reemplazo de `anthropic(modelId)` de `@ai-sdk/anthropic` con la llave del tenant.
 * La llave se lee en cada llamada (no al importar el módulo), como hacía el SDK.
 */
export const anthropic = (modelId: Parameters<AnthropicProvider>[0]) =>
  createAnthropic({ apiKey: anthropicApiKey() })(modelId)
