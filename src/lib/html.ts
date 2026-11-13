/**
 * Template de HTML com escape automático (ADR-0001, fase 3).
 *
 *   html`<p class="${classe}">${texto}</p>`
 *
 * Todo valor interpolado é escapado, a não ser que já seja um `Html` (o
 * resultado de outro html`...`) ou tenha passado por `confiavel()`. Assim o
 * caminho seguro é o padrão, e o inseguro fica explícito e fácil de achar
 * numa revisão (grep "confiavel(").
 *
 * - string/número: escapados (& < > " ' `)
 * - null/undefined/false: viram nada (permite ${cond && html`...`})
 * - true: proibido (quase sempre é um erro de condicional)
 * - lista: cada item é tratado pelas mesmas regras e concatenado
 */
const MARCA: unique symbol = Symbol("html");

export interface Html {
  readonly [MARCA]: true;
  readonly texto: string;
  toString(): string;
}

export type Valor = string | number | false | null | undefined | Html | readonly Valor[];

const MAPA: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;", "`": "&#96;" };
export const escapar = (s: string): string => s.replace(/[&<>"'`]/g, (c) => MAPA[c] ?? c);

const criar = (texto: string): Html => ({ [MARCA]: true, texto, toString: () => texto });
export const ehHtml = (v: unknown): v is Html => typeof v === "object" && v !== null && MARCA in v;

function render(v: Valor | true): string {
  if (v === null || v === undefined || v === false) return "";
  if (v === true) throw new TypeError("html: valor booleano true interpolado (use uma condição que devolva html ou nada)");
  if (typeof v === "number") {
    if (!Number.isFinite(v)) throw new TypeError(`html: número inválido interpolado (${String(v)})`);
    return String(v);
  }
  if (typeof v === "string") return escapar(v);
  if (ehHtml(v)) return v.texto;
  return v.map(render).join("");
}

export function html(partes: TemplateStringsArray, ...valores: readonly Valor[]): Html {
  let out = partes[0] ?? "";
  for (let i = 0; i < valores.length; i++) out += render(valores[i]) + (partes[i + 1] ?? "");
  return criar(out);
}

/** Marca um texto como HTML confiável SEM escapar. Use só com conteúdo do próprio app já validado (ex.: SVG do schema). */
export const confiavel = (texto: string): Html => criar(texto);

/**
 * URL para href/src: só http(s), mailto ou caminho relativo do próprio site. Qualquer outro
 * esquema (javascript:, data:, vbscript:) vira "#".
 */
export function url(u: string): string {
  const t = u.trim();
  if (/^(https?:|mailto:)/i.test(t)) return t;
  if (/^[a-z][a-z0-9+.-]*:/i.test(t)) return "#";
  /* "//outro-site.com" e "\\outro-site.com" herdam o esquema e saem do site */
  if (/^[\\/]{2}/.test(t)) return "#";
  return t;
}
