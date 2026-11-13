/**
 * Vídeos curtos por serviço do guia (primeiro módulo fora do motor legado).
 *
 * Privacidade e segurança:
 * - Nada do YouTube carrega até o toque: a tela mostra um cartão próprio
 *   (sem miniatura externa), e só o clique cria o player.
 * - Player em youtube-nocookie.com, único domínio liberado em `frame-src`.
 * - O iframe é criado pela API do DOM, nunca por innerHTML, e o id é
 *   conferido de novo no clique (defesa em profundidade, já que o dado
 *   atravessa o atributo data-*).
 */
import type { Video, Videos } from "../../content/schema";

const ID_YT = /^[A-Za-z0-9_-]{11}$/;
const ORIGEM_PLAYER = "https://www.youtube-nocookie.com";
const NOME_LINGUA: Record<Video["lang"], string> = { pt: "Português", en: "Inglês" };

let porServico: Readonly<Videos> = {};

/** Recebe os vídeos já validados no CI (fronteira de confiança em bundle.ts). */
export function definirVideos(v: Videos): void {
  porServico = v;
}

export function videosDe(servicoId: string): readonly Video[] {
  return porServico[servicoId] ?? [];
}

const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

function cartao(v: Video): string {
  if (!ID_YT.test(v.yt)) return "";
  const lingua = NOME_LINGUA[v.lang];
  /* duração só aparece quando foi conferida (o schema garante 1–6) */
  const meta = [v.canal, v.min === undefined ? null : `${String(v.min)} min`].filter((x): x is string => x !== null);
  return `<div class="gv-card">
    <button type="button" class="gv-play" data-gv-play="${v.yt}" aria-label="${esc(`Assistir: ${v.titulo} (${lingua})`)}">
      <span class="gv-ico" aria-hidden="true"></span>
      <span class="gv-t">${esc(v.titulo)}</span>
      <span class="gv-m"><span class="gv-lang ${v.lang}">${v.lang.toUpperCase()}</span> ${esc(meta.join(" · "))}</span>
    </button>
    <a class="gv-yt t-xs" href="https://www.youtube.com/watch?v=${v.yt}" target="_blank" rel="noopener noreferrer">Abrir no YouTube</a>
  </div>`;
}

/** HTML da seção "Assista" de um serviço; string vazia quando não há vídeo. */
export function blocoVideos(servicoId: string): string {
  const vs = videosDe(servicoId);
  if (vs.length === 0) return "";
  const soIngles = vs.every((v) => v.lang === "en");
  return `<section class="stack gv" aria-labelledby="gv-h">
    <div class="hd"><h2 id="gv-h">Assista</h2></div>
    <div class="gv-grid">${vs.map(cartao).join("")}</div>
    <p class="t-xs dim2">Vídeos oficiais da AWS no YouTube.${soIngles ? " Ainda não achamos versão oficial em português; ative as legendas automáticas se precisar." : ""} O player só carrega quando você toca.</p>
  </section>`;
}

function abrirPlayer(botao: HTMLButtonElement): void {
  const yt = botao.dataset["gvPlay"] ?? "";
  if (!ID_YT.test(yt)) return;
  const moldura = document.createElement("div");
  moldura.className = "gv-frame";
  const iframe = document.createElement("iframe");
  iframe.src = `${ORIGEM_PLAYER}/embed/${yt}?autoplay=1&rel=0`;
  iframe.title = botao.getAttribute("aria-label") ?? "Vídeo";
  iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  iframe.allowFullscreen = true;
  /* o player do YouTube recusa tocar sem referrer (erro 153) */
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  moldura.append(iframe);
  botao.replaceWith(moldura);
  iframe.focus();
}

let instalado = false;
/** Delegação de clique única no documento; idempotente. */
export function instalarVideos(raiz: Document = document): void {
  if (instalado) return;
  instalado = true;
  raiz.addEventListener("click", (ev) => {
    const alvo = ev.target;
    if (!(alvo instanceof Element)) return;
    const botao = alvo.closest<HTMLButtonElement>("button[data-gv-play]");
    if (botao) abrirPlayer(botao);
  });
}
