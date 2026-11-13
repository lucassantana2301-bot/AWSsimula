/* Migração única (ADR-0001, fase 1): tira o conteúdo do código e grava em content/*.json.
   Lê os dados exatamente como o app os enxerga em tempo de execução: monta o
   script legado (scripts/build.mjs) e avalia com um DOM falso. Assim o JSON é
   idêntico ao que está no ar por construção, sem reinterpretar arquivo nenhum.
   Uso: node scripts/migrate/extract-content.mjs */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
execFileSync(process.execPath, [join(ROOT, "scripts", "build.mjs")], { stdio: "inherit" });
const legado = readFileSync(join(ROOT, "build", "all.js"), "utf8");

const el = () => ({ innerHTML: "", textContent: "", className: "", style: { setProperty() {} }, appendChild() {}, remove() {},
  querySelectorAll: () => [], dataset: {}, addEventListener() {}, scrollHeight: 0, clientHeight: 0, scrollTop: 0 });
const root = Object.assign(el(), { setAttribute() {}, removeAttribute() {} });
const ctx = {
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  document: { addEventListener() {}, querySelector: () => el(), getElementById: () => null, querySelectorAll: () => [], createElement: el, documentElement: root },
  location: { href: "https://x.test/", hash: "" }, navigator: {},
  setInterval: () => 0, clearInterval() {}, setTimeout: () => 0, clearTimeout() {}, requestAnimationFrame: () => 0,
  console,
};
ctx.window = { scrollTo() {}, addEventListener() {}, location: ctx.location };
vm.createContext(ctx);
vm.runInContext(legado + `
;globalThis.__OUT = { QUESTIONS, FICHAS, LESSONS, DIAGRAMS, EQUIV, EXAMS, CATALOGO, CATALOG_SYNCED, METAS, PROVIDERS, DECKS,
  GUIA: typeof GUIA !== "undefined" ? GUIA : [], DUELOS: typeof DUELOS !== "undefined" ? DUELOS : [] };`, ctx);
/* shuf e shufOrder são estado de execução (o motor embaralha as alternativas
   ao carregar); não podem virar conteúdo, ou a ordem de uma sessão se fixaria. */
const RUNTIME = new Set(["shuf", "shufOrder"]);
const C = JSON.parse(JSON.stringify(ctx.__OUT, (k, v) => (RUNTIME.has(k) ? undefined : v)));

const out = (rel, data) => {
  const p = join(ROOT, "content", rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
  return p;
};
const exames = C.EXAMS.map((e) => e.id);
const resumo = {};
out("exams.json", C.EXAMS);
out("catalogo.json", { synced: C.CATALOG_SYNCED, providers: C.PROVIDERS, metas: C.METAS, certs: C.CATALOGO });
out("equiv.json", C.EQUIV);
out("diagrams.json", C.DIAGRAMS);
for (const ex of exames) {
  const q = C.QUESTIONS.filter((x) => x.exam === ex);
  const f = C.FICHAS.filter((x) => x.exam === ex);
  const l = C.LESSONS.filter((x) => x.exam === ex);
  const d = C.DECKS.filter((x) => x.exam === ex);
  out(`exams/${ex}/questions.json`, q);
  out(`exams/${ex}/fichas.json`, f);
  out(`exams/${ex}/lessons.json`, l);
  out(`exams/${ex}/decks.json`, d);
  resumo[ex] = { questoes: q.length, fichas: f.length, aulas: l.length, baralhos: d.length };
}
/* aulas com exam:"both" valem para mais de uma prova (campo doms diz o domínio em cada uma) */
const compartilhadas = C.LESSONS.filter((x) => x.exam === "both");
out("shared/lessons.json", compartilhadas);
/* nada pode ficar de fora da divisão por prova */
for (const [nome, arr] of [["QUESTIONS", C.QUESTIONS], ["FICHAS", C.FICHAS], ["LESSONS", C.LESSONS.filter((x) => x.exam !== "both")], ["DECKS", C.DECKS]]) {
  const sobra = arr.filter((x) => !exames.includes(x.exam));
  if (sobra.length) throw new Error(`${nome}: ${sobra.length} itens com exam desconhecido`);
}
out("guia/servicos.json", C.GUIA);
out("guia/duelos.json", C.DUELOS);
console.log("Conteúdo extraído:", JSON.stringify(resumo), `guia ${C.GUIA.length} serviços, ${C.DUELOS.length} duelos`);
