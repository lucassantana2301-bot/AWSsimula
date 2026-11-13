import { describe, expect, it } from "vitest";
import { mesclar, temProgresso, type Estado } from "../../src/features/conta/mesclar";

const base = (o: Estado = {}): Estado => ({
  v: 2,
  xp: 0,
  answered: 0,
  streak: 0,
  lastDay: null,
  shields: 1,
  todayXp: 0,
  dayKeyCur: "2026-11-12",
  weekXp: 0,
  weekKey: "2026-11-09",
  concepts: {},
  seen: {},
  fichas: {},
  lessons: {},
  bosses: {},
  guia: {},
  ach: {},
  cards: {},
  decks: {},
  sims: [],
  sprints: [],
  challenges: [],
  theme: "auto",
  bestCombo: 0,
  dailyDone: null,
  dias: {},
  upd: 1000,
  ...o,
});

describe("mesclar progresso local e da conta", () => {
  it("é idempotente", () => {
    const a = base({ xp: 50, concepts: { x: { s: 3, d: 5, last: 10, due: 20, n: 2 } }, sims: [{ ts: 5, exam: "saa", score: 700 }] });
    expect(mesclar(a, a)).toEqual(a);
  });

  it("progresso nunca anda para trás, nos dois sentidos", () => {
    const a = base({ xp: 300, answered: 40, fichas: { f1: 100 }, upd: 2000 });
    const b = base({ xp: 120, answered: 90, fichas: { f2: 200 }, upd: 3000 });
    for (const m of [mesclar(a, b), mesclar(b, a)]) {
      expect(m["xp"]).toBe(300);
      expect(m["answered"]).toBe(90);
      expect(m["fichas"]).toEqual({ f1: 100, f2: 200 });
    }
  });

  it("conceito: vale a revisão mais recente, mesmo que o outro aparelho seja mais novo", () => {
    const antigo = { s: 1, d: 7, last: 100, due: 200, n: 1 };
    const recente = { s: 9, d: 4, last: 500, due: 900, n: 3 };
    const a = base({ concepts: { k: recente }, upd: 1 });
    const b = base({ concepts: { k: antigo }, upd: 9999 });
    expect((mesclar(a, b)["concepts"] as Record<string, unknown>)["k"]).toEqual(recente);
  });

  it("migração: conceito ainda em SM-2 (sem last) compara pela data de revisão", () => {
    const sm2 = { ease: 2.5, intv: 3, due: 800, n: 4 };
    const fsrs = { s: 2, d: 5, last: 300, due: 500, n: 2 };
    expect((mesclar(base({ concepts: { k: sm2 } }), base({ concepts: { k: fsrs } }))["concepts"] as Record<string, unknown>)["k"]).toEqual(
      sm2,
    );
  });

  it("questão vista: última resposta, maior contagem", () => {
    const m = mesclar(base({ seen: { q: { ok: false, n: 5, lastTs: 10 } } }), base({ seen: { q: { ok: true, n: 2, lastTs: 20 } } }));
    expect((m["seen"] as Record<string, unknown>)["q"]).toEqual({ ok: true, n: 5, lastTs: 20 });
  });

  it("conquista guarda a primeira data; histórico une sem repetir, do mais novo ao mais velho", () => {
    const s1 = { ts: 1, exam: "saa", score: 600 };
    const s2 = { ts: 2, exam: "clf", score: 800 };
    const m = mesclar(base({ ach: { a: 50 }, sims: [s1] }), base({ ach: { a: 30, b: 70 }, sims: [s2, s1] }));
    expect(m["ach"]).toEqual({ a: 30, b: 70 });
    expect(m["sims"]).toEqual([s2, s1]);
  });

  it("ofensiva segue quem estudou por último; XP do dia só soma no mesmo dia", () => {
    const ontem = base({ lastDay: "2026-11-11", streak: 9, todayXp: 80, dayKeyCur: "2026-11-11", upd: 1 });
    const hoje = base({ lastDay: "2026-11-12", streak: 3, todayXp: 20, dayKeyCur: "2026-11-12", upd: 2 });
    const m = mesclar(ontem, hoje);
    expect(m["streak"]).toBe(3);
    expect(m["lastDay"]).toBe("2026-11-12");
    expect(m["todayXp"]).toBe(20);
  });

  it("preferências e campos desconhecidos vêm do estado editado por último", () => {
    const m = mesclar(base({ theme: "dark", novo: "x", upd: 5 }), base({ theme: "light", upd: 9 }));
    expect(m["theme"]).toBe("light");
    expect(m["novo"]).toBe("x");
    expect(m["upd"]).toBe(9);
  });

  it("tolera estado remoto vazio ou corrompido", () => {
    const a = base({ xp: 10, concepts: { k: { s: 1, d: 5, last: 1, due: 2, n: 1 } } });
    const m = mesclar(a, { concepts: "lixo", sims: null, xp: "abc" });
    expect(m["xp"]).toBe(10);
    expect(m["concepts"]).toEqual(a["concepts"]);
    expect(m["sims"]).toEqual([]);
  });

  it("temProgresso distingue app novo de progresso real", () => {
    expect(temProgresso(base())).toBe(false);
    expect(temProgresso(base({ answered: 1 }))).toBe(true);
    expect(temProgresso(base({ fichas: { f: 1 } }))).toBe(true);
  });
});
