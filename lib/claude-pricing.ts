// Claude Sonnet 5.5: $2/MTok de entrada, $10/MTok de salida.
export const CLAUDE_INPUT_PRICE_PER_TOKEN = 2 / 1_000_000
export const CLAUDE_OUTPUT_PRICE_PER_TOKEN = 10 / 1_000_000

export function claudeCostFromUsage(usage: { inputTokens?: number; outputTokens?: number }): number {
  return (usage.inputTokens ?? 0) * CLAUDE_INPUT_PRICE_PER_TOKEN +
    (usage.outputTokens ?? 0) * CLAUDE_OUTPUT_PRICE_PER_TOKEN
}
