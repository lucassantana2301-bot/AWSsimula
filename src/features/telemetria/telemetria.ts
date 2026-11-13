/**
 * Telemetria anônima: erros de JavaScript e eventos de uso, gravados no
 * Supabase do próprio projeto (tabelas `erros` e `eventos`, só insert).
 *
 * Privacidade:
 * - nada pessoal: sem e-mail, sem id de conta, sem IP guardado pelo app;
 * - id de sessão aleatório por aba (some ao fechar);
 * - mensagens passam por `limpar()`: e-mails, tokens e parâmetros de URL saem;
 * - eventos respeitam "Do Not Track"/GPC e a opção do aluno no Perfil.
 * Limites por sessão evitam que um laço de erro inunde o banco.
 */
import { SUPABASE_CHAVE_PUBLICA, SUPABASE_URL, VERSAO_APP } from "../../config";
import { html, type Html } from "../../lib/html";

export const NOMES_EVENTO = [
  "abriu_app",
  "abriu_prova",
  "abriu_ficha",
  "pratica_fim",
  "simulado_inicio",
  "simulado_fim",
  "simulado_abandonado",
  "revisao_fim",
  "abriu_guia",
  "abriu_servico",
  "tocou_video",
  "login",
  "instalou_pwa",
  "questao_reportada",
] as const;
export type NomeEvento = (typeof NOMES_EVENTO)[number];
export type DadosEvento = Record<string, string | number | boolean>;

const MAX_ERROS = 10;
const MAX_EVENTOS = 60;
const CHAVE_OPCAO = "cq-telemetria";

/** Remove o que pode identificar alguém ou vazar credencial. */
export function limpar(texto: string, max: number): string {
  return texto
    .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, "[email]")
    .replace(/\b(eyJ[\w-]{10,}\.[\w-]{10,}\.[\w-]{5,})\b/g, "[token]")
    .replace(/\b(sb_[a-z]+_[\w-]{10,})\b/g, "[chave]")
    .replace(/(https?:\/\/[^\s?#"')]+)[?#][^\s"')]*/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

/** Navegador resumido ("Chrome 142", "Safari 18"), nunca o user agent inteiro. */
export function navegadorResumido(ua: string): string {
  const pares: [RegExp, string][] = [
    [/Edg\/(\d+)/, "Edge"],
    [/OPR\/(\d+)/, "Opera"],
    [/SamsungBrowser\/(\d+)/, "Samsung"],
    [/Firefox\/(\d+)/, "Firefox"],
    [/Chrome\/(\d+)/, "Chrome"],
    [/Version\/(\d+).*Safari/, "Safari"],
  ];
  for (const [re, nome] of pares) {
    const m = re.exec(ua);
    if (m?.[1]) return `${nome} ${m[1]}${/Mobile|Android|iPhone/.test(ua) ? " móvel" : ""}`;
  }
  return "outro";
}

/** Só aceita dados simples e curtos no evento (sem objeto aninhado, sem texto livre longo). */
export function dadosSeguros(dados: Record<string, unknown> | undefined): DadosEvento {
  const out: DadosEvento = {};
  for (const [k, v] of Object.entries(dados ?? {}).slice(0, 8)) {
    if (!/^[a-z_]{1,24}$/.test(k)) continue;
    if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
    else if (typeof v === "boolean") out[k] = v;
    else if (typeof v === "string") out[k] = limpar(v, 60);
  }
  return out;
}

export function eventosPermitidos(nav: { doNotTrack?: string | null; globalPrivacyControl?: boolean }, opcao: string | null): boolean {
  if (opcao === "0") return false;
  return nav.doNotTrack !== "1" && nav.globalPrivacyControl !== true;
}

/* ---------- envio (navegador) ---------- */

let sessao = "";
let erros = 0;
let eventos = 0;
const vistos = new Set<string>();

function idSessao(): string {
  if (sessao) return sessao;
  try {
    sessao = sessionStorage.getItem("cq-sessao") ?? "";
    if (!sessao) {
      sessao = crypto.randomUUID();
      sessionStorage.setItem("cq-sessao", sessao);
    }
  } catch {
    sessao = crypto.randomUUID();
  }
  return sessao;
}

/** Build local, CI e localhost não enviam nada: testes não podem sujar os dados reais. */
export function ambienteDeProducao(versao: string, host: string): boolean {
  return versao !== "dev" && !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(host) && !host.endsWith(".localhost");
}

function enviar(tabela: "erros" | "eventos", corpo: Record<string, unknown>): boolean {
  if (!ambienteDeProducao(VERSAO_APP, location.hostname)) return false;
  /* keepalive: o erro que acontece ao fechar a aba ainda chega */
  void fetch(`${SUPABASE_URL}/rest/v1/${tabela}`, {
    method: "POST",
    keepalive: true,
    headers: { apikey: SUPABASE_CHAVE_PUBLICA, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ sessao: idSessao(), versao_app: VERSAO_APP, ...corpo }),
  }).catch(() => {
    /* telemetria nunca pode quebrar o app */
  });
  return true;
}

function opcaoSalva(): string | null {
  try {
    return localStorage.getItem(CHAVE_OPCAO);
  } catch {
    return null;
  }
}

export function telemetriaLigada(): boolean {
  return opcaoSalva() !== "0";
}
export function definirTelemetria(ligada: boolean): void {
  try {
    localStorage.setItem(CHAVE_OPCAO, ligada ? "1" : "0");
  } catch {
    /* sem storage: vale só nesta aba */
  }
}

export function registrarErro(msg: string, origem: string | undefined, pilha: string | undefined, tela: string): void {
  if (!telemetriaLigada() || erros >= MAX_ERROS) return;
  const mensagem = limpar(msg || "erro sem mensagem", 500);
  const chave = mensagem + "|" + (origem ?? "");
  if (vistos.has(chave)) return;
  vistos.add(chave);
  erros++;
  enviar("erros", {
    mensagem,
    origem: origem ? limpar(origem, 300) : null,
    pilha: pilha ? limpar(pilha, 4000) : null,
    tela: limpar(tela, 40),
    navegador: navegadorResumido(navigator.userAgent),
  });
}

/** Devolve false quando o evento não sai (privacidade, teto da sessão ou ambiente de dev). */
export function registrarEvento(nome: NomeEvento, dados?: Record<string, unknown>): boolean {
  if (eventos >= MAX_EVENTOS) return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (!eventosPermitidos(nav, opcaoSalva())) return false;
  eventos++;
  return enviar("eventos", { nome, dados: dadosSeguros(dados) });
}

/** Liga a captura de erros não tratados. `tela()` diz em que tela o aluno estava. */
export function instalarTelemetria(tela: () => string): void {
  window.addEventListener("error", (ev) => {
    const err: unknown = ev.error;
    registrarErro(
      ev.message,
      ev.filename ? `${ev.filename}:${String(ev.lineno)}` : undefined,
      err instanceof Error ? err.stack : undefined,
      tela(),
    );
  });
  window.addEventListener("unhandledrejection", (ev) => {
    const r: unknown = ev.reason;
    registrarErro(r instanceof Error ? r.message : String(r), "promise", r instanceof Error ? r.stack : undefined, tela());
  });
}

/** Evento de uso correspondente a uma troca de tela do motor (ou nenhum). */
export function eventoDaRota(
  tela: string,
  o: Record<string, unknown> | undefined,
): { nome: NomeEvento; dados?: Record<string, unknown> } | null {
  const id = (k: string): string | undefined => {
    const v = o?.[k];
    return typeof v === "string" ? v : undefined;
  };
  switch (tela) {
    case "exam":
      return { nome: "abriu_prova", dados: { exam: id("exam") ?? "" } };
    case "ficha":
      return { nome: "abriu_ficha", dados: { ficha: id("ficha") ?? "" } };
    case "guia":
      return { nome: "abriu_guia" };
    case "serv":
      return { nome: "abriu_servico", dados: { servico: id("id") ?? "" } };
    default:
      return null;
  }
}

/** Seção "Privacidade" do Perfil. */
export function blocoPrivacidade(): Html {
  const ligada = telemetriaLigada();
  return html`<section class="sheet stack" aria-labelledby="priv-h">
    <div class="hd"><h2 id="priv-h">Privacidade</h2></div>
    <p class="t-sm dim">O app envia estatísticas anônimas (telas abertas, notas de simulado, erros técnicos) para saber onde melhorar. Sem nome, e-mail ou conta. Seu navegador com "não rastrear" já fica de fora.</p>
    <button class="btn sm" data-telemetria aria-pressed="${ligada ? "true" : "false"}" style="align-self:flex-start">${ligada ? "✓ Estatísticas anônimas ligadas" : "Estatísticas anônimas desligadas"}</button>
  </section>`;
}
