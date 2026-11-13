/**
 * FSRS-5 (Free Spaced Repetition Scheduler), o algoritmo do Anki moderno.
 *
 * Por que trocar o SM-2: o SM-2 usa intervalos fixos (1, 3, x·ease) e não
 * sabe quanto você esqueceu; o FSRS modela a memória com duas variáveis por
 * conceito e marca a revisão para quando a chance de lembrar cai a 90%.
 *
 *   S (estabilidade): dias até a chance de lembrar cair para 90%.
 *   D (dificuldade):  1 (fácil) a 10 (difícil).
 *   R (recuperabilidade): chance de lembrar agora, função de S e do tempo.
 *
 * Funções puras: o tempo entra como parâmetro. Pesos padrão do FSRS-5
 * (open-spaced-repetition/ts-fsrs), sem otimização por usuário.
 */

export const Nota = { errei: 1, duvida: 2, acertei: 3, facil: 4 } as const;
export type Nota = (typeof Nota)[keyof typeof Nota];

export interface Memoria {
  /** estabilidade em dias (> 0) */
  s: number;
  /** dificuldade, 1..10 */
  d: number;
  /** última revisão, ms desde a época */
  ultima: number;
}

export const PESOS_FSRS5 = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315,
  2.9898, 0.51655, 0.6621,
] as const;

const DECAY = -0.5;
const FATOR = 19 / 81; // garante R(S, S) = 0,9
const DIA_MS = 864e5;
export const RETENCAO_ALVO = 0.9;
export const INTERVALO_MAX_DIAS = 365;

const w = (i: number): number => {
  const v = PESOS_FSRS5[i];
  if (v === undefined) throw new RangeError(`peso FSRS ${String(i)} inexistente`);
  return v;
};
const limita = (x: number, min: number, max: number): number => Math.min(max, Math.max(min, x));

/** Chance de lembrar depois de `dias` com estabilidade `s`. */
export function recuperabilidade(dias: number, s: number): number {
  return Math.pow(1 + (FATOR * Math.max(0, dias)) / s, DECAY);
}

/** Dias até a chance de lembrar cair para `retencao`. */
export function intervaloDias(s: number, retencao = RETENCAO_ALVO): number {
  const dias = (s / FATOR) * (Math.pow(retencao, 1 / DECAY) - 1);
  return limita(Math.round(dias), 1, INTERVALO_MAX_DIAS);
}

const dificuldadeInicial = (g: Nota): number => w(4) - Math.exp(w(5) * (g - 1)) + 1;

function proximaDificuldade(d: number, g: Nota): number {
  const delta = -w(6) * (g - 3);
  const amortecida = d + (delta * (10 - d)) / 9; // FSRS-5: muda menos perto do teto
  const media = w(7) * dificuldadeInicial(Nota.facil) + (1 - w(7)) * amortecida; // volta à média
  return limita(media, 1, 10);
}

function estabilidadeAposAcerto(d: number, s: number, r: number, g: Nota): number {
  const penalidade = g === Nota.duvida ? w(15) : 1;
  const bonus = g === Nota.facil ? w(16) : 1;
  return s * (Math.exp(w(8)) * (11 - d) * Math.pow(s, -w(9)) * (Math.exp(w(10) * (1 - r)) - 1) * penalidade * bonus + 1);
}

function estabilidadeAposErro(d: number, s: number, r: number): number {
  const nova = w(11) * Math.pow(d, -w(12)) * (Math.pow(s + 1, w(13)) - 1) * Math.exp(w(14) * (1 - r));
  return Math.min(nova, s); // FSRS-5: errar nunca aumenta a estabilidade
}

/** Revisão no mesmo dia (FSRS-5): ajuste curto, sem modelo de esquecimento. */
const estabilidadeMesmoDia = (s: number, g: Nota): number => s * Math.exp(w(17) * (g - 3 + w(18)));

/** Aplica uma resposta. `m` ausente = primeira vez que o conceito é visto. */
export function revisar(m: Memoria | undefined, g: Nota, agora: number): Memoria {
  if (!Number.isFinite(agora)) throw new RangeError("agora inválido");
  if (!m) return { s: w(g - 1), d: limita(dificuldadeInicial(g), 1, 10), ultima: agora };
  const dias = Math.max(0, (agora - m.ultima) / DIA_MS);
  const d = proximaDificuldade(m.d, g);
  let s: number;
  if (dias < 1) s = estabilidadeMesmoDia(m.s, g);
  else {
    const r = recuperabilidade(dias, m.s);
    s = g === Nota.errei ? estabilidadeAposErro(m.d, m.s, r) : estabilidadeAposAcerto(m.d, m.s, r, g);
  }
  return { s: limita(s, 0.01, 36500), d, ultima: agora };
}

/** Quando revisar de novo (ms). */
export function proximaRevisao(m: Memoria): number {
  return m.ultima + intervaloDias(m.s) * DIA_MS;
}

/**
 * Converte o estado salvo pelo SM-2 antigo, para ninguém perder a fila.
 * ease 2,5 (padrão) vira D≈5; ease 1,3 (mínimo, errou muito) vira D=10.
 */
export function deSm2(antigo: { ease: number; intv: number; due: number; n: number }): Memoria | undefined {
  if (!(antigo.n > 0) || !Number.isFinite(antigo.due)) return undefined;
  const s = Math.max(0.5, Number.isFinite(antigo.intv) ? antigo.intv : 1);
  const d = limita(10 - ((antigo.ease - 1.3) / 1.2) * 5, 1, 10);
  return { s, d, ultima: antigo.due - Math.max(1, antigo.intv) * DIA_MS };
}
