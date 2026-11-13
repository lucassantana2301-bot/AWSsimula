/**
 * Simulado: montagem, nota e tela de revisão (ADR-0001, fase 3).
 * Tudo aqui é puro e testável; o motor legado guarda o estado (SIM) e só
 * chama estas funções. O sorteio aceita `rnd` para os testes serem estáveis.
 *
 * Correções em relação ao código antigo:
 * - a cota por domínio usa o maior resto: antes, o arredondamento podia
 *   passar de `n` e o corte final tirava questões só do último domínio;
 * - o peso "25-30%" vale o ponto médio (27,5), não o primeiro número;
 * - domínio sem questão no simulado não entra no peso da nota (antes, um
 *   simulado de um domínio só daria nota baixa mesmo acertando tudo).
 */
import { html, type Html } from "../../lib/html";

export type ModoSimulado = "curto" | "completo" | "dominio" | "erros";
export interface DominioPeso {
  id: string;
  w: string;
}
export interface Visto {
  ok: boolean;
  lastTs?: number;
}
export type Vistos = Readonly<Record<string, Visto | undefined>>;
interface QuestaoBase {
  id: string;
  dom: string;
}
type Rnd = () => number;

/* ---------- montagem ---------- */

/** "25-30%" → 27,5; "30%" → 30; texto sem número → 25 (peso neutro). */
export function pesoDoDominio(w: string): number {
  const nums = (w.match(/\d+(?:[.,]\d+)?/g) ?? []).map((x) => Number(x.replace(",", ".")));
  if (nums.length === 0) return 25;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** Reparte `n` vagas pelos pesos (método do maior resto). Soma sempre `n`. */
export function distribuir(n: number, pesos: readonly number[]): number[] {
  if (n <= 0 || pesos.length === 0) return pesos.map(() => 0);
  const tot = pesos.reduce((a, b) => a + Math.max(0, b), 0);
  const ideal = pesos.map((p) => (tot > 0 ? (Math.max(0, p) / tot) * n : n / pesos.length));
  const base = ideal.map(Math.floor);
  let falta = n - base.reduce((a, b) => a + b, 0);
  const ordem = ideal.map((v, i) => ({ i, resto: v - Math.floor(v) })).sort((a, b) => b.resto - a.resto || a.i - b.i);
  for (const { i } of ordem) {
    if (falta <= 0) break;
    base[i] = (base[i] ?? 0) + 1;
    falta--;
  }
  return base;
}

export function embaralhar<T>(lista: readonly T[], rnd: Rnd = Math.random): T[] {
  const r = lista.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const a = r[i] as T;
    r[i] = r[j] as T;
    r[j] = a;
  }
  return r;
}

/**
 * Ordem de preferência: inédita, depois errada, depois a acertada há mais
 * tempo. Simulados seguidos não repetem enquanto houver inéditas.
 */
export function porPrioridade<T extends QuestaoBase>(qs: readonly T[], vistos: Vistos, rnd: Rnd = Math.random): T[] {
  const faixa = (q: T): number => {
    const s = vistos[q.id];
    return !s ? 0 : s.ok ? 2 : 1;
  };
  const ts = (q: T): number => vistos[q.id]?.lastTs ?? 0;
  return embaralhar(qs, rnd)
    .map((q, i) => ({ q, i }))
    .sort((a, b) => faixa(a.q) - faixa(b.q) || (faixa(a.q) === 2 ? ts(a.q) - ts(b.q) : 0) || a.i - b.i)
    .map((x) => x.q);
}

/** Simulado na proporção oficial dos domínios; domínio curto é completado pelos outros. */
export function montarSimulado<T extends QuestaoBase>(
  banco: readonly T[],
  dominios: readonly DominioPeso[],
  n: number,
  vistos: Vistos,
  rnd: Rnd = Math.random,
): T[] {
  const cotas = distribuir(
    Math.min(n, banco.length),
    dominios.map((d) => pesoDoDominio(d.w)),
  );
  const escolhidas = new Set<T>();
  dominios.forEach((d, i) => {
    for (const q of porPrioridade(
      banco.filter((x) => x.dom === d.id),
      vistos,
      rnd,
    ).slice(0, cotas[i]))
      escolhidas.add(q);
  });
  if (escolhidas.size < n)
    for (const q of porPrioridade(
      banco.filter((x) => !escolhidas.has(x)),
      vistos,
      rnd,
    )) {
      if (escolhidas.size >= n) break;
      escolhidas.add(q);
    }
  return embaralhar([...escolhidas], rnd);
}

export function montarPorDominio<T extends QuestaoBase>(
  banco: readonly T[],
  dom: string,
  n: number,
  vistos: Vistos,
  rnd: Rnd = Math.random,
): T[] {
  return embaralhar(
    porPrioridade(
      banco.filter((q) => q.dom === dom),
      vistos,
      rnd,
    ).slice(0, n),
    rnd,
  );
}

/** Só as que a pessoa errou da última vez, das erradas mais recentes para as antigas. */
export function errosDoBanco<T extends QuestaoBase>(banco: readonly T[], vistos: Vistos): T[] {
  return banco.filter((q) => vistos[q.id]?.ok === false).sort((a, b) => (vistos[b.id]?.lastTs ?? 0) - (vistos[a.id]?.lastTs ?? 0));
}
export function montarErros<T extends QuestaoBase>(banco: readonly T[], vistos: Vistos, n: number, rnd: Rnd = Math.random): T[] {
  return embaralhar(errosDoBanco(banco, vistos).slice(0, n), rnd);
}

/** Mesmo ritmo do simulado curto, com piso de 5 minutos. */
export function minutosProporcionais(simMin: number, simQ: number, n: number): number {
  if (n <= 0 || simQ <= 0) return 5;
  return Math.max(5, Math.ceil((simMin / simQ) * n));
}

/* ---------- prova completa ---------- */

export interface EspecProva {
  realQ: string;
  realMin: number;
  fullQ?: number | undefined;
}
/** Quantidade fixa da prova completa: `fullQ` quando a prova real tem faixa ("40-60"). */
export function especCompleta(e: EspecProva): { q: number; min: number } | null {
  if (e.fullQ) return { q: e.fullQ, min: e.realMin };
  const q = Number(e.realQ.trim());
  return Number.isInteger(q) && q > 0 && e.realMin > 0 ? { q, min: e.realMin } : null;
}
/** Só oferece a prova completa com folga de 1,5 questão por vaga; senão vira repetição. */
export function completaDisponivel(e: EspecProva, tamanhoBanco: number): boolean {
  const f = especCompleta(e);
  return !!f && tamanhoBanco >= Math.ceil(f.q * 1.5);
}

/* ---------- nota ---------- */

export type PorDominio = Readonly<Record<string, { n: number; ok: number } | undefined>>;
/** Escala 300 a 1000 ponderada pelo peso oficial; domínio ausente não pesa. */
export function notaEscalonada(porDominio: PorDominio, dominios: readonly DominioPeso[]): number {
  let ws = 0;
  let acc = 0;
  for (const d of dominios) {
    const b = porDominio[d.id];
    if (!b || b.n === 0) continue;
    const w = pesoDoDominio(d.w);
    ws += w;
    acc += w * (b.ok / b.n);
  }
  return Math.round(300 + 700 * (ws > 0 ? acc / ws : 0));
}

/* ---------- textos ---------- */

export function rotuloModo(modo: ModoSimulado, nomeDominio?: string): string {
  switch (modo) {
    case "completo":
      return "Prova completa";
    case "dominio":
      return nomeDominio ? `Simulado do domínio: ${nomeDominio}` : "Simulado por domínio";
    case "erros":
      return "Refazer as que errei";
    default:
      return "Simulado curto";
  }
}
/** Domínio e erros não contam para a prontidão: medem só um pedaço do exame. */
export const contaParaProntidao = (modo: ModoSimulado | undefined): boolean => modo !== "dominio" && modo !== "erros";

export function relogio(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
export const classeRelogio = (ms: number): string => (ms < 12e4 ? "crit" : ms < 3e5 ? "warn" : "");

/* ---------- tela de revisão antes da entrega ---------- */

export interface EstadoRevisao {
  codigo: string;
  rotulo: string;
  aws: boolean;
  restanteMs: number;
  respondidas: readonly boolean[];
  marcadas: readonly boolean[];
}

export function telaRevisao(r: EstadoRevisao): Html {
  const total = r.respondidas.length;
  const feitas = r.respondidas.filter(Boolean).length;
  const branco = total - feitas;
  const nMarc = r.marcadas.filter(Boolean).length;
  const primeiraMarcada = r.marcadas.findIndex(Boolean);
  const primeiraBranco = r.respondidas.findIndex((x) => !x);
  const estado = (i: number): string => (r.marcadas[i] ? "flag" : r.respondidas[i] ? "ans" : "");
  const rotuloQ = (i: number): string =>
    `Questão ${String(i + 1)}: ${r.marcadas[i] ? "marcada" : r.respondidas[i] ? "respondida" : "em branco"}`;
  return html`<div class="stack">
    <div class="sim-bar">
      <span class="tag ${r.aws ? "aw" : "az"} mono">${r.codigo} · revisão</span>
      <span class="clock ${classeRelogio(r.restanteMs)}" id="simclock">${relogio(r.restanteMs)}</span>
      <span style="flex:1"></span>
      <button class="btn sm" data-act="simback">Voltar à questão</button>
    </div>
    <section class="sheet stack" aria-labelledby="rev-h">
      <div>
        <h1 class="t-lg" id="rev-h">Revisão antes da entrega</h1>
        <p class="t-xs dim" style="margin-top:2px">${r.rotulo}</p>
      </div>
      <div class="rev-n" role="list">
        <div role="listitem"><b class="mono">${feitas}</b><span class="t-xs dim">respondidas</span></div>
        <div role="listitem" data-st="${branco > 0 ? "no" : ""}"><b class="mono">${branco}</b><span class="t-xs dim">em branco</span></div>
        <div role="listitem" data-st="${nMarc > 0 ? "fl" : ""}"><b class="mono">${nMarc}</b><span class="t-xs dim">marcadas</span></div>
      </div>
      <div class="row" style="gap:6px">
        <button class="btn sm" data-act="simgo" data-i="${Math.max(0, primeiraBranco)}" ${primeiraBranco < 0 ? "disabled" : ""}>Ir para a primeira em branco</button>
        <button class="btn sm" data-act="simgo" data-i="${Math.max(0, primeiraMarcada)}" ${primeiraMarcada < 0 ? "disabled" : ""}>Revisar marcadas</button>
      </div>
      <div class="qnav" role="group" aria-label="Todas as questões">${r.respondidas.map(
        (_, i) => html`<button data-act="simgo" data-i="${i}" data-st="${estado(i)}" aria-label="${rotuloQ(i)}">${i + 1}</button>`,
      )}</div>
      <p class="t-xs dim2 rev-leg"><span class="k ans" aria-hidden="true"></span> respondida <span class="k flag" aria-hidden="true"></span> marcada <span class="k" aria-hidden="true"></span> em branco</p>
      ${branco > 0 && html`<p class="note">Questão em branco conta como erro e não existe penalidade por chute: responda todas antes de entregar.</p>`}
    </section>
    <div class="row">
      <button class="btn" data-act="simback">Continuar respondendo</button>
      <button class="btn ${r.aws ? "aw" : "az"}" style="flex:1" data-act="simfinish">Entregar agora</button>
    </div>
  </div>`;
}

/* ---------- reportar questão ---------- */

export const MOTIVOS_REPORTE = [
  ["gabarito", "Gabarito parece errado"],
  ["texto", "Texto confuso ou com erro"],
  ["desatualizada", "Conteúdo desatualizado"],
] as const;
export type MotivoReporte = (typeof MOTIVOS_REPORTE)[number][0];
export const motivoValido = (m: string): m is MotivoReporte => MOTIVOS_REPORTE.some(([k]) => k === m);

export function blocoReportar(id: string, jaReportada: boolean): Html {
  if (jaReportada) return html`<p class="t-xs dim2 reportar">Obrigado, problema reportado.</p>`;
  return html`<details class="reportar">
    <summary class="t-xs dim">Reportar problema nesta questão</summary>
    <div class="row" style="gap:6px;margin-top:6px">${MOTIVOS_REPORTE.map(
      ([k, t]) => html`<button class="btn sm ghost" data-act="qreport" data-q="${id}" data-m="${k}">${t}</button>`,
    )}</div>
  </details>`;
}
