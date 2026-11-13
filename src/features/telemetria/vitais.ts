/**
 * Web Vitals de campo (auditoria de QA, item 39): LCP, INP e CLS medidos no aparelho do aluno,
 * enviados uma vez por sessão como o evento anônimo "web_vitais", nas mesmas regras de
 * privacidade da telemetria (opção no Perfil, Do Not Track, GPC, teto por sessão).
 *
 * Sem biblioteca: PerformanceObserver direto, com as mesmas definições do web-vitals do Chrome:
 * - LCP: o último largest-contentful-paint antes da primeira interação;
 * - INP: a maior duração de interação (event timing, com interactionId), aproximação do p98
 *   que basta para sessões curtas;
 * - CLS: a maior janela de mudanças de layout (até 5 s, intervalos de até 1 s), sem as que
 *   seguem input do usuário.
 * Amostra de 20% das sessões para caber na cota gratuita do banco.
 */
export interface Vitais {
  lcp: number | null;
  inp: number | null;
  cls: number | null;
}

export type Faixa = "bom" | "melhorar" | "ruim";

/* limites oficiais (web.dev/vitals) */
const LIMITES = { lcp: [2500, 4000], inp: [200, 500], cls: [0.1, 0.25] } as const;

export function faixa(metrica: keyof typeof LIMITES, valor: number): Faixa {
  const [bom, ruim] = LIMITES[metrica];
  return valor <= bom ? "bom" : valor <= ruim ? "melhorar" : "ruim";
}

export interface MudancaLayout {
  valor: number;
  t: number;
  comInput: boolean;
}

/** CLS por janelas de sessão: a maior soma em janelas de até 5 s com pausas de até 1 s. */
export function clsDeJanelas(mudancas: readonly MudancaLayout[]): number {
  let maior = 0;
  let atual = 0;
  let inicio = -Infinity;
  let ultima = -Infinity;
  for (const m of mudancas) {
    if (m.comInput) continue;
    if (m.t - ultima > 1000 || m.t - inicio > 5000) {
      atual = 0;
      inicio = m.t;
    }
    atual += m.valor;
    ultima = m.t;
    maior = Math.max(maior, atual);
  }
  return maior;
}

/** Dados do evento: números arredondados e faixas; nada de URL, seletor ou elemento. */
export function dadosDosVitais(v: Vitais, tipoConexao: string | undefined): Record<string, string | number> {
  const d: Record<string, string | number> = {};
  if (v.lcp !== null && Number.isFinite(v.lcp)) {
    d["lcp"] = Math.round(v.lcp);
    d["lcp_faixa"] = faixa("lcp", v.lcp);
  }
  if (v.inp !== null && Number.isFinite(v.inp)) {
    d["inp"] = Math.round(v.inp);
    d["inp_faixa"] = faixa("inp", v.inp);
  }
  if (v.cls !== null && Number.isFinite(v.cls)) {
    d["cls"] = Math.round(v.cls * 1000) / 1000;
    d["cls_faixa"] = faixa("cls", v.cls);
  }
  if (tipoConexao && /^(slow-2g|2g|3g|4g)$/.test(tipoConexao)) d["rede"] = tipoConexao;
  return d;
}

export const AMOSTRA = 0.2;

interface EntradaEvento extends PerformanceEntry {
  interactionId?: number;
}
interface EntradaLayout extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

/**
 * Começa a observar e manda o evento quando a aba vai para segundo plano (o momento em que o
 * navegador ainda deixa a requisição sair, com keepalive). Navegador sem suporte: não faz nada.
 */
/* sorteio da amostra fora do Math.random: não consome a sequência que sorteia as questões */
const sorteioCripto = (): number => (crypto.getRandomValues(new Uint32Array(1))[0] ?? 0) / 2 ** 32;

export function observarVitais(enviar: (dados: Record<string, string | number>) => void, sorteio: () => number = sorteioCripto): void {
  if (typeof PerformanceObserver === "undefined" || sorteio() >= AMOSTRA) return;
  const tipos = PerformanceObserver.supportedEntryTypes;
  const v: Vitais = { lcp: null, inp: null, cls: null };
  const mudancas: MudancaLayout[] = [];
  let lcpParado = false;
  const observar = (tipo: string, cb: (lista: PerformanceEntryList) => void, extra: Record<string, unknown> = {}): void => {
    if (!tipos.includes(tipo)) return;
    try {
      new PerformanceObserver((l) => {
        cb(l.getEntries());
      }).observe({ type: tipo, buffered: true, ...extra });
    } catch {
      /* tipo anunciado mas recusado (Safari antigo): ignora */
    }
  };
  observar("largest-contentful-paint", (es) => {
    const ultima = es.at(-1);
    if (!lcpParado && ultima) v.lcp = ultima.startTime;
  });
  observar(
    "event",
    (es) => {
      for (const e of es as EntradaEvento[]) {
        if (!e.interactionId) continue;
        lcpParado = true;
        v.inp = Math.max(v.inp ?? 0, e.duration);
      }
    },
    { durationThreshold: 40 },
  );
  observar("layout-shift", (es) => {
    for (const e of es as EntradaLayout[]) mudancas.push({ valor: e.value, t: e.startTime, comInput: e.hadRecentInput });
    v.cls = clsDeJanelas(mudancas);
  });
  if (tipos.includes("layout-shift")) v.cls = 0;
  let enviado = false;
  const fechar = (): void => {
    if (enviado || document.visibilityState !== "hidden") return;
    enviado = true;
    const conexao = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
    const dados = dadosDosVitais(v, conexao?.effectiveType);
    if (Object.keys(dados).some((k) => k.endsWith("_faixa"))) enviar(dados);
  };
  document.addEventListener("visibilitychange", fechar);
}
