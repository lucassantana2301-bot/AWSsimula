import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2022",
    sourcemap: true,
    /* scripts/check-size.mjs lê o manifesto para separar carga inicial e sob demanda */
    manifest: true,
    /* orçamento: acima disso o CI acusa (fase 2 baixa com conteúdo sob demanda) */
    chunkSizeWarningLimit: 2000,
  },
});
