import { defineConfig } from "vitest/config";

/*
 * Cobertura (auditoria de QA, item 11). Os limites são uma catraca: ficam logo abaixo do valor
 * atual e só sobem. Um PR que derruba a cobertura falha em `npm run test:coverage`.
 * O motor legado (src/legacy/*.js) fica de fora: é coberto pelas suítes de DOM e de navegador.
 */
export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts", "server/**/*.ts"],
      exclude: ["src/**/*.d.ts", "src/main.ts"],
      reporter: ["text-summary", "json-summary", "html"],
      reportsDirectory: "coverage",
      thresholds: { statements: 60, branches: 52, functions: 65, lines: 60 },
    },
  },
});
