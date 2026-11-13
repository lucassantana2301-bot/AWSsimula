/**
 * Armazenamento do progresso (auditoria de QA, itens 1, 2, 4, 6, 28 e 40).
 *
 * Regras:
 * - nunca jogar fora um progresso salvo: se o que está no navegador não puder
 *   ser lido, guarda a cópia bruta antes de qualquer coisa sobrescrever;
 * - salvar diz se deu certo (cota cheia não pode ser silenciosa);
 * - o que vem de fora (arquivo importado, conta na nuvem) passa por schema
 *   estrito; o que o próprio app gravou passa por uma checagem leve, para
 *   não descartar o progresso de alguém por causa de um campo novo.
 */
/* Validação à mão, sem Zod: este módulo vai no pacote de abertura, e o Zod
   custava 28 KB gzip (e tentava new Function, barrado pela CSP). */

export type Estado = Record<string, unknown>;

/** Só o necessário de Storage: testável com um objeto simples. */
export interface Armazem {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
  key(i: number): string | null;
  readonly length: number;
}

export const CHAVE = "cloudquest.v2";
export const PREFIXO_BACKUP = "cloudquest.backup.";
export const MAX_BACKUPS = 3;
/** Arquivo de progresso real fica na casa das dezenas de KB; 2 MB é folga larga. */
export const LIMITE_IMPORT = 2 * 1024 * 1024;

/* ---------- regras estritas (para o que vem de fora) ---------- */

const ehObjeto = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);
const contagem = (x: unknown): boolean => typeof x === "number" && Number.isInteger(x) && x >= 0 && x <= 1e9;
const finito = (x: unknown): boolean => typeof x === "number" && Number.isFinite(x);
const EXAME = /^[a-z0-9]{2,12}$/;
const DATA = /^\d{4}-\d{2}-\d{2}$/;
const DOMINIO = /^d\d$/;
const opcional = (x: unknown, ok: (v: unknown) => boolean): boolean => x === undefined || ok(x);
const mapa = (x: unknown, chave: RegExp | null, valor: (v: unknown) => boolean): boolean =>
  ehObjeto(x) && Object.entries(x).every(([k, v]) => (!chave || chave.test(k)) && valor(v));

function simuladoValido(x: unknown): boolean {
  if (!ehObjeto(x)) return false;
  const score = x["score"];
  return (
    typeof x["exam"] === "string" &&
    EXAME.test(x["exam"]) &&
    typeof score === "number" &&
    Number.isInteger(score) &&
    score >= 0 &&
    score <= 1000 &&
    typeof x["pass"] === "boolean" &&
    contagem(x["right"]) &&
    contagem(x["total"]) &&
    finito(x["ts"]) &&
    opcional(x["byDom"], (b) => mapa(b, DOMINIO, (d) => ehObjeto(d) && contagem(d["n"]) && contagem(d["ok"])))
  );
}

/** Progresso vindo de arquivo ou da conta: tipos que o app usa em telas e contas. Campos extras passam. */
export function validarEstado(x: unknown): x is Estado {
  if (!ehObjeto(x) || x["v"] !== 2 || !contagem(x["xp"])) return false;
  return (
    opcional(x["streak"], contagem) &&
    opcional(x["lives"], contagem) &&
    opcional(x["seen"], ehObjeto) &&
    opcional(x["fichas"], ehObjeto) &&
    opcional(x["concepts"], ehObjeto) &&
    opcional(x["dates"], (d) => mapa(d, EXAME, (v) => typeof v === "string" && DATA.test(v))) &&
    opcional(x["dias"], (d) => mapa(d, DATA, finito)) &&
    opcional(x["sims"], (s) => Array.isArray(s) && s.length <= 200 && s.every(simuladoValido)) &&
    opcional(x["theme"], (t) => t === "auto" || t === "dark" || t === "light") &&
    opcional(x["upd"], finito)
  );
}

/* ---------- leitura do que o próprio app gravou ---------- */

export type Problema = "corrompido" | "versao";
export interface Leitura {
  estado: Estado | null;
  problema: Problema | null;
}

/** Lê o texto salvo. `problema` diferente de null = havia algo que não deu para usar. */
export function interpretar(bruto: string | null): Leitura {
  if (bruto === null || bruto === "") return { estado: null, problema: null };
  let dado: unknown;
  try {
    dado = JSON.parse(bruto);
  } catch {
    return { estado: null, problema: "corrompido" };
  }
  if (!dado || typeof dado !== "object" || Array.isArray(dado)) return { estado: null, problema: "corrompido" };
  if ((dado as Estado)["v"] !== 2) return { estado: null, problema: "versao" };
  return { estado: dado as Estado, problema: null };
}

/* ---------- cópias de segurança ---------- */

export function listarBackups(a: Armazem): string[] {
  const chaves: string[] = [];
  for (let i = 0; i < a.length; i++) {
    const k = a.key(i);
    if (k?.startsWith(PREFIXO_BACKUP)) chaves.push(k);
  }
  /* o sufixo é um carimbo de tempo de largura fixa: ordem de texto = ordem de tempo */
  return chaves.sort().reverse();
}

/** Guarda uma cópia e mantém só as MAX_BACKUPS mais novas. Devolve a chave, ou null se não coube. */
export function guardarBackup(a: Armazem, bruto: string, agora: number = Date.now()): string | null {
  const chave = PREFIXO_BACKUP + String(agora).padStart(15, "0");
  try {
    a.setItem(chave, bruto);
  } catch {
    return null;
  }
  for (const velha of listarBackups(a).slice(MAX_BACKUPS)) a.removeItem(velha);
  return chave;
}

/* ---------- gravação ---------- */

export type ResultadoSalvar = "ok" | "cota" | "indisponivel";

function cotaEstourada(e: unknown): boolean {
  if (!(e instanceof Error)) return false;
  const codigo = (e as Error & { code?: number }).code;
  return e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED" || codigo === 22 || codigo === 1014;
}

export function salvarEstado(a: Armazem | null, estado: Estado): ResultadoSalvar {
  if (!a) return "indisponivel";
  try {
    a.setItem(CHAVE, JSON.stringify(estado));
    return "ok";
  } catch (e) {
    return cotaEstourada(e) ? "cota" : "indisponivel";
  }
}

/* ---------- importação ---------- */

export interface Resumo {
  xp: number;
  simulados: number;
  questoes: number;
  atualizado: number | null;
}
export function resumir(e: Estado): Resumo {
  const n = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);
  const obj = (v: unknown): number => (v && typeof v === "object" ? Object.keys(v).length : 0);
  return {
    xp: n(e["xp"]),
    simulados: Array.isArray(e["sims"]) ? e["sims"].length : 0,
    questoes: obj(e["seen"]),
    atualizado: typeof e["upd"] === "number" ? e["upd"] : null,
  };
}

export type ResultadoImport = { ok: true; estado: Estado; resumo: Resumo } | { ok: false; erro: string };

export function lerImportacao(texto: string): ResultadoImport {
  if (texto.length > LIMITE_IMPORT) return { ok: false, erro: "Arquivo grande demais para ser um progresso do CloudQuest" };
  let dado: unknown;
  try {
    dado = JSON.parse(texto);
  } catch {
    return { ok: false, erro: "Não consegui ler esse arquivo" };
  }
  if (!validarEstado(dado)) return { ok: false, erro: "Arquivo não parece um progresso do CloudQuest" };
  return { ok: true, estado: dado, resumo: resumir(dado) };
}

/* ---------- persistência do navegador ---------- */

/**
 * Pede ao navegador para não apagar os dados do site sob pressão de espaço
 * (o Safari, por exemplo, apaga dados de site sem visita há 7 dias).
 * null = o navegador não oferece a API.
 */
export async function pedirPersistencia(nav: {
  storage?: { persist?: () => Promise<boolean>; persisted?: () => Promise<boolean> };
}): Promise<boolean | null> {
  const s = nav.storage;
  if (!s?.persist) return null;
  try {
    if (s.persisted && (await s.persisted())) return true;
    return await s.persist();
  } catch {
    return false;
  }
}
