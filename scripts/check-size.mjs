/* Orçamento de tamanho (ADR-0001). Usa o manifesto do Vite para separar o
   que o celular baixa na abertura (entrada + imports estáticos + o motor,
   que é importado na abertura) do que só baixa sob demanda (guia etc.).
   Mede gzip e falha o build acima do teto. Os tetos só podem descer. */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const ORCAMENTO_KB = { js: 340, css: 15, fontes: 70 };
/* módulos importados dinamicamente, mas na abertura: contam como iniciais */
const NA_ABERTURA = ["src/legacy/engine.js"];

const manifesto = JSON.parse(readFileSync(join(DIST, ".vite", "manifest.json"), "utf8"));
const entrada = Object.entries(manifesto).find(([, v]) => v.isEntry);
if (!entrada) throw new Error("manifesto sem entrada");

const iniciais = new Set();
const visita = (chave) => {
  const m = manifesto[chave];
  if (!m || iniciais.has(chave)) return;
  iniciais.add(chave);
  for (const i of m.imports ?? []) visita(i);
};
visita(entrada[0]);
for (const k of NA_ABERTURA) visita(k);

const gz = (arq) => gzipSync(readFileSync(join(DIST, arq))).length;
const soma = { js: 0, css: 0, fontes: 0 };
const vistos = new Set();
for (const k of iniciais) {
  const m = manifesto[k];
  if (!vistos.has(m.file)) {
    vistos.add(m.file);
    soma.js += gz(m.file);
  }
  for (const c of m.css ?? [])
    if (!vistos.has(c)) {
      vistos.add(c);
      soma.css += gz(c);
    }
  for (const a of m.assets ?? [])
    if (a.endsWith(".woff2") && !vistos.has(a)) {
      vistos.add(a);
      soma.fontes += readFileSync(join(DIST, a)).length;
    }
}
/* fontes referenciadas pelo CSS inicial */
for (const [, m] of Object.entries(manifesto))
  if (m.file.endsWith(".woff2") && !vistos.has(m.file)) {
    vistos.add(m.file);
    soma.fontes += readFileSync(join(DIST, m.file)).length;
  }

let falhou = false;
for (const tipo of ["js", "css", "fontes"]) {
  const kb = Math.round(soma[tipo] / 1024);
  const ok = kb <= ORCAMENTO_KB[tipo];
  if (!ok) falhou = true;
  console.log(
    `${ok ? "OK " : "ACIMA"} abertura ${tipo.padEnd(6)} ${String(kb).padStart(4)} KB${tipo === "fontes" ? " (woff2)" : " gzip"} (teto ${ORCAMENTO_KB[tipo]} KB)`,
  );
}
const sobDemanda = Object.values(manifesto).filter(
  (m) => m.file.endsWith(".js") && ![...iniciais].some((k) => manifesto[k].file === m.file),
);
for (const m of sobDemanda) console.log(`    sob demanda: ${m.src ?? m.file} ${Math.round(gz(m.file) / 1024)} KB gzip`);
/* dados baixados por fetch() (guia): JSON com hash em assets/ */
for (const f of readdirSync(join(DIST, "assets")).filter((n) => n.endsWith(".json")))
  console.log(`    sob demanda: assets/${f} ${Math.round(gz(join("assets", f)) / 1024)} KB gzip`);
process.exit(falhou ? 1 : 0);
