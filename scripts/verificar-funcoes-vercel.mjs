/**
 * Compila as funções exatamente como a Vercel (`vercel build`) e executa cada uma.
 *
 * Por quê: o Docker e os testes de unidade rodam o código das rotas /api por outros caminhos
 * (esbuild, Vitest). Em 2026-11-13 as três funções estavam com 500 em produção porque o
 * @vercel/node compilava com o tsconfig do Vite (módulos ES) num package.json CommonJS, e nada
 * no CI percebia. Este script fecha esse buraco. Não precisa de token: o build é local.
 *
 * Uso: node scripts/verificar-funcoes-vercel.mjs
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";

const RAIZ = resolve(import.meta.dirname, "..");
const CLI = "vercel@65.15.0";
const SAIDA = join(RAIZ, ".vercel", "output", "functions", "api");

/* configuração mínima do projeto, só para o build local (a pasta .vercel é ignorada no git) */
const projeto = join(RAIZ, ".vercel", "project.json");
if (!existsSync(projeto)) {
  mkdirSync(dirname(projeto), { recursive: true });
  writeFileSync(
    projeto,
    JSON.stringify({ projectId: "local", orgId: "local", settings: { framework: null, outputDirectory: "dist", nodeVersion: "22.x" } }),
  );
}
rmSync(join(RAIZ, ".vercel", "output"), { recursive: true, force: true });
execFileSync("npx", ["--yes", CLI, "build", "--yes"], { cwd: RAIZ, stdio: ["ignore", "ignore", "inherit"] });

const casos = [
  { f: "r", metodo: "GET", url: "/api/r?e=saa&s=812&d=2026-11-12", status: 200, tipo: /^text\/html/ },
  { f: "og", metodo: "GET", url: "/api/og?e=saa&s=812&d=2026-11-12", status: 200, tipo: /^image\/png$/ },
  {
    f: "csp",
    metodo: "POST",
    url: "/api/csp",
    corpo: JSON.stringify({ "csp-report": { "effective-directive": "img-src" } }),
    tipoEnviado: "application/csp-report",
    status: 204,
    tipo: null,
  },
];

let falhas = 0;
for (const c of casos) {
  const pasta = join(SAIDA, `${c.f}.func`);
  const cfg = JSON.parse(readFileSync(join(pasta, ".vc-config.json"), "utf8"));
  /* no deploy a Vercel coloca os includeFiles dentro da função; no build local eles vêm num mapa */
  for (const [destino, origem] of Object.entries(cfg.filePathMap ?? {})) {
    mkdirSync(dirname(join(pasta, destino)), { recursive: true });
    copyFileSync(join(RAIZ, origem), join(pasta, destino));
  }
  const antes = process.cwd();
  process.chdir(pasta);
  try {
    if (!cfg.runtime.startsWith("nodejs22")) throw new Error(`runtime ${cfg.runtime}; esperado nodejs22.x (engines do package.json)`);
    const mod = createRequire(join(pasta, "index.js"))(join(pasta, cfg.handler));
    const req = new Request(`https://cq.exemplo${c.url}`, {
      method: c.metodo,
      ...(c.corpo ? { body: c.corpo, headers: { "Content-Type": c.tipoEnviado } } : {}),
    });
    const r = await mod[c.metodo](req, () => undefined);
    const tipo = r.headers.get("content-type");
    if (r.status !== c.status) throw new Error(`status ${r.status}, esperado ${c.status}`);
    if (c.tipo && !c.tipo.test(tipo ?? "")) throw new Error(`content-type ${tipo}`);
    console.log(`  ok   /api/${c.f} (${r.status}${tipo ? ", " + tipo : ""})`);
  } catch (e) {
    falhas++;
    console.log(`  ERRO /api/${c.f}: ${e instanceof Error ? e.message : String(e)}`);
  } finally {
    process.chdir(antes);
  }
}
if (falhas) {
  console.log(`funções da Vercel: ${falhas} falha(s)`);
  process.exit(1);
}
console.log("funções da Vercel: compiladas como no deploy e respondendo");
