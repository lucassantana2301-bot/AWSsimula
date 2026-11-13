/**
 * Conta e sincronização do progresso (ADR-0002, decisão 3).
 *
 * - Login por link mágico no e-mail, fluxo PKCE: o link só funciona no
 *   mesmo navegador que pediu, então um link vazado sozinho não abre a conta.
 * - O cliente do Supabase (~45 KB) só é baixado por quem usa conta.
 * - Escrita otimista (`salvar_progresso` com versão): dois aparelhos
 *   gravando juntos nunca se sobrescrevem; quem perde relê, mescla e regrava.
 * - Primeiro login num aparelho que já tem progresso, numa conta que também
 *   tem: o aluno escolhe entre juntar e usar só o da conta (computador
 *   compartilhado não mistura o progresso de duas pessoas sem perguntar).
 */
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_CHAVE_PUBLICA, SUPABASE_URL } from "../../config";
import { mesclar, temProgresso, type Estado } from "./mesclar";
import { html, type Html } from "../../lib/html";

export interface Motor {
  estado(): Estado;
  /** troca o estado inteiro sem marcar como edição nova (não muda `upd`) */
  substituir(novo: Estado): void;
  render(): void;
  toast(msg: string, tipo?: "ok" | "no" | "fl"): void;
}

type Status = "deslogado" | "enviando" | "link_enviado" | "sincronizando" | "ok" | "pendente" | "erro" | "escolha";

const CHAVE_SESSAO = "cq-auth";
const CHAVE_VINCULO = "cq-conta-vinculo";
const ESPERA_MS = 5000;
const REENVIO_MS = 60_000;

let motor: Motor | null = null;
let cliente: SupabaseClient | null = null;
let carregando: Promise<SupabaseClient> | null = null;
let sessao: Session | null = null;
let status: Status = "deslogado";
let emailEnviado = "";
let ultimoEnvio = 0;
let ultimaSync = 0;
let mensagemErro = "";
let versao = 0;
let emVoo = false;
let sujo = false;
let timer: ReturnType<typeof setTimeout> | undefined;
let decisao: "juntar" | "conta" | null = null;
let apagarPedidoEm = 0;
let painel: Painel | null = null;
let painelPedido = false;

/** Resumo devolvido por `painel_resumo` (só para admins; null para os demais). */
export interface Painel {
  dias: number;
  sessoes: number;
  contas: number;
  contas_ativas: number;
  eventos: Record<string, number>;
  provas: Record<string, number>;
  simulados: Record<string, { n: number; media: number; aprovados: number }>;
  servicos_top: { id: string; n: number }[];
  erros: { mensagem: string; n: number; ultimo: string; versao: string }[];
}

/* ---------- utilitários puros ---------- */

/** JSON com chaves em ordem: dois estados iguais dão o mesmo texto. */
export function canonico(x: unknown): string {
  if (Array.isArray(x)) return `[${x.map(canonico).join(",")}]`;
  if (x && typeof x === "object")
    return `{${Object.keys(x)
      .filter((k) => (x as Record<string, unknown>)[k] !== undefined)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${canonico((x as Record<string, unknown>)[k])}`)
      .join(",")}}`;
  const texto = JSON.stringify(x) as string | undefined; // undefined para função/símbolo
  return texto ?? "null";
}
/** Iguais ignorando `upd` (carimbo de edição, não é progresso). */
const semCarimbo = (e: Estado): Estado => Object.fromEntries(Object.entries(e).filter(([k]) => k !== "upd"));
export function mesmoProgresso(a: Estado, b: Estado): boolean {
  return canonico(semCarimbo(a)) === canonico(semCarimbo(b));
}
export function emailValido(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function ler(chave: string): string | null {
  try {
    return localStorage.getItem(chave);
  } catch {
    return null;
  }
}
function gravar(chave: string, valor: string | null): void {
  try {
    if (valor === null) localStorage.removeItem(chave);
    else localStorage.setItem(chave, valor);
  } catch {
    /* sem storage: segue sem lembrar */
  }
}

/* ---------- cliente ---------- */

function obterCliente(): Promise<SupabaseClient> {
  if (cliente) return Promise.resolve(cliente);
  carregando ??= import("@supabase/supabase-js")
    .then(({ createClient }) => {
      cliente = createClient(SUPABASE_URL, SUPABASE_CHAVE_PUBLICA, {
        auth: { flowType: "pkce", detectSessionInUrl: true, persistSession: true, autoRefreshToken: true, storageKey: CHAVE_SESSAO },
      });
      cliente.auth.onAuthStateChange((_ev, s) => {
        const antes = sessao?.user.id;
        sessao = s;
        if (!s) {
          status = "deslogado";
          motor?.render();
        } else if (s.user.id !== antes) {
          void sincronizar();
        }
      });
      return cliente;
    })
    .catch((e: unknown) => {
      carregando = null;
      throw e;
    });
  return carregando;
}

function mudar(s: Status, erro = ""): void {
  status = s;
  mensagemErro = erro;
  motor?.render();
}

/* ---------- sincronização ---------- */

async function gravarRemoto(c: SupabaseClient, estado: Estado, v: number): Promise<number | null> {
  const r = await c.rpc("salvar_progresso", { p_estado: estado, p_versao: v });
  if (r.error) throw r.error;
  const nova: unknown = r.data;
  return typeof nova === "number" ? nova : null;
}

export async function sincronizar(): Promise<void> {
  if (!motor || !sessao) return;
  if (emVoo) {
    sujo = true;
    return;
  }
  emVoo = true;
  if (status !== "escolha") mudar("sincronizando");
  try {
    const c = await obterCliente();
    const idUsuario = sessao.user.id;
    for (let tentativa = 0; tentativa < 3; tentativa++) {
      const { data, error } = await c.from("progresso").select("estado, versao").maybeSingle<{ estado: Estado; versao: number }>();
      if (error) throw error;
      const local = motor.estado();
      if (!data) {
        const v = await gravarRemoto(c, local, 0);
        if (v !== null) {
          versao = v;
          gravar(CHAVE_VINCULO, idUsuario);
          ultimaSync = Date.now();
          {
            mudar("ok");
            return;
          }
        }
        continue; /* outro aparelho criou a linha agora: relê */
      }
      versao = data.versao;
      const remoto = data.estado;
      const primeiraVezAqui = ler(CHAVE_VINCULO) !== idUsuario;
      if (primeiraVezAqui && decisao === null && temProgresso(local) && temProgresso(remoto) && !mesmoProgresso(local, remoto)) {
        {
          mudar("escolha");
          return;
        }
      }
      const final = decisao === "conta" ? remoto : mesclar(local, remoto);
      decisao = null;
      gravar(CHAVE_VINCULO, idUsuario);
      if (!mesmoProgresso(final, local)) motor.substituir(final);
      if (mesmoProgresso(final, remoto)) {
        ultimaSync = Date.now();
        {
          mudar("ok");
          return;
        }
      }
      const v = await gravarRemoto(c, final, versao);
      if (v !== null) {
        versao = v;
        ultimaSync = Date.now();
        {
          mudar("ok");
          return;
        }
      }
      /* conflito de versão: outro aparelho gravou no meio; repete */
    }
    throw new Error("Muitos aparelhos gravando ao mesmo tempo. Tente de novo.");
  } catch (e) {
    const offline = typeof navigator !== "undefined" && !navigator.onLine;
    mudar(offline ? "pendente" : "erro", offline ? "" : e instanceof Error ? e.message : "Falha ao sincronizar");
  } finally {
    emVoo = false;
    if (status === "ok" && cliente) void carregarPainel(cliente).catch(() => undefined);
    if (sujo) {
      sujo = false;
      agendar();
    }
  }
}

/** Chamado a cada save() do motor: agrupa várias mudanças numa gravação. */
export function agendar(): void {
  if (!sessao) return;
  clearTimeout(timer);
  timer = setTimeout(() => void sincronizar(), ESPERA_MS);
}

async function carregarPainel(c: SupabaseClient): Promise<void> {
  if (painelPedido) return;
  painelPedido = true;
  const r = await c.rpc("painel_resumo", { p_dias: 7 });
  const dado: unknown = r.data;
  if (!r.error && dado && typeof dado === "object") {
    painel = dado as Painel; // forma garantida pela função SQL versionada em supabase/migrations
    motor?.render();
  }
}

/** Painel do dono do app: números da semana e erros mais frequentes. */
export function htmlPainel(p: Painel): Html {
  const linha = (rot: string, v: string | number): Html =>
    html`<div class="spread"><span class="t-sm">${rot}</span><b class="mono">${v}</b></div>`;
  const sims = Object.entries(p.simulados);
  return html`<section class="sheet stack" aria-labelledby="painel-h">
    <div class="hd"><h2 id="painel-h">Painel do app</h2><span class="n">últimos ${p.dias} dias · só você vê</span></div>
    ${linha("Sessões", p.sessoes)}${linha("Contas (ativas na semana)", `${String(p.contas)} (${String(p.contas_ativas)})`)}
    ${Object.entries(p.provas).map(([k, n]) => linha(`Abriram ${k.toUpperCase()}`, n))}
    ${sims.length > 0 && html`<h3 class="t-sm" style="margin-top:6px">Simulados</h3>${sims.map(([k, v]) => linha(`${k.toUpperCase()}: média ${String(v.media)}`, `${String(v.aprovados)}/${String(v.n)} aprovados`))}`}
    ${p.servicos_top.length > 0 && html`<h3 class="t-sm" style="margin-top:6px">Serviços mais abertos no guia</h3>${p.servicos_top.map((x) => linha(x.id, x.n))}`}
    <h3 class="t-sm" style="margin-top:6px">Erros</h3>
    ${
      p.erros.length > 0
        ? p.erros.map((e) => html`<p class="t-xs"><b class="mono">${e.n}×</b> ${e.mensagem} <span class="dim2">(${e.versao})</span></p>`)
        : html`<p class="t-xs dim">Nenhum erro registrado.</p>`
    }
  </section>`;
}

/* ---------- ações ---------- */

async function enviarLink(email: string): Promise<void> {
  if (!emailValido(email)) {
    motor?.toast("Confira o e-mail", "no");
    return;
  }
  if (Date.now() - ultimoEnvio < REENVIO_MS) {
    motor?.toast("Espere um minuto para pedir outro link", "no");
    return;
  }
  mudar("enviando");
  try {
    const c = await obterCliente();
    const { error } = await c.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/`, shouldCreateUser: true },
    });
    if (error) throw error;
    ultimoEnvio = Date.now();
    emailEnviado = email;
    mudar("link_enviado");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    mudar(
      "erro",
      /rate limit|429/i.test(msg)
        ? "Muitos pedidos de link agora. Tente de novo em alguns minutos."
        : /not authorized|email_address_not_authorized/i.test(msg)
          ? "O envio de e-mail ainda está em configuração. Tente mais tarde."
          : "Não deu para enviar o link. Confira a conexão e tente de novo.",
    );
  }
}

async function sair(): Promise<void> {
  const c = await obterCliente();
  await c.auth.signOut({ scope: "local" });
  sessao = null;
  versao = 0;
  painel = null;
  painelPedido = false;
  gravar(CHAVE_VINCULO, null);
  mudar("deslogado");
  motor?.toast("Você saiu. O progresso continua neste aparelho.", "ok");
}

async function apagarNuvem(): Promise<void> {
  if (!sessao) return;
  if (Date.now() - apagarPedidoEm > 6000) {
    apagarPedidoEm = Date.now();
    {
      motor?.toast("Toque de novo para apagar o progresso salvo na conta", "no");
      return;
    }
  }
  apagarPedidoEm = 0;
  try {
    const c = await obterCliente();
    const { error } = await c.from("progresso").delete().eq("user_id", sessao.user.id);
    if (error) throw error;
    await sair();
    motor?.toast("Progresso apagado da conta. Neste aparelho ele continua.", "ok");
  } catch {
    mudar("erro", "Não deu para apagar agora. Tente de novo.");
  }
}

/* ---------- interface ---------- */

function quando(ms: number): string {
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 60) return "agora há pouco";
  if (s < 3600) return `há ${String(Math.round(s / 60))} min`;
  return `há ${String(Math.round(s / 3600))} h`;
}

/** Seção "Conta" do Perfil. */
export function blocoConta(): Html {
  const titulo = html`<div class="hd"><h2 id="conta-h">Conta e sincronização</h2></div>`;
  if (!sessao) {
    const enviado = status === "link_enviado";
    const rotulo = status === "enviando" ? "Enviando…" : enviado ? "Reenviar" : "Enviar link";
    return html`<section class="sheet stack conta" aria-labelledby="conta-h">${titulo}
      <p class="t-sm dim">Entre com seu e-mail para guardar o progresso e continuar em outro aparelho. Sem senha: chega um link.</p>
      ${enviado && html`<p class="t-sm" role="status">Link enviado para <b>${emailEnviado}</b>. Abra o e-mail <b>neste mesmo navegador</b> e toque no link.</p>`}
      <form class="conta-form" data-conta-form novalidate>
        <label class="t-xs dim" for="cq-email">E-mail</label>
        <div class="row">
          <input id="cq-email" name="email" type="email" inputmode="email" autocomplete="email" maxlength="254" required placeholder="voce@exemplo.com">
          <button class="btn fill sm" type="submit" ${status === "enviando" && html`disabled`}>${rotulo}</button>
        </div>
      </form>
      ${status === "erro" && html`<p class="t-sm" style="color:var(--no)" role="alert">${mensagemErro}</p>`}
    </section>`;
  }
  const email = sessao.user.email ?? "";
  const situacao: Record<Status, string> = {
    deslogado: "",
    enviando: "",
    link_enviado: "",
    sincronizando: "Sincronizando…",
    ok: ultimaSync ? `Sincronizado ${quando(ultimaSync)}` : "Sincronizado",
    pendente: "Sem conexão: sincroniza quando a internet voltar",
    erro: mensagemErro || "Falha ao sincronizar",
    escolha: "",
  };
  if (status === "escolha")
    return html`<section class="sheet stack conta" aria-labelledby="conta-h" style="border-color:var(--fl)">${titulo}
      <p class="t-sm">Este aparelho já tem progresso, e a conta <b>${email}</b> também. O que fazer?</p>
      <div class="row" style="flex-wrap:wrap;gap:8px">
        <button class="btn fill sm" data-conta="juntar">Juntar os dois (recomendado)</button>
        <button class="btn sm" data-conta="usar-conta">Usar só o da conta</button>
      </div>
      <p class="t-xs dim2">Juntar mantém o melhor de cada um: nada que você já fez se perde.</p>
    </section>`;
  const erro = status === "erro";
  return html`${painel && htmlPainel(painel)}<section class="sheet stack conta" aria-labelledby="conta-h">${titulo}
    <p class="t-sm">Conectado como <b>${email}</b></p>
    <p class="t-xs ${erro ? "" : "dim"}" role="status" ${erro && html`style="color:var(--no)"`}>${situacao[status]}</p>
    <div class="row" style="flex-wrap:wrap;gap:8px">
      <button class="btn sm" data-conta="sync">Sincronizar agora</button>
      <button class="btn sm ghost" data-conta="sair">Sair</button>
      <button class="btn sm ghost" data-conta="apagar" style="color:var(--no)">Apagar progresso da conta</button>
    </div>
  </section>`;
}

let instalado = false;
/**
 * Liga a conta. Só baixa o cliente do Supabase se houver sessão salva ou se
 * a página veio de um link de login (?code=).
 */
export function iniciarConta(m: Motor): void {
  motor = m;
  if (instalado) return;
  instalado = true;
  document.addEventListener("submit", (ev) => {
    const form = ev.target;
    if (!(form instanceof HTMLFormElement) || !form.hasAttribute("data-conta-form")) return;
    ev.preventDefault();
    const campo = form.elements.namedItem("email");
    const email = campo instanceof HTMLInputElement ? campo.value.trim().toLowerCase() : "";
    void enviarLink(email);
  });
  document.addEventListener("click", (ev) => {
    const alvo = ev.target instanceof Element ? ev.target.closest<HTMLElement>("[data-conta]") : null;
    if (!alvo) return;
    const acao = alvo.dataset["conta"];
    if (acao === "sync") void sincronizar();
    else if (acao === "sair") void sair();
    else if (acao === "apagar") void apagarNuvem();
    else if (acao === "juntar" || acao === "usar-conta") {
      decisao = acao === "juntar" ? "juntar" : "conta";
      void sincronizar();
    }
  });
  window.addEventListener("online", () => {
    if (status === "pendente") void sincronizar();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
      void sincronizar();
    }
  });

  const url = new URL(location.href);
  const veioDoLink = url.searchParams.has("code") || url.searchParams.has("error_description");
  if (!veioDoLink && !ler(CHAVE_SESSAO)) return;
  void obterCliente()
    .then(async (c) => {
      const { data } = await c.auth.getSession();
      sessao = data.session;
      if (url.searchParams.has("error_description")) mudar("erro", "O link expirou ou já foi usado. Peça outro.");
      if (veioDoLink) {
        /* tira o código da barra de endereço (e do histórico) */
        for (const p of ["code", "error", "error_code", "error_description"]) url.searchParams.delete(p);
        history.replaceState(history.state, "", url.pathname + url.search + url.hash);
        if (sessao) motor?.toast("Conectado. Sincronizando o progresso…", "ok");
      }
      if (sessao) await sincronizar();
      else motor?.render();
    })
    .catch(() => {
      mudar("erro", "Não deu para carregar a conta. Confira a conexão.");
    });
}

export const statusConta = (): Status => status;
