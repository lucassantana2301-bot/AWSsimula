/**
 * POST /api/csp — relatórios de violação da Content-Security-Policy (auditoria de QA, item 25).
 *
 * Aceita os dois formatos que os navegadores mandam:
 * - `report-uri` (application/csp-report): { "csp-report": { ... } }
 * - `report-to` / Reporting API (application/reports+json): [{ type: "csp-violation", body: { ... } }]
 *
 * Grava uma linha JSON no log da função (Vercel → Logs), sem banco e sem custo. Privacidade:
 * URLs perdem query string e fragmento (podem trazer nota, token ou e-mail), `script-sample`
 * é descartado (é trecho de código da página) e nada do cliente (IP, user agent) é registrado.
 * Corpo acima de 16 KB, tipo desconhecido ou JSON inválido: 400/413/415 sem log.
 */
import { criarLimite, ipDoCliente, respostaLimite } from "../server/limite";

export const MAX_CORPO = 16 * 1024;
const TIPOS = ["application/csp-report", "application/reports+json", "application/json"];

export interface Violacao {
  diretiva: string;
  bloqueado: string;
  pagina: string;
  arquivo: string;
  linha: number;
  disposicao: "enforce" | "report";
}

const texto = (v: unknown, max = 300): string => (typeof v === "string" ? v.slice(0, max) : "");

/** Sem query nem fragmento; esquemas especiais (inline, eval, data:) ficam só com o nome. */
export function urlSegura(v: unknown): string {
  const s = texto(v, 2000).trim();
  if (!s) return "";
  if (/^(inline|eval|wasm-eval|trusted-types-[a-z-]+|self)$/i.test(s)) return s.toLowerCase();
  const esquema = /^(data|blob|javascript|about):/i.exec(s)?.[1];
  if (esquema) return `${esquema.toLowerCase()}:`;
  try {
    const u = new URL(s);
    return (u.origin === "null" ? u.protocol : u.origin + u.pathname).slice(0, 300);
  } catch {
    return "";
  }
}

function deUmRelatorio(c: Record<string, unknown>): Violacao | null {
  /* report-uri usa hífen; Reporting API usa camelCase */
  const diretiva = texto(c["effective-directive"] ?? c["effectiveDirective"] ?? c["violated-directive"] ?? c["violatedDirective"], 60);
  if (!/^[a-z-]{3,40}$/.test(diretiva)) return null;
  const linha = Number(c["line-number"] ?? c["lineNumber"] ?? 0);
  return {
    diretiva,
    bloqueado: urlSegura(c["blocked-uri"] ?? c["blockedURL"]),
    pagina: urlSegura(c["document-uri"] ?? c["documentURL"]),
    arquivo: urlSegura(c["source-file"] ?? c["sourceFile"]),
    linha: Number.isInteger(linha) && linha >= 0 && linha < 1e7 ? linha : 0,
    disposicao: (c["disposition"] ?? "enforce") === "report" ? "report" : "enforce",
  };
}

const ehObjeto = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);

/** Extrai até 10 violações de qualquer um dos formatos; o resto é ignorado. */
export function lerRelatorios(corpo: unknown): Violacao[] {
  const brutos: unknown[] = Array.isArray(corpo)
    ? corpo.filter((r) => ehObjeto(r) && r["type"] === "csp-violation").map((r) => (r as Record<string, unknown>)["body"])
    : ehObjeto(corpo) && ehObjeto(corpo["csp-report"])
      ? [corpo["csp-report"]]
      : [];
  return brutos
    .slice(0, 10)
    .filter(ehObjeto)
    .map(deUmRelatorio)
    .filter((v): v is Violacao => v !== null);
}

async function lerCorpo(req: Request): Promise<string | null> {
  const declarado = Number(req.headers.get("content-length") ?? "0");
  if (declarado > MAX_CORPO) return null;
  if (!req.body) return "";
  /* lê em pedaços: content-length pode mentir ou faltar (chunked) */
  const leitor = req.body.getReader();
  const partes: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await leitor.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_CORPO) {
      await leitor.cancel();
      return null;
    }
    partes.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(partes));
}

const limite = criarLimite({ capacidade: 20, porSegundo: 1, maxClientes: 5_000 });
const vazio = (status: number): Response => new Response(null, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(
  req: Request,
  registrar: (linha: string) => void = (l) => {
    /* stdout é o log da função no Vercel; aviso porque violação de CSP merece olhar */
    console.warn(l);
  },
): Promise<Response> {
  const tipo = (req.headers.get("content-type") ?? "").split(";")[0]?.trim().toLowerCase() ?? "";
  if (!TIPOS.includes(tipo)) return vazio(415);
  const v = limite(ipDoCliente(req.headers, undefined, !!process.env["VERCEL"]));
  if (!v.permitido) return respostaLimite(v);
  const corpo = await lerCorpo(req);
  if (corpo === null) return vazio(413);
  let json: unknown;
  try {
    json = JSON.parse(corpo);
  } catch {
    return vazio(400);
  }
  for (const violacao of lerRelatorios(json)) registrar(JSON.stringify({ nivel: "aviso", msg: "csp", ...violacao }));
  return vazio(204);
}

export function GET(): Response {
  return new Response("Use POST", { status: 405, headers: { Allow: "POST", "Content-Type": "text/plain; charset=utf-8" } });
}
