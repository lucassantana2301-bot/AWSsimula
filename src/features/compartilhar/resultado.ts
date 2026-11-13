/**
 * Link público do resultado de um simulado, para o LinkedIn.
 *
 * O link carrega só números (prova, nota, aprovado, data): nada pessoal.
 * Como a nota é calculada no aparelho do aluno, o link é autodeclarado; a
 * página e a imagem dizem sempre "simulado de prática", nunca "certificação"
 * ou "resultado oficial", para não parecer um documento que não é.
 *
 * Funções puras: usadas pelo app (montar o link) e pelas funções da Vercel
 * em /api (validar e desenhar a página e a imagem).
 */
import exames from "../../../content/exams.json";

export interface Resultado {
  exam: string;
  score: number;
  pass: boolean;
  /** AAAA-MM-DD */
  data: string;
}

export interface ExameInfo {
  id: string;
  code: string;
  name: string;
  scale: number;
  pass: number;
  provider: string;
}

const EXAMES: readonly ExameInfo[] = exames.map((e) => ({
  id: e.id,
  code: e.code,
  name: e.name,
  scale: e.scale,
  pass: e.pass,
  provider: e.provider,
}));
export const exameInfo = (id: string): ExameInfo | undefined => EXAMES.find((e) => e.id === id);

/** Lê e valida os parâmetros. Qualquer coisa fora do esperado vira null. */
export function lerResultado(q: URLSearchParams, agora: () => number = Date.now): Resultado | null {
  const exam = q.get("e") ?? "";
  const info = exameInfo(exam);
  if (!info) return null;
  const sTexto = q.get("s") ?? "";
  if (!/^\d{3,4}$/.test(sTexto)) return null;
  const score = Number(sTexto);
  if (score < 100 || score > info.scale) return null;
  const data = q.get("d") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data) || Number.isNaN(Date.parse(data))) return null;
  /* data plausível: nem no futuro (1 dia de folga por fuso) nem antes do app
     existir. Limita as combinações que alguém pode gerar para fugir do cache. */
  const ms = Date.parse(`${data}T00:00:00Z`);
  if (ms > agora() + 864e5 || ms < Date.UTC(2025, 0, 1)) return null;
  /* aprovado é derivado da nota, não do parâmetro: o link não mente sobre o corte */
  return { exam, score, pass: score >= info.pass, data };
}

export function urlResultado(origem: string, r: Resultado): string {
  const q = new URLSearchParams({ e: r.exam, s: String(Math.round(r.score)), d: r.data });
  return `${origem.replace(/\/$/, "")}/api/r?${q.toString()}`;
}

export function urlLinkedIn(link: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`;
}

const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);

const dataBr = (d: string): string => {
  const [a, m, dia] = d.split("-");
  return `${dia ?? ""}/${m ?? ""}/${a ?? ""}`;
};

export function tituloResultado(r: Resultado): string {
  const info = exameInfo(r.exam);
  if (!info) return "Simulado no CloudQuest";
  return `${info.code}: ${String(r.score)}/${String(info.scale)} no simulado de prática${r.pass ? " (acima do corte)" : ""}`;
}

/** Página com as tags de pré-visualização (Open Graph) e um botão para o app. */
export function paginaResultado(r: Resultado, origem: string, urlPagina: string): string {
  const info = exameInfo(r.exam);
  const titulo = tituloResultado(r);
  const desc = info
    ? `${info.name} (${info.code}). Simulado de prática feito em ${dataBr(r.data)} no CloudQuest. Corte de referência: ${String(info.pass)}.`
    : "Simulado de prática no CloudQuest.";
  const imagem = `${origem}/api/og?${new URL(urlPagina).searchParams.toString()}`;
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titulo)} · CloudQuest</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="noindex">
<meta property="og:type" content="website">
<meta property="og:site_name" content="CloudQuest">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(urlPagina)}">
<meta property="og:image" content="${esc(imagem)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(titulo)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/icons/icon.svg" type="image/svg+xml">
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0B1016;color:#E8EEF4;font:16px/1.5 system-ui,sans-serif}
main{max-width:560px;padding:32px 24px;text-align:center}
img{width:100%;height:auto;border-radius:8px;border:1px solid #26323D}
a{display:inline-block;margin-top:20px;padding:12px 20px;border-radius:6px;background:#48D59A;color:#0B1016;font-weight:700;text-decoration:none}
p{color:#9FAEBD}
</style></head>
<body><main>
<img src="${esc(imagem)}" alt="${esc(titulo)}" width="1200" height="630">
<p>${esc(desc)}</p>
<a href="${esc(origem)}/">Estudar no CloudQuest</a>
</main></body></html>`;
}

/* ---------- cartão (árvore de elementos para @vercel/og / satori) ---------- */

interface No {
  type: string;
  props: Record<string, unknown> & { children?: No | string | (No | string)[] };
}
const el = (type: string, style: Record<string, unknown>, children?: No | string | (No | string)[]): No => ({
  type,
  props: children === undefined ? { style } : { style, children },
});

/** 1200 de largura menos 72 de margem de cada lado */
const LARGURA_UTIL = 1056;

export function cartaoResultado(r: Resultado): No {
  const info = exameInfo(r.exam);
  const aws = info?.provider === "aws";
  const destaque = aws ? "#F2A05B" : "#6DB0F7";
  const escala = info?.scale ?? 1000;
  const corte = info?.pass ?? 700;
  const pct = Math.max(0, Math.min(1, (r.score - 100) / (escala - 100)));
  const pctCorte = Math.max(0, Math.min(1, (corte - 100) / (escala - 100)));
  const topo = el("div", { display: "flex", flexDirection: "column" }, [
    el("div", { display: "flex", alignItems: "center", fontSize: 30, color: "#9FAEBD" }, [
      el(
        "div",
        { display: "flex", padding: "6px 14px", borderRadius: 6, background: destaque, color: "#0B1016", fontWeight: 700, marginRight: 18 },
        info?.code ?? r.exam,
      ),
      el("div", { display: "flex" }, info?.name ?? ""),
    ]),
    el("div", { display: "flex", alignItems: "baseline", marginTop: 48 }, [
      el("div", { display: "flex", fontSize: 168, fontWeight: 700, lineHeight: 1 }, String(r.score)),
      el("div", { display: "flex", fontSize: 48, color: "#9FAEBD", marginLeft: 16 }, `/ ${String(escala)}`),
    ]),
    el(
      "div",
      { display: "flex", position: "relative", marginTop: 40, width: LARGURA_UTIL, height: 18, borderRadius: 9, background: "#26323D" },
      [
        el("div", {
          display: "flex",
          width: Math.round(pct * LARGURA_UTIL),
          height: 18,
          borderRadius: 9,
          background: r.pass ? "#48D59A" : destaque,
        }),
        el("div", {
          display: "flex",
          position: "absolute",
          left: Math.round(pctCorte * LARGURA_UTIL) - 2,
          top: -10,
          width: 4,
          height: 38,
          background: "#E8EEF4",
        }),
      ],
    ),
    el(
      "div",
      { display: "flex", marginTop: 16, fontSize: 28, color: "#9FAEBD" },
      `Corte de referência: ${String(corte)} · ${r.pass ? "acima do corte" : "abaixo do corte"}`,
    ),
  ]);
  const rodape = el(
    "div",
    { display: "flex", width: LARGURA_UTIL, justifyContent: "space-between", alignItems: "center", fontSize: 28, color: "#9FAEBD" },
    [
      el("div", { display: "flex" }, `Simulado de prática · ${dataBr(r.data)}`),
      el("div", { display: "flex", color: "#E8EEF4", fontWeight: 700 }, "CloudQuest"),
    ],
  );
  return el(
    "div",
    {
      width: 1200,
      height: 630,
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      background: "#0B1016",
      color: "#E8EEF4",
      padding: "64px 72px 56px",
      fontFamily: "DejaVu Sans",
    },
    [topo, rodape],
  );
}
