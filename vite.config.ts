import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { defineConfig, type Plugin } from "vite";

/* versão exibida na telemetria: commit do deploy na Vercel, ou "dev" */
const versao = (process.env["VERCEL_GIT_COMMIT_SHA"] ?? "dev").slice(0, 7);

/**
 * Gera /sw.js no build com a lista de arquivos do pacote (todos com hash no
 * nome) e uma versão derivada desse conteúdo: build igual, cache igual.
 */
function serviceWorker(): Plugin {
  return {
    name: "cq-service-worker",
    apply: "build",
    generateBundle(_opcoes, pacote) {
      const arquivos = Object.keys(pacote)
        .filter((f) => f.startsWith("assets/") && !f.endsWith(".map"))
        .sort()
        .map((f) => `/${f}`);
      const hash = createHash("sha256").update(arquivos.join("\n")).digest("hex").slice(0, 12);
      const modelo = readFileSync(new URL("./src/pwa/sw.template.js", import.meta.url), "utf8");
      const contar = (m: string): number => modelo.split(m).length - 1;
      if (contar("__ARQUIVOS__") !== 1 || contar("__VERSAO__") !== 1)
        throw new Error("sw.template.js: cada marcador deve aparecer uma vez, só no código");
      const fonte = modelo.replace("__VERSAO__", hash).replace("__ARQUIVOS__", JSON.stringify(arquivos));
      if (/__[A-Z]+__/.test(fonte)) throw new Error("sw.js gerado ainda tem marcador");
      this.emitFile({ type: "asset", fileName: "sw.js", source: fonte });
    },
  };
}

export default defineConfig({
  define: {
    __VERSAO_APP__: JSON.stringify(versao),
  },
  plugins: [serviceWorker()],
  build: {
    target: "es2022",
    sourcemap: true,
    /* scripts/check-size.mjs lê o manifesto para separar carga inicial e sob demanda */
    manifest: true,
    /* orçamento: acima disso o CI acusa (fase 2 baixa com conteúdo sob demanda) */
    chunkSizeWarningLimit: 2000,
  },
});
