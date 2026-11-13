import { defineConfig } from "vite";

/* versão exibida na telemetria: commit do deploy na Vercel, ou "dev" */
const versao = (process.env["VERCEL_GIT_COMMIT_SHA"] ?? "dev").slice(0, 7);

export default defineConfig({
  define: {
    __VERSAO_APP__: JSON.stringify(versao),
  },
  build: {
    target: "es2022",
    sourcemap: true,
    /* scripts/check-size.mjs lê o manifesto para separar carga inicial e sob demanda */
    manifest: true,
    /* orçamento: acima disso o CI acusa (fase 2 baixa com conteúdo sob demanda) */
    chunkSizeWarningLimit: 2000,
  },
});
