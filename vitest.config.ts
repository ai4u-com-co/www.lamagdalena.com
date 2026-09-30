import { defineConfig } from "vitest/config"

// Solo tests unitarios de lib/. Los *.spec.js de tests/ son de Playwright (npm run test:e2e).
export default defineConfig({
  test: { environment: "node", include: ["lib/**/*.test.ts"] },
})
