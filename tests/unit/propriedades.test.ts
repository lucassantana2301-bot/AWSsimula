/**
 * Testes de propriedade (auditoria de QA, item 10): em vez de exemplos
 * escolhidos à mão, o fast-check gera milhares de entradas e procura um
 * contraexemplo para cada invariante. Quando acha, encolhe até o menor caso.
 */
import fc from "fast-check";
import { describe, it } from "vitest";
import { mesclar } from "../../src/features/conta/mesclar";
import { distribuir, montarSimulado, notaEscalonada } from "../../src/features/simulado/simulado";
import {
  INTERVALO_MAX_DIAS,
  Nota,
  intervaloDias,
  proximaRevisao,
  recuperabilidade,
  revisar,
  type Memoria,
} from "../../src/features/srs/fsrs";
import { escapar, html } from "../../src/lib/html";
import { validarEstado } from "../../src/features/progresso/armazenamento";

const DIA = 864e5;
const nota = fc.constantFrom(Nota.errei, Nota.duvida, Nota.acertei, Nota.facil);

describe("FSRS", () => {
  it("qualquer sequência de respostas mantém a memória válida e o intervalo dentro de 1..365 dias", () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(nota, fc.integer({ min: 0, max: 400 })), { minLength: 1, maxLength: 40 }), (seq) => {
        let m: Memoria | undefined;
        let agora = 1_700_000_000_000;
        for (const [g, dias] of seq) {
          agora += dias * DIA;
          m = revisar(m, g, agora);
          if (!(m.s > 0 && Number.isFinite(m.s))) return false;
          if (!(m.d >= 1 && m.d <= 10)) return false;
          const i = intervaloDias(m.s);
          if (i < 1 || i > INTERVALO_MAX_DIAS) return false;
          if (proximaRevisao(m) <= m.ultima) return false;
        }
        return true;
      }),
      { numRuns: 500 },
    );
  });
  it("errar nunca aumenta a estabilidade (depois de pelo menos um dia)", () => {
    fc.assert(
      fc.property(nota, fc.integer({ min: 1, max: 400 }), (primeira, dias) => {
        const m = revisar(undefined, primeira, 0);
        return revisar(m, Nota.errei, dias * DIA).s <= m.s + 1e-9;
      }),
    );
  });
  it("lembrar fica mais difícil com o tempo (recuperabilidade não cresce)", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 3000, noNaN: true }),
        fc.integer({ min: 0, max: 1000 }),
        fc.integer({ min: 0, max: 1000 }),
        (s, a, b) => {
          const [x, y] = a <= b ? [a, b] : [b, a];
          return recuperabilidade(y, s) <= recuperabilidade(x, s) + 1e-12;
        },
      ),
    );
  });
});

describe("mesclar (progresso de dois aparelhos ou duas abas)", () => {
  const estado = fc.record({
    xp: fc.nat(1e6),
    answered: fc.nat(1e5),
    upd: fc.nat(2e12),
    seen: fc.dictionary(fc.constantFrom("q1", "q2", "q3", "q4"), fc.record({ ok: fc.boolean(), n: fc.nat(50), lastTs: fc.nat(2e12) })),
    fichas: fc.dictionary(fc.constantFrom("f1", "f2", "f3"), fc.nat(2e12)),
  });
  it("nunca regride: XP e respondidas são o máximo; nada visto ou lido some", () => {
    fc.assert(
      fc.property(estado, estado, (a, b) => {
        const m = mesclar(a, b);
        if (m["xp"] !== Math.max(a.xp, b.xp)) return false;
        if (m["answered"] !== Math.max(a.answered, b.answered)) return false;
        const seen = m["seen"] as Record<string, unknown>;
        const fichas = m["fichas"] as Record<string, unknown>;
        return (
          [...Object.keys(a.seen), ...Object.keys(b.seen)].every((k) => k in seen) &&
          [...Object.keys(a.fichas), ...Object.keys(b.fichas)].every((k) => k in fichas)
        );
      }),
      { numRuns: 400 },
    );
  });
  it("é simétrica no que importa e idempotente", () => {
    fc.assert(
      fc.property(estado, estado, (a, b) => {
        const ab = mesclar(a, b);
        const ba = mesclar(b, a);
        const aa = mesclar(ab, ab);
        return (
          ab["xp"] === ba["xp"] &&
          JSON.stringify(Object.keys(ab["seen"] as object).sort()) === JSON.stringify(Object.keys(ba["seen"] as object).sort()) &&
          aa["xp"] === ab["xp"]
        );
      }),
    );
  });
});

describe("simulado", () => {
  it("distribuir: soma sempre n, nenhuma cota negativa e cada uma a menos de 1 do ideal", () => {
    fc.assert(
      fc.property(fc.nat(200), fc.array(fc.double({ min: 0.5, max: 100, noNaN: true }), { minLength: 1, maxLength: 8 }), (n, pesos) => {
        const c = distribuir(n, pesos);
        const tot = pesos.reduce((x, y) => x + y, 0);
        return c.reduce((x, y) => x + y, 0) === n && c.every((v, i) => v >= 0 && Math.abs(v - ((pesos[i] ?? 0) / tot) * n) < 1);
      }),
    );
  });
  it("montarSimulado nunca repete questão nem passa de n", () => {
    fc.assert(
      fc.property(
        fc.array(fc.nat(40), { minLength: 2, maxLength: 5 }),
        fc.nat(80),
        fc.integer({ min: 1, max: 2147483646 }),
        (tamanhos, n, semente) => {
          const doms = tamanhos.map((_, i) => ({ id: `d${String(i + 1)}`, w: `${String(10 + i * 5)}%` }));
          const banco = tamanhos.flatMap((t, i) =>
            Array.from({ length: t }, (_, j) => ({ id: `d${String(i + 1)}-${String(j)}`, dom: `d${String(i + 1)}` })),
          );
          /* Park-Miller: sempre em [0, 1) para semente em 1..2^31-2 */
          let s = semente;
          const rnd = (): number => (s = (s * 48271) % 2147483647) / 2147483647;
          const q = montarSimulado(banco, doms, n, {}, rnd);
          return q.length === Math.min(n, banco.length) && new Set(q.map((x) => x.id)).size === q.length;
        },
      ),
    );
  });
  it("nota escalonada fica sempre entre 300 e 1000", () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.nat(30), fc.nat(30)), { minLength: 1, maxLength: 5 }), (pares) => {
        const doms = pares.map((_, i) => ({ id: `d${String(i + 1)}`, w: "20%" }));
        const por = Object.fromEntries(pares.map(([n, ok], i) => [`d${String(i + 1)}`, { n, ok: Math.min(ok, n) }]));
        const v = notaEscalonada(por, doms);
        return v >= 300 && v <= 1000 && Number.isInteger(v);
      }),
    );
  });
});

describe("segurança de saída", () => {
  it("html`` nunca deixa passar um caractere perigoso vindo de texto", () => {
    fc.assert(
      fc.property(fc.string({ unit: "binary", maxLength: 200 }), (s) => {
        const t = html`<p>${s}</p>`.texto;
        const dentro = t.slice(3, -4);
        return !/[<>"'`]/.test(dentro) && dentro === escapar(s);
      }),
      { numRuns: 1000 },
    );
  });
  it("validarEstado recusa qualquer nota de simulado que não seja inteiro 0..1000", () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.double(), fc.constant(null), fc.integer({ min: 1001 }), fc.integer({ max: -1 })), (score) => {
        fc.pre(!(typeof score === "number" && Number.isInteger(score) && score >= 0 && score <= 1000));
        return !validarEstado({ v: 2, xp: 0, sims: [{ exam: "saa", score, pass: true, right: 1, total: 2, ts: 1 }] });
      }),
    );
  });
});
