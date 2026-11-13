/* Checagem semanal do conteúdo (auditoria de QA, itens 17 e 19).
   1. Todo link de fonte oficial (questões, fichas, guia) ainda responde?
   2. Quantas questões têm data de revisão, e quais passaram de 12 meses?
   Uso: node scripts/conteudo-semanal.mjs  (escreve o resumo no
   $GITHUB_STEP_SUMMARY quando roda no Actions; sai com 1 se algum link quebrou) */
import { readFileSync, readdirSync, statSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const RAIZ = new URL("..", import.meta.url).pathname;
const CONTEUDO = join(RAIZ, "content");
const SIMULTANEOS = 6;
const TEMPO_MS = 15_000;
const UM_ANO = 365 * 864e5;

/* todo campo "u" com https dentro de qualquer JSON do conteúdo, com onde aparece */
function arquivos(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? arquivos(p) : n.endsWith(".json") ? [p] : [];
  });
}
export function extrairUrls(no, onde, saida = new Map()) {
  if (Array.isArray(no)) no.forEach((x) => extrairUrls(x, onde, saida));
  else if (no && typeof no === "object") {
    const aqui = typeof no.id === "string" ? `${onde}#${no.id}` : onde;
    for (const [k, v] of Object.entries(no)) {
      if ((k === "u" || k === "url") && typeof v === "string" && v.startsWith("https://")) {
        if (!saida.has(v)) saida.set(v, []);
        saida.get(v).push(aqui);
      } else extrairUrls(v, aqui, saida);
    }
  }
  return saida;
}
/* 403 e 429: o site bloqueia robô, não quer dizer que a página sumiu */
export function classificar(status) {
  if (status >= 200 && status < 400) return "ok";
  if (status === 403 || status === 429) return "bloqueado";
  return "quebrado";
}

async function checar(url) {
  for (const metodo of ["HEAD", "GET"]) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TEMPO_MS);
    try {
      const r = await fetch(url, {
        method: metodo,
        redirect: "follow",
        signal: ctrl.signal,
        headers: { "User-Agent": "CloudQuest-link-check/1.0" },
      });
      /* alguns sites recusam HEAD (405) mas respondem GET */
      if (metodo === "HEAD" && (r.status === 405 || r.status === 404)) continue;
      return { status: r.status, estado: classificar(r.status) };
    } catch (e) {
      if (metodo === "GET") return { status: 0, estado: "quebrado", erro: e.name === "AbortError" ? "tempo esgotado" : e.message };
    } finally {
      clearTimeout(t);
    }
  }
  return { status: 0, estado: "quebrado" };
}

async function main() {
  const urls = new Map();
  for (const f of arquivos(CONTEUDO)) extrairUrls(JSON.parse(readFileSync(f, "utf8")), f.slice(CONTEUDO.length + 1), urls);
  const lista = [...urls.keys()];
  const res = new Map();
  let i = 0;
  await Promise.all(
    Array.from({ length: SIMULTANEOS }, async () => {
      while (i < lista.length) {
        const u = lista[i++];
        res.set(u, await checar(u));
      }
    }),
  );
  const quebrados = lista.filter((u) => res.get(u).estado === "quebrado");
  const bloqueados = lista.filter((u) => res.get(u).estado === "bloqueado");

  /* revisão das questões */
  const hoje = Date.now();
  const questoes = ["az900", "az104", "saa", "clf"].flatMap((e) =>
    JSON.parse(readFileSync(join(CONTEUDO, "exams", e, "questions.json"), "utf8")),
  );
  const comRev = questoes.filter((q) => q.rev);
  const vencidas = comRev.filter((q) => hoje - Date.parse(q.rev) > UM_ANO);

  const linhas = [
    "## Checagem semanal do conteúdo",
    "",
    `- Links verificados: **${lista.length}** — quebrados: **${quebrados.length}**, bloqueando robô: ${bloqueados.length}`,
    `- Questões com data de revisão: **${comRev.length}** de ${questoes.length}; com mais de 12 meses: **${vencidas.length}**`,
    "",
  ];
  if (quebrados.length) {
    linhas.push("### Links quebrados", "", "| Status | URL | Onde |", "|---|---|---|");
    for (const u of quebrados) {
      const r = res.get(u);
      linhas.push(`| ${r.status || r.erro || "erro"} | ${u} | ${urls.get(u).slice(0, 3).join(", ")}${urls.get(u).length > 3 ? "…" : ""} |`);
    }
    linhas.push("");
  }
  if (vencidas.length) linhas.push("### Revisar (mais de 12 meses)", "", ...vencidas.map((q) => `- ${q.id} (revisada em ${q.rev})`), "");
  const texto = linhas.join("\n");
  console.log(texto);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, texto + "\n");
  process.exit(quebrados.length ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
