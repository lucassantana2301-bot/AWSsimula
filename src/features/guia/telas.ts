/**
 * Guia de serviços AWS: telas e ações (ADR-0001, fase 3).
 * Primeira tela inteira fora do motor legado. O motor fala com este módulo
 * por um contrato pequeno (`MotorGuia`) e só chama `tela()`/`acao()`.
 *
 * Diferenças em relação ao código antigo:
 * - todo texto passa por html`` (escape automático); URLs de fonte por url();
 * - treino só sorteia serviço que existe (antes, um id ausente quebrava a
 *   tela com `undefined.nome`);
 * - o estado de carregamento do guia (sob demanda) mora aqui.
 */
import type { Duelo, Servico } from "../../content/schema";
import { html, url, type Html } from "../../lib/html";
import { blocoVideos } from "./videos";

/* ---------- contrato com o motor ---------- */

export interface Treino {
  list: Pergunta[];
  i: number;
  ok: number;
  erros: string[];
  r?: number;
}
export interface Rota {
  name: string;
  id?: string;
  from?: string;
  dres?: Record<number, number>;
  gq?: string;
  gp?: string;
  gq2?: Treino;
}
export interface MotorGuia {
  rota(): Rota;
  ir(tela: string, o?: Partial<Rota>): void;
  render(): void;
  salvar(): void;
  ganharXp(n: number, motivo: string): void;
  aviso(msg: string, tipo?: "ok" | "no" | "fl"): void;
  /** S.guia: id do serviço -> quando foi aberto pela primeira vez */
  lidos(): Record<string, number>;
  emSessaoDeEstudo(): boolean;
}
export interface DadosGuia {
  GUIA: Servico[];
  DUELOS: Duelo[];
}

type Pergunta =
  | { p: string; t: string; certo: string; ops: string[]; rot?: undefined; certoK?: undefined }
  | { p: string; t: string; rot: string[]; certoK: number; certo?: undefined; ops?: undefined };

/* ---------- estado do módulo ---------- */

let motor: MotorGuia | null = null;
let GUIA: Servico[] = [];
let DUELOS: Duelo[] = [];
let carregar: (() => Promise<DadosGuia>) | null = null;
let carregando: Promise<void> | null = null;
let falhou = false;

const m = (): MotorGuia => {
  if (!motor) throw new Error("guia: motor não ligado");
  return motor;
};

/** Liga o guia ao motor. `inicial` vem preenchido nos testes; no app, `carregarGuia` baixa sob demanda. */
export function ligarGuia(mg: MotorGuia, inicial: DadosGuia, carregarGuia?: () => Promise<DadosGuia>): void {
  motor = mg;
  GUIA = inicial.GUIA;
  DUELOS = inicial.DUELOS;
  carregar = carregarGuia ?? null;
}

function pronto(): boolean {
  if (GUIA.length > 0) return true;
  if (!carregando && !falhou && carregar) {
    carregando = carregar()
      .then((g) => {
        GUIA = g.GUIA;
        DUELOS = g.DUELOS;
        carregando = null;
        m().render();
      })
      .catch(() => {
        carregando = null;
        falhou = true;
        m().aviso("Não deu para carregar o guia. Confira a conexão e tente de novo.", "no");
        m().render();
      });
  }
  return false;
}

/* ---------- utilitários ---------- */

const CATEGORIAS: readonly [Servico["cat"], string][] = [
  ["computacao", "Computação"],
  ["conteineres", "Contêineres"],
  ["integracao", "Integração e serverless"],
  ["armazenamento", "Armazenamento"],
  ["banco", "Bancos de dados"],
  ["migracao", "Migração e transferência"],
  ["rede", "Rede e entrega"],
  ["seguranca", "Segurança e identidade"],
  ["gestao", "Gestão e monitoramento"],
  ["custo", "Custo e cobrança"],
  ["dados", "Análise de dados"],
  ["ia", "IA e machine learning"],
  ["usuario", "Usuário final e IoT"],
];
const nomeCategoria = (c: string): string => CATEGORIAS.find((x) => x[0] === c)?.[1] ?? c;
export const semAcento = (t: string): string => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const servico = (id: string): Servico | undefined => GUIA.find((s) => s.id === id);
const duelo = (id: string): Duelo | undefined => DUELOS.find((d) => d.id === id);
const duelosDe = (id: string): Duelo[] => DUELOS.filter((d) => d.cols.some((c) => c.id === id));

function embaralhar<T>(a: readonly T[]): T[] {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const x = r[i] as T;
    r[i] = r[j] as T;
    r[j] = x;
  }
  return r;
}

const provas = (p: readonly string[]): Html[] => p.map((x) => html`<span class="tag aw mono">${x === "clf" ? "CLF" : "SAA"}</span> `);
const situacao = (s: Servico): Html | false =>
  s.status !== "ativo" &&
  html`<span class="tag no mono" title="${s.statusNota ?? ""}">${s.status === "fechado" ? "fechado para novos clientes" : "descontinuado"}</span>`;
const fontes = (src: readonly { t: string; u: string }[]): Html[] =>
  src.map((x, i) => html`${i > 0 && " · "}<a href="${url(x.u)}" target="_blank" rel="noopener noreferrer">${x.t}</a>`);

function telaCarregando(): Html {
  return html`<div class="stack-lg"><h1 class="t-xl">Guia de serviços AWS</h1>
    <p class="t-md dim" role="status" aria-live="polite">${carregando ? "Carregando o guia…" : "O guia não carregou."}</p>
    ${!carregando && html`<button class="btn fill sm" data-act="guia-retry" style="align-self:flex-start">Tentar de novo</button>`}</div>`;
}

/* ---------- telas ---------- */

function telaGuia(): Html {
  const V = m().rota();
  const lidos = Object.keys(m().lidos()).filter((id) => servico(id)).length;
  const porCategoria = CATEGORIAS.map(([c, n]) => [c, n, GUIA.filter((s) => s.cat === c)] as const).filter((x) => x[2].length > 0);
  const filtros: [string, string][] = [
    ["all", "Todas as provas"],
    ["clf", "Cai no CLF"],
    ["saa", "Cai no SAA"],
  ];
  return html`<div class="stack-lg">
    <section>
      <h1 class="t-xl">Guia de serviços AWS</h1>
      <p class="t-md dim" style="margin-top:7px;max-width:64ch">O que cada serviço é, explicado do zero, e como não confundir com os parecidos. Comece pelos duelos: eles comparam lado a lado o que a prova mais mistura.</p>
      <div class="row" style="margin-top:12px;gap:8px;flex-wrap:wrap">
        <button class="btn fill sm" data-act="gq-start">Treinar: qual é o serviço?</button>
        <span class="t-xs dim2">${lidos} de ${GUIA.length} serviços abertos</span>
      </div>
    </section>

    <section class="stack">
      <div class="hd"><h2>Duelos</h2><span class="n">${DUELOS.length} comparações</span></div>
      <div class="gd-grid">${DUELOS.map(
        (d) => html`<button class="gd-card" data-act="gduelo" data-id="${d.id}">
        <span class="t">${d.titulo}</span>
        <span class="c">${d.cols.map((c) => c.rot).join(" · ")}</span>
        <span class="p">${provas(d.provas)}</span></button>`,
      )}</div>
    </section>

    <section class="stack" id="glista">
      <div class="hd"><h2>Todos os serviços</h2><span class="n" id="gcount">${GUIA.length}</span></div>
      <label class="gs-busca"><span class="sr-only">Buscar serviço</span>
        <input id="gsearch" type="search" autocomplete="off" placeholder="Buscar: fila, cache, backup, S3…" value="${V.gq ?? ""}"></label>
      <div class="row" role="group" aria-label="Filtrar por prova" style="gap:6px;flex-wrap:wrap">
        ${filtros.map(([k, t]) => html`<button class="btn sm" data-act="gprova" data-p="${k}" aria-pressed="${(V.gp ?? "all") === k ? "true" : "false"}">${t}</button>`)}
      </div>
      <p class="t-sm dim" id="gvazio" hidden>Nenhum serviço encontrado. Tente outra palavra, como “fila”, “disco” ou “certificado”.</p>
      ${porCategoria.map(
        ([c, n, lista]) => html`<div class="gs-cat" data-cat="${c}">
        <h3 class="t-sm gs-h">${n}</h3>
        <div class="gs-grid">${lista.map(
          (s) => html`<button class="gs-card" data-act="gserv" data-id="${s.id}" data-p="${s.provas.join(" ")}"
          data-q="${semAcento([s.nome, s.uma, s.cat, nomeCategoria(s.cat), ...s.chave].join(" "))}">
          <span class="nm">${s.nome}${m().lidos()[s.id] !== undefined && html` <span class="dim2" aria-label="já aberto">·</span>`}</span>
          <span class="um">${s.uma}</span>
          <span class="pv">${provas(s.provas)}${situacao(s)}</span></button>`,
        )}</div>
      </div>`,
      )}
    </section>
  </div>`;
}

/** Filtro sem re-render: mantém o foco e o texto do campo de busca. */
export function filtrarGuia(): void {
  const V = m().rota();
  const campo = document.getElementById("gsearch");
  const q = semAcento(campo instanceof HTMLInputElement ? campo.value : "").trim();
  V.gq = q;
  const p = V.gp ?? "all";
  let n = 0;
  document.querySelectorAll<HTMLElement>(".gs-card").forEach((c) => {
    const okq = !q || q.split(/\s+/).every((t) => (c.dataset["q"] ?? "").includes(t));
    const okp = p === "all" || (c.dataset["p"] ?? "").split(" ").includes(p);
    c.hidden = !(okq && okp);
    if (!c.hidden) n++;
  });
  document.querySelectorAll<HTMLElement>(".gs-cat").forEach((g) => {
    g.hidden = ![...g.querySelectorAll<HTMLElement>(".gs-card")].some((c) => !c.hidden);
  });
  const ct = document.getElementById("gcount");
  if (ct) ct.textContent = String(n);
  const vz = document.getElementById("gvazio");
  if (vz) vz.hidden = n > 0;
}

function telaServico(): Html {
  const V = m().rota();
  const s = servico(V.id ?? "");
  if (!s) return telaGuia();
  const lidos = m().lidos();
  if (lidos[s.id] === undefined) {
    lidos[s.id] = Date.now();
    m().salvar();
  }
  const ds = duelosDe(s.id);
  const voltar =
    V.from === "study" && m().emSessaoDeEstudo()
      ? html`<button class="btn ghost sm" data-act="study-back" style="align-self:flex-start">← Voltar à questão</button>`
      : V.from === "simres"
        ? html`<button class="btn ghost sm" data-act="res-back" style="align-self:flex-start">← Voltar ao gabarito</button>`
        : html`<button class="btn ghost sm" data-act="guia" style="align-self:flex-start">← Guia de serviços</button>`;
  return html`<div class="stack-lg">
    ${voltar}
    <section>
      <p class="t-xs dim mono">${nomeCategoria(s.cat)}</p>
      <h1 class="t-xl" style="margin-top:2px">${s.nome}</h1>
      <p class="t-md" style="margin-top:7px;max-width:64ch">${s.uma}</p>
      <p style="margin-top:8px">${provas(s.provas)}${situacao(s)}</p>
      ${s.status !== "ativo" && html`<div class="note" style="margin-top:10px"><b>Situação atual.</b> ${s.statusNota ?? ""}</div>`}
    </section>
    <section class="gs-ana"><p class="t-xs dim">Pense assim</p><p class="t-md">${s.analogia}</p></section>
    <section class="sheet"><p class="t-md" style="line-height:1.55">${s.explica}</p>
      <p class="t-sm dim" style="margin-top:10px"><b>Como cobra:</b> ${s.preco}</p></section>
    <div class="gs-2">
      <section class="sheet"><h2 class="t-sm">Quando usar</h2><ul class="gs-ul">${s.usa.map((x) => html`<li>${x}</li>`)}</ul></section>
      <section class="sheet"><h2 class="t-sm">Quando não usar</h2><ul class="gs-ul no">${s.nao.map((x) => html`<li>${x}</li>`)}</ul></section>
    </div>
    ${blocoVideos(s.id)}
    <section class="stack">
      <div class="hd"><h2>Não confunda com</h2></div>
      ${s.confunde.map(
        (c) => html`<button class="gs-conf" data-act="gserv" data-id="${c.id}">
        <span class="nm">${servico(c.id)?.nome ?? c.id}</span><span class="t-sm">${c.dif}</span></button>`,
      )}
    </section>
    ${
      ds.length > 0 &&
      html`<section class="stack"><div class="hd"><h2>Duelos com ${s.nome}</h2></div>
      <div class="gd-grid">${ds.map(
        (d) => html`<button class="gd-card" data-act="gduelo" data-id="${d.id}"><span class="t">${d.titulo}</span>
        <span class="c">${d.cols.map((c) => c.rot).join(" · ")}</span></button>`,
      )}</div></section>`
    }
    <section class="sheet tight"><h2 class="t-sm">Sinais no enunciado</h2>
      <p style="margin-top:6px">${s.chave.map((k) => html`<span class="tag mono" style="margin:0 4px 4px 0">${k}</span>`)}</p></section>
    <p class="t-xs dim2">Fontes: ${fontes(s.src)}</p>
  </div>`;
}

function telaDuelo(): Html {
  const V = m().rota();
  const d = duelo(V.id ?? "");
  if (!d) return telaGuia();
  const resp = V.dres ?? {};
  const certos = d.sinais.filter((x, i) => resp[i] === x.r).length;
  const feitos = Object.keys(resp).length;
  const rotulo = (i: number): string => d.cols[i]?.rot ?? "";
  return html`<div class="stack-lg">
    <button class="btn ghost sm" data-act="guia" style="align-self:flex-start">← Guia de serviços</button>
    <section>
      <p class="t-xs dim mono">Duelo · ${nomeCategoria(d.cat)}</p>
      <h1 class="t-xl" style="margin-top:2px">${d.titulo}</h1>
      <p class="t-md dim" style="margin-top:7px;max-width:64ch">${d.intro}</p>
    </section>
    <section class="gdu" style="--n:${d.cols.length}">
      <div class="gdu-h"><span></span>${d.cols.map((c) =>
        c.id && servico(c.id)
          ? html`<button class="gdu-col" data-act="gserv" data-id="${c.id}">${c.rot}</button>`
          : html`<span class="gdu-col">${c.rot}</span>`,
      )}</div>
      ${d.linhas.map(
        (l) =>
          html`<div class="gdu-r"><span class="gdu-c">${l.c}</span>${l.v.map((v, i) => html`<span class="gdu-v" data-col="${rotulo(i)}">${v}</span>`)}</div>`,
      )}
    </section>
    <section class="gs-ana"><p class="t-xs dim">Pense assim</p><p class="t-md">${d.analogia}</p></section>
    <section class="stack">
      <div class="hd"><h2>Teste: qual deles?</h2><span class="n">${feitos ? `${String(certos)} de ${String(feitos)}` : `${String(d.sinais.length)} situações`}</span></div>
      ${d.sinais.map((x, i) => {
        const r = resp[i];
        const ok = r === x.r;
        return html`<div class="sheet tight gdu-q" ${r !== undefined && html`data-res="${ok ? "ok" : "no"}"`}>
          <p class="t-sm">${x.s}</p>
          ${
            r === undefined
              ? html`<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px">${d.cols.map(
                  (c, k) => html`<button class="btn sm" data-act="gdu-pick" data-i="${i}" data-k="${k}">${c.rot}</button>`,
                )}</div>`
              : html`<div class="row" style="gap:6px;flex-wrap:wrap;margin-top:8px">
               <span class="tag go">✓ ${rotulo(x.r)}</span>${!ok && html`<span class="tag no">✗ sua escolha: ${rotulo(r)}</span>`}</div>`
          }
        </div>`;
      })}
    </section>
    <div class="note"><b>Pegadinha.</b> ${d.pegadinha}</div>
    <p class="t-xs dim2">Fontes: ${fontes(d.src)}</p>
  </div>`;
}

/* ---------- treino "Qual é o serviço?" ----------
   Pergunta a partir da frase, da analogia, de um sinal de prova ou de um
   sinal de duelo. Distratores vêm de "não confunda com" e da mesma
   categoria, para treinar justamente a diferença. */
export function montarTreino(n: number): Pergunta[] {
  const ativos = GUIA.filter((s) => s.status === "ativo");
  const opcoes = (certo: Servico, vizinhos: string[]): string[] => {
    const pool = [
      ...new Set([
        ...vizinhos,
        ...ativos.filter((o) => o.cat === certo.cat && o.id !== certo.id).map((o) => o.id),
        ...embaralhar(ativos).map((o) => o.id),
      ]),
    ].filter((id) => id !== certo.id && servico(id));
    return embaralhar([certo.id, ...pool.slice(0, 3)]);
  };
  const qs: Pergunta[] = [];
  for (const s of embaralhar(ativos)) {
    const viz = s.confunde.map((c) => c.id);
    const tipo = Math.floor(Math.random() * 3);
    const t = tipo === 0 ? s.uma : tipo === 1 ? s.analogia : `“${s.chave[0] ?? s.nome}”`;
    const p =
      tipo === 0
        ? "Qual serviço é este?"
        : tipo === 1
          ? "Qual serviço esta analogia descreve?"
          : "No enunciado aparece este sinal. Qual serviço ele aponta?";
    qs.push({ p, t, certo: s.id, ops: opcoes(s, viz) });
  }
  for (const d of DUELOS)
    for (const x of d.sinais)
      qs.push({ p: `Duelo ${d.titulo.replace(/\?$/, "")}: qual deles?`, t: x.s, rot: d.cols.map((c) => c.rot), certoK: x.r });
  return embaralhar(qs).slice(0, n);
}

function telaTreino(): Html {
  const G = m().rota().gq2;
  if (!G) return telaGuia();
  const q = G.list[G.i];
  if (!q) {
    const t = G.list.length;
    const nota = t ? G.ok / t : 0;
    const revisar = [...new Set(G.erros)]
      .slice(0, 4)
      .map(servico)
      .filter((s): s is Servico => s !== undefined);
    return html`<div class="result enter">
      <h1 class="t-sm dim">Qual é o serviço?</h1>
      <div class="big ${nota >= 0.8 ? "ok" : nota >= 0.5 ? "" : "no"}">${G.ok} de ${t}</div>
      ${
        revisar.length > 0 &&
        html`<p class="t-sm" style="margin-top:8px">Vale abrir estes no guia:</p>
        <div class="lst" style="margin-top:6px;max-width:420px;margin-left:auto;margin-right:auto">${revisar.map(
          (s) => html`<button class="lst-i" data-act="gserv" data-id="${s.id}"><span class="nm">${s.nome}</span></button>`,
        )}</div>`
      }
      <div class="row" style="justify-content:center;margin-top:14px">
        <button class="btn fill" data-act="gq-start">Mais 10</button>
        <button class="btn" data-act="guia">Voltar ao guia</button>
      </div></div>`;
  }
  const rotulos = q.rot ?? q.ops.map((id) => servico(id)?.nome ?? id);
  const certoIdx = q.rot ? q.certoK : q.ops.indexOf(q.certo);
  const r = G.r;
  const respondido = r !== undefined;
  let retorno: Html | false = false;
  if (respondido) {
    if (q.rot) retorno = html`<p class="t-sm">${r === certoIdx ? "Certo." : `A resposta é ${q.rot[certoIdx] ?? ""}.`}</p>`;
    else {
      const s = servico(q.certo);
      const e = servico(q.ops[r] ?? "");
      const dif = s && e ? (s.confunde.find((x) => x.id === e.id) ?? e.confunde.find((x) => x.id === s.id)) : undefined;
      retorno = html`${s && html`<p class="t-sm"><b>${s.nome}</b>: ${s.uma}</p>`}
        ${r !== certoIdx && e && html`<p class="t-sm dim" style="margin-top:6px">${dif ? dif.dif : html`<b>${e.nome}</b>: ${e.uma}`}</p>`}`;
    }
  }
  return html`<div class="stack-lg">
    <div class="row"><h1 class="t-md">Qual é o serviço?</h1><span class="t-xs dim mono" style="margin-left:8px">${G.i + 1} de ${G.list.length}</span><span style="flex:1"></span><button class="btn ghost sm" data-act="guia">Sair</button></div>
    <section class="sheet">
      <p class="t-xs dim">${q.p}</p>
      <p class="t-lg" style="margin-top:6px">${q.t}</p>
      <div class="stack" style="margin-top:12px;gap:8px">${rotulos.map(
        (t, k) => html`<button class="opt" data-act="gq-pick" data-k="${k}" ${respondido && html`disabled`}
        ${respondido && k === certoIdx ? html`data-res="ok"` : r === k && html`data-res="bad"`}><span class="k">${"ABCD"[k] ?? ""}</span><span>${t}</span></button>`,
      )}</div>
      ${respondido && html`<div style="margin-top:12px">${retorno}<button class="btn fill sm" data-act="gq-next" style="margin-top:10px">Próxima</button></div>`}
    </section></div>`;
}

/** HTML da tela do guia pedida pelo motor ("guia", "serv", "duelo" ou "gq"). */
export function telaDoGuia(nome: string): Html {
  if (!pronto()) return telaCarregando();
  if (nome === "serv") return telaServico();
  if (nome === "duelo") return telaDuelo();
  if (nome === "gq") return telaTreino();
  return telaGuia();
}

/** Trata uma ação de clique do guia; devolve true se era dele. */
export function acaoDoGuia(a: string, alvo: HTMLElement): boolean {
  const mg = m();
  const V = mg.rota();
  const num = (k: string): number => Number(alvo.dataset[k]);
  switch (a) {
    case "guia":
      mg.ir("guia");
      return true;
    case "guia-retry":
      falhou = false;
      mg.render();
      return true;
    case "gserv": {
      const veioDoEstudo = V.name === "study" || (V.name === "serv" && V.from === "study");
      const veioDoGabarito = V.name === "simres" || (V.name === "serv" && V.from === "simres");
      const o: Partial<Rota> = { id: alvo.dataset["id"] ?? "" };
      if (veioDoEstudo) o.from = "study";
      else if (veioDoGabarito) o.from = "simres";
      mg.ir("serv", o);
      return true;
    }
    case "study-back":
      mg.ir(mg.emSessaoDeEstudo() ? "study" : "home");
      return true;
    case "gduelo":
      mg.ir("duelo", { id: alvo.dataset["id"] ?? "", dres: {} });
      return true;
    case "gprova":
      V.gp = alvo.dataset["p"] ?? "all";
      document.querySelectorAll('[data-act="gprova"]').forEach((x) => {
        x.setAttribute("aria-pressed", String(x === alvo));
      });
      filtrarGuia();
      return true;
    case "gdu-pick": {
      const i = num("i");
      const d = duelo(V.id ?? "");
      V.dres ??= {};
      if (d && V.dres[i] === undefined) {
        V.dres[i] = num("k");
        if (V.dres[i] === d.sinais[i]?.r) mg.ganharXp(2, "duelo");
        mg.render();
      }
      return true;
    }
    case "gq-start":
      mg.ir("gq", { gq2: { list: montarTreino(10), i: 0, ok: 0, erros: [] } });
      return true;
    case "gq-pick": {
      const G = V.gq2;
      const q = G?.list[G.i];
      if (!G || !q || G.r !== undefined) return true;
      G.r = num("k");
      const certo = q.rot ? q.certoK : q.ops.indexOf(q.certo);
      if (G.r === certo) {
        G.ok++;
        mg.ganharXp(2, "guia");
      } else if (!q.rot) G.erros.push(q.certo);
      mg.render();
      return true;
    }
    case "gq-next": {
      const G = V.gq2;
      if (G) {
        G.i++;
        delete G.r;
        mg.render();
        window.scrollTo(0, 0);
      }
      return true;
    }
    default:
      return false;
  }
}

export const TELAS_DO_GUIA = new Set(["guia", "serv", "duelo", "gq"]);
