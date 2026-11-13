import { describe, expect, it } from "vitest";
import { Nota, deSm2, intervaloDias, proximaRevisao, recuperabilidade, revisar, type Memoria } from "../../src/features/srs/fsrs";

const DIA = 864e5;
const T0 = Date.UTC(2026, 0, 1);

/** Simula uma sequência de notas, cada uma no dia em que vence. */
function sequencia(notas: Nota[]): Memoria {
  let m: Memoria | undefined;
  let agora = T0;
  for (const g of notas) {
    m = revisar(m, g, agora);
    agora = proximaRevisao(m);
  }
  if (!m) throw new Error("sequência vazia");
  return m;
}

describe("FSRS-5", () => {
  it("define a estabilidade como o ponto em que a chance de lembrar cai a 90%", () => {
    for (const s of [1, 7, 30, 200]) expect(recuperabilidade(s, s)).toBeCloseTo(0.9, 10);
    expect(recuperabilidade(0, 5)).toBe(1);
    expect(intervaloDias(10)).toBe(10);
  });

  it("primeira resposta: errei < dúvida < acertei < fácil", () => {
    const s = [Nota.errei, Nota.duvida, Nota.acertei, Nota.facil].map((g) => revisar(undefined, g, T0).s);
    expect(s).toEqual([...s].sort((a, b) => a - b));
    expect(new Set(s).size).toBe(4);
    expect(intervaloDias(revisar(undefined, Nota.acertei, T0).s)).toBe(3);
  });

  it("acertos seguidos espaçam cada vez mais, sem passar de 1 ano", () => {
    let m: Memoria | undefined;
    let agora = T0;
    const intervalos: number[] = [];
    for (let i = 0; i < 12; i++) {
      m = revisar(m, Nota.acertei, agora);
      intervalos.push(intervaloDias(m.s));
      agora = proximaRevisao(m);
    }
    for (let i = 1; i < intervalos.length; i++) expect(intervalos[i]).toBeGreaterThanOrEqual(intervalos[i - 1] ?? 0);
    expect(intervalos.at(-1)).toBeLessThanOrEqual(365);
    expect(intervalos.at(-1)).toBeGreaterThan(60);
  });

  it("errar derruba a estabilidade e aumenta a dificuldade", () => {
    const antes = sequencia([Nota.acertei, Nota.acertei, Nota.acertei]);
    const depois = revisar(antes, Nota.errei, proximaRevisao(antes));
    expect(depois.s).toBeLessThan(antes.s);
    expect(depois.d).toBeGreaterThan(antes.d);
  });

  it("'acertei com dúvida' agenda antes de 'acertei'", () => {
    const base = sequencia([Nota.acertei, Nota.acertei]);
    const quando = proximaRevisao(base);
    expect(revisar(base, Nota.duvida, quando).s).toBeLessThan(revisar(base, Nota.acertei, quando).s);
  });

  it("revisar no mesmo dia mexe pouco (não vira atalho para inflar o intervalo)", () => {
    const m = revisar(undefined, Nota.acertei, T0);
    const mesmoDia = revisar(m, Nota.acertei, T0 + 3600e3);
    expect(mesmoDia.s / m.s).toBeLessThan(2);
    expect(mesmoDia.s).toBeGreaterThan(m.s);
  });

  it("dificuldade fica sempre entre 1 e 10", () => {
    let m: Memoria | undefined;
    for (let i = 0; i < 40; i++) m = revisar(m, Nota.errei, T0 + i * DIA);
    expect(m?.d).toBeLessThanOrEqual(10);
    for (let i = 0; i < 40; i++) m = revisar(m, Nota.facil, T0 + (40 + i) * DIA);
    expect(m?.d).toBeGreaterThanOrEqual(1);
  });

  it("migra o estado do SM-2 sem perder a data de revisão", () => {
    const due = T0 + 5 * DIA;
    const m = deSm2({ ease: 2.5, intv: 7, due, n: 3 });
    expect(m).toBeDefined();
    if (!m) return;
    expect(m.d).toBeCloseTo(5, 5);
    expect(proximaRevisao(m)).toBe(due);
    expect(deSm2({ ease: 1.3, intv: 1, due, n: 2 })?.d).toBe(10);
    expect(deSm2({ ease: 2.5, intv: 0, due: 0, n: 0 })).toBeUndefined();
  });

  it("rejeita tempo inválido", () => {
    expect(() => revisar(undefined, Nota.acertei, Number.NaN)).toThrow(RangeError);
  });
});
