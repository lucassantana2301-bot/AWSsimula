/* Orçamento de tamanho (ADR-0001): mede o que o celular baixa na primeira
   visita (JS e CSS referenciados pelo index.html, comprimidos com gzip) e
   falha o build se passar do teto. Os tetos só podem descer. */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const ORCAMENTO_KB = { js: 450, css: 80 }; /* fase 1; a fase 2 reduz o JS */

const html = readFileSync(join(DIST, "index.html"), "utf8");
const refs = [...html.matchAll(/(?:src|href)="\/(assets\/[^"]+\.(js|css))"/g)].map((m) => ({ arq: m[1], tipo: m[2] }));
/* módulos importados pelo ponto de entrada também são carga inicial; o motor
   entra por import() dinâmico, mas na abertura, então conta igual */
const assets = readdirSync(join(DIST, "assets"));
const iniciais = new Set(refs.map((r) => r.arq));
for (const r of refs.filter((x) => x.tipo === "js")) {
  const codigo = readFileSync(join(DIST, r.arq), "utf8");
  /* qualquer arquivo de assets/ citado pelo ponto de entrada (import, import() ou lista de pré-carga) */
  for (const m of codigo.matchAll(/(?:\.\/|assets\/)([\w.-]+\.js)/g)) {
    const nome = m[1];
    if (nome && assets.includes(nome)) iniciais.add(`assets/${nome}`);
  }
}
const soma = { js: 0, css: 0 };
for (const arq of iniciais) {
  const tipo = arq.endsWith(".css") ? "css" : "js";
  soma[tipo] += gzipSync(readFileSync(join(DIST, arq))).length;
}
let falhou = false;
for (const tipo of ["js", "css"]) {
  const kb = Math.round(soma[tipo] / 1024);
  const ok = kb <= ORCAMENTO_KB[tipo];
  if (!ok) falhou = true;
  console.log(`${ok ? "OK " : "ACIMA"} carga inicial ${tipo.toUpperCase()}: ${kb} KB gzip (teto ${ORCAMENTO_KB[tipo]} KB)`);
}
process.exit(falhou ? 1 : 0);
