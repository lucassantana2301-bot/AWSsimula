/**
 * Regras campo a campo do mesclar. Escritos a partir dos mutantes que sobreviveram ao
 * Stryker (mesclar.ts estava com 54%): cada teste mata uma classe de mutante.
 */
import { describe, expect, it } from "vitest";
import { mesclar, temProgresso, type Estado } from "../../src/features/conta/mesclar";

const m = (a: Estado, b: Estado): Estado => mesclar(a, b);

describe("mesclar: ofensiva e missão do dia", () => {
  it("quem estudou por último manda na ofensiva, mesmo que a outra seja maior", () => {
    const a = { lastDay: "2026-11-12", streak: 30, shields: 2 };
    const b = { lastDay: "2026-11-13", streak: 4, shields: 0 };
    for (const r of [m(a, b), m(b, a)]) {
      expect(r["lastDay"]).toBe("2026-11-13");
      expect(r["streak"]).toBe(4);
      expect(r["shields"]).toBe(0);
    }
  });
  it("no mesmo dia, fica a maior ofensiva (com os escudos dela)", () => {
    const a = { lastDay: "2026-11-13", streak: 5, shields: 1 };
    const b = { lastDay: "2026-11-13", streak: 9, shields: 3 };
    expect(m(a, b)).toMatchObject({ streak: 9, shields: 3 });
    expect(m(b, a)).toMatchObject({ streak: 9, shields: 3 });
  });
  it("lastDay inválido conta como nunca estudou", () => {
    expect(m({ lastDay: 42, streak: 99 }, { lastDay: "2026-01-01", streak: 1 })["streak"]).toBe(1);
    expect(m({ lastDay: "2026-01-01", streak: 1 }, { lastDay: null, streak: 99 })["streak"]).toBe(1);
    expect(m({}, {})["lastDay"]).toBeNull();
  });
  it("dailyDone fica com o dia mais recente; nada vira null", () => {
    expect(m({ dailyDone: "2026-11-12" }, { dailyDone: "2026-11-13" })["dailyDone"]).toBe("2026-11-13");
    expect(m({ dailyDone: "2026-11-13" }, { dailyDone: "2026-11-12" })["dailyDone"]).toBe("2026-11-13");
    expect(m({ dailyDone: "2026-11-13" }, { dailyDone: 5 })["dailyDone"]).toBe("2026-11-13");
    expect(m({ dailyDone: 5 }, { dailyDone: "2026-11-13" })["dailyDone"]).toBe("2026-11-13");
    expect(m({}, {})["dailyDone"]).toBeNull();
  });
});

describe("mesclar: contadores do dia e da semana", () => {
  it("mesmo dia: o maior; dias diferentes: o do estado mais recente", () => {
    expect(m({ dayKeyCur: "d", todayXp: 50 }, { dayKeyCur: "d", todayXp: 20 })["todayXp"]).toBe(50);
    expect(m({ upd: 1, dayKeyCur: "ontem", todayXp: 500 }, { upd: 2, dayKeyCur: "hoje", todayXp: 10 })["todayXp"]).toBe(10);
    expect(m({ upd: 2, weekKey: "w2", weekXp: 7 }, { upd: 1, weekKey: "w1", weekXp: 900 })["weekXp"]).toBe(7);
  });
  it("estado mais recente é a base dos campos sem regra (tema); empate fica o local", () => {
    expect(m({ upd: 1, theme: "claro" }, { upd: 2, theme: "escuro" })["theme"]).toBe("escuro");
    expect(m({ upd: 3, theme: "claro" }, { upd: 2, theme: "escuro" })["theme"]).toBe("claro");
    expect(m({ upd: 2, theme: "claro" }, { upd: 2, theme: "escuro" })["theme"]).toBe("claro");
    expect(m({ upd: 1, so: "local" }, { upd: 2 })["so"]).toBe("local");
  });
});

describe("mesclar: mapas por chave", () => {
  it("conceito: revisão mais recente vence; sem `last`, usa `due`; empate, mais revisões", () => {
    const r = m(
      { concepts: { a: { last: 10, n: 1 }, b: { due: 5, n: 1 }, c: { last: 7, n: 2 } } },
      { concepts: { a: { last: 20, n: 0 }, b: { due: 9, n: 0 }, c: { last: 7, n: 5 } } },
    );
    const c = r["concepts"] as Record<string, { n: number }>;
    expect(c["a"]?.n).toBe(0);
    expect(c["b"]?.n).toBe(0);
    expect(c["c"]?.n).toBe(5);
    const r2 = m({ concepts: { a: { last: 30, n: 1 } } }, { concepts: { a: { last: 20, n: 9 } } });
    expect((r2["concepts"] as Record<string, { n: number }>)["a"]?.n).toBe(1);
  });
  it("questão vista: resposta mais recente, total de vezes o maior", () => {
    const r = m({ seen: { q: { ok: false, n: 7, lastTs: 1 } } }, { seen: { q: { ok: true, n: 2, lastTs: 9 } } });
    expect((r["seen"] as Record<string, unknown>)["q"]).toEqual({ ok: true, n: 7, lastTs: 9 });
    const r2 = m({ seen: { q: { ok: true, n: 1, lastTs: 9 } } }, { seen: { q: { ok: false, n: 4, lastTs: 1 } } });
    expect((r2["seen"] as Record<string, unknown>)["q"]).toEqual({ ok: true, n: 4, lastTs: 9 });
  });
  it("concluído: entre timestamps o maior; true vence ausência", () => {
    const r = m({ fichas: { a: 10, b: true, c: 0 } }, { fichas: { a: 30, b: 0, c: 5 } });
    expect(r["fichas"]).toEqual({ a: 30, b: true, c: 5 });
    expect(m({ lessons: { x: 50 } }, { lessons: { x: 20 } })["lessons"]).toEqual({ x: 50 });
    expect(m({ guia: { x: false } }, { guia: { x: true } })["guia"]).toEqual({ x: true });
  });
  it("dicas vistas em qualquer aparelho continuam vistas", () => {
    expect(m({ dicas: { home: 1 } }, { dicas: { exam: 1 } })["dicas"]).toEqual({ home: 1, exam: 1 });
  });
  it("conquista: a primeira data de desbloqueio", () => {
    expect(m({ ach: { a: 100, b: true } }, { ach: { a: 50, b: 0 } })["ach"]).toEqual({ a: 50, b: true });
    expect(m({ ach: { a: 0 } }, { ach: { a: true } })["ach"]).toEqual({ a: true });
  });
  it("XP por dia: o maior; cards: o mais usado; decks: soma de máximos", () => {
    const r = m(
      { dias: { "2026-11-13": 40 }, cards: { c: { n: 3, k: "a" } }, decks: { d: { n: 2, melhor: 9, nome: "x" } } },
      { dias: { "2026-11-13": 70 }, cards: { c: { n: 8, k: "b" } }, decks: { d: { n: 5, melhor: 4 } } },
    );
    expect(r["dias"]).toEqual({ "2026-11-13": 70 });
    expect(r["cards"]).toEqual({ c: { n: 8, k: "b" } });
    expect(r["decks"]).toEqual({ d: { n: 5, melhor: 9, nome: "x" } });
    expect(m({ cards: { c: { n: 8, k: "a" } } }, { cards: { c: { n: 3, k: "b" } } })["cards"]).toEqual({ c: { n: 8, k: "a" } });
  });
  it("valores que não são mapas viram mapa vazio, sem quebrar", () => {
    const r = m({ seen: [1, 2], fichas: "x" }, { seen: null });
    expect(r["seen"]).toEqual({});
    expect(r["fichas"]).toEqual({});
  });
});

describe("mesclar: histórico de simulados", () => {
  it("une sem repetir, do mais novo para o mais velho, e corta em 60", () => {
    const sim = (ts: number): Estado => ({ ts, exam: "saa", score: 700 });
    const a = Array.from({ length: 40 }, (_, i) => sim(i));
    const b = Array.from({ length: 40 }, (_, i) => sim(i + 30));
    const r = m({ sims: a }, { sims: b })["sims"] as { ts: number }[];
    expect(r).toHaveLength(60);
    expect(r[0]?.ts).toBe(69);
    expect(r.at(-1)?.ts).toBe(10);
    expect(new Set(r.map((x) => x.ts)).size).toBe(60);
  });
  it("mesmo ts com prova ou nota diferente são registros distintos", () => {
    const r = m(
      { sims: [{ ts: 1, exam: "saa", score: 700 }] },
      {
        sims: [
          { ts: 1, exam: "clf", score: 700 },
          { ts: 1, exam: "saa", score: 800 },
        ],
      },
    )["sims"] as unknown[];
    expect(r).toHaveLength(3);
  });
  it("lista ausente de um lado preserva a do outro", () => {
    expect(m({ sprints: [{ ts: 5 }] }, {})["sprints"]).toEqual([{ ts: 5 }]);
    expect(m({ challenges: "x" }, { challenges: [{ ts: 2 }] })["challenges"]).toEqual([{ ts: 2 }]);
  });
});

describe("temProgresso", () => {
  it("só xp, respostas ou fichas contam", () => {
    expect(temProgresso({})).toBe(false);
    expect(temProgresso({ xp: 0, answered: 0, fichas: {} })).toBe(false);
    expect(temProgresso({ xp: 1 })).toBe(true);
    expect(temProgresso({ answered: 1 })).toBe(true);
    expect(temProgresso({ fichas: { a: 1 } })).toBe(true);
    expect(temProgresso({ xp: Number.NaN, fichas: [1] })).toBe(false);
  });
});
