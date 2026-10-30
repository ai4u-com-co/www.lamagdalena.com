import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"

// Solo tests unitarios de lib/. Los *.spec.js de tests/ son de Playwright (npm run test:e2e).
// El alias "@" replica el de tsconfig.json para poder importar rutas API en los tests.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: { environment: "node", include: ["lib/**/*.test.ts"] },
})
