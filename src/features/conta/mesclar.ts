/**
 * Junta o progresso deste aparelho com o salvo na conta.
 *
 * Regra geral: progresso nunca anda para trás. Cada campo tem uma regra
 * explícita (máximo, união, o mais recente); campo desconhecido fica com o
 * estado editado por último. A função é pura, comutativa nos campos de
 * progresso e idempotente: mesclar(a, a) = a.
 */

export type Estado = Record<string, unknown>;
type Mapa = Record<string, unknown>;

const ehMapa = (x: unknown): x is Mapa => typeof x === "object" && x !== null && !Array.isArray(x);
const num = (x: unknown): number => (typeof x === "number" && Number.isFinite(x) ? x : 0);
const campo = (x: unknown, k: string): unknown => (ehMapa(x) ? x[k] : undefined);

/** Quando este estado foi salvo pela última vez (ms). */
export const editadoEm = (e: Estado): number => num(e["upd"]);

/** Une dois mapas chave a chave, escolhendo o valor com `escolhe`. */
function porChave(a: unknown, b: unknown, escolhe: (x: unknown, y: unknown) => unknown): Mapa {
  const ma = ehMapa(a) ? a : {};
  const mb = ehMapa(b) ? b : {};
  const out: Mapa = {};
  for (const k of new Set([...Object.keys(ma), ...Object.keys(mb)])) {
    const x = ma[k];
    const y = mb[k];
    out[k] = x === undefined ? y : y === undefined ? x : escolhe(x, y);
  }
  return out;
}

/* conceito: vale a revisão mais recente (FSRS grava `last`); empate, mais revisões */
const conceito = (x: unknown, y: unknown): unknown => {
  const lx = num(campo(x, "last")) || num(campo(x, "due"));
  const ly = num(campo(y, "last")) || num(campo(y, "due"));
  if (lx !== ly) return lx > ly ? x : y;
  return num(campo(x, "n")) >= num(campo(y, "n")) ? x : y;
};
/* questão vista: a resposta mais recente, mas o total de vezes é o maior */
const vista = (x: unknown, y: unknown): unknown => {
  const recente = num(campo(x, "lastTs")) >= num(campo(y, "lastTs")) ? x : y;
  return ehMapa(recente) ? { ...recente, n: Math.max(num(campo(x, "n")), num(campo(y, "n"))) } : recente;
};
/* concluído (true ou timestamp): concluído vence; entre timestamps, o maior */
const concluido = (x: unknown, y: unknown): unknown => {
  if (typeof x === "number" && typeof y === "number") return Math.max(x, y);
  return x || y;
};
/* conquista: a primeira vez que foi desbloqueada */
const conquista = (x: unknown, y: unknown): unknown => (typeof x === "number" && typeof y === "number" ? Math.min(x, y) : x || y);
const maisUsado = (x: unknown, y: unknown): unknown => (num(campo(x, "n")) >= num(campo(y, "n")) ? x : y);
const deck = (x: unknown, y: unknown): unknown => ({
  ...(ehMapa(x) ? x : {}),
  ...(ehMapa(y) ? y : {}),
  n: Math.max(num(campo(x, "n")), num(campo(y, "n"))),
  melhor: Math.max(num(campo(x, "melhor")), num(campo(y, "melhor"))),
});

/** Listas de registros com `ts` (simulados, sprints, desafios): união sem repetir. */
function historico(a: unknown, b: unknown, max = 60): unknown[] {
  const todos: unknown[] = [...(Array.isArray(a) ? (a as unknown[]) : []), ...(Array.isArray(b) ? (b as unknown[]) : [])];
  const vistos = new Set<string>();
  const out: unknown[] = [];
  for (const r of todos) {
    const chave = JSON.stringify([campo(r, "ts"), campo(r, "exam"), campo(r, "score")]);
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    out.push(r);
  }
  out.sort((x, y) => num(campo(y, "ts")) - num(campo(x, "ts")));
  return out.slice(0, max);
}

export function mesclar(local: Estado, remoto: Estado): Estado {
  const novo = editadoEm(remoto) > editadoEm(local) ? remoto : local;
  const velho = novo === local ? remoto : local;
  /* base: o mais recente (preferências, tema, sessão em andamento, campos novos) */
  const out: Estado = { ...velho, ...novo };

  for (const k of ["xp", "answered", "bestCombo"]) out[k] = Math.max(num(local[k]), num(remoto[k]));

  /* contadores do dia e da semana só se somam no mesmo dia/semana */
  for (const [valor, chave] of [
    ["todayXp", "dayKeyCur"],
    ["weekXp", "weekKey"],
  ] as const) {
    const mesmo = local[chave] === remoto[chave];
    out[valor] = mesmo ? Math.max(num(local[valor]), num(remoto[valor])) : novo[valor];
  }

  /* ofensiva: quem estudou por último manda; mesmo dia, a maior */
  const dl = typeof local["lastDay"] === "string" ? local["lastDay"] : "";
  const dr = typeof remoto["lastDay"] === "string" ? remoto["lastDay"] : "";
  const ofensiva = dl === dr ? (num(local["streak"]) >= num(remoto["streak"]) ? local : remoto) : dl > dr ? local : remoto;
  out["lastDay"] = ofensiva["lastDay"] ?? null;
  out["streak"] = num(ofensiva["streak"]);
  out["shields"] = num(ofensiva["shields"]);
  const ddl = typeof local["dailyDone"] === "string" ? local["dailyDone"] : "";
  const ddr = typeof remoto["dailyDone"] === "string" ? remoto["dailyDone"] : "";
  out["dailyDone"] = (ddl > ddr ? ddl : ddr) || null;

  out["concepts"] = porChave(local["concepts"], remoto["concepts"], conceito);
  out["seen"] = porChave(local["seen"], remoto["seen"], vista);
  for (const k of ["fichas", "lessons", "bosses", "guia"]) out[k] = porChave(local[k], remoto[k], concluido);
  /* dicas vistas: uma vez vista num aparelho, não volta no outro. Estado antigo sem o campo
     continua sem ele (mesclar(a, a) = a). */
  if (ehMapa(local["dicas"]) || ehMapa(remoto["dicas"])) out["dicas"] = porChave(local["dicas"], remoto["dicas"], concluido);
  out["ach"] = porChave(local["ach"], remoto["ach"], conquista);
  /* XP por dia: o mesmo dia estudado em dois aparelhos fica com o maior */
  out["dias"] = porChave(local["dias"], remoto["dias"], (x, y) => Math.max(num(x), num(y)));
  out["cards"] = porChave(local["cards"], remoto["cards"], maisUsado);
  out["decks"] = porChave(local["decks"], remoto["decks"], deck);
  for (const k of ["sims", "sprints", "challenges"]) out[k] = historico(local[k], remoto[k]);

  out["upd"] = Math.max(editadoEm(local), editadoEm(remoto));
  return out;
}

/** Verdadeiro quando o estado tem algum progresso de verdade (não é um app recém-aberto). */
export function temProgresso(e: Estado): boolean {
  return num(e["xp"]) > 0 || num(e["answered"]) > 0 || (ehMapa(e["fichas"]) && Object.keys(e["fichas"]).length > 0);
}
