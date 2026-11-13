import { describe, expect, it } from "vitest";
import { blocoCalendario, chaveDia, nivel, semanas } from "../../src/features/progresso/calendario";
import { mesclar } from "../../src/features/conta/mesclar";

const hoje = new Date(2026, 10, 12); // quinta-feira, 12/11/2026

describe("calendário de estudo", () => {
  it("nível pela meta", () => {
    expect([0, 10, 50, 100, 199, 200].map((x) => nivel(x, 100))).toEqual([0, 1, 2, 3, 3, 4]);
    expect(nivel(30, 0)).toBe(1);
  });

  it("12 colunas de segunda a domingo, terminando na semana de hoje, sem dia futuro contado", () => {
    const g = semanas({}, 100, hoje);
    expect(g).toHaveLength(12);
    expect(g.every((c) => c.length === 7)).toBe(true);
    const ultima = g[11] ?? [];
    expect(ultima[0]?.data).toBe("2026-11-09");
    expect(ultima[3]?.data).toBe("2026-11-12");
    expect(ultima[3]?.futuro).toBe(false);
    expect(ultima[4]?.futuro).toBe(true);
    expect(g[0]?.[0]?.data).toBe("2026-08-24");
  });

  it("resumo conta dias estudados e metas batidas; ignora valor inválido", () => {
    const h = blocoCalendario({ "2026-11-12": 120, "2026-11-10": 30, "2026-11-11": Number.NaN, "2025-01-01": 999 }, 100, hoje);
    expect(h).toContain("2 dias de estudo, 1 com a meta de 100 XP batida");
    expect(h).toContain('title="12 nov: 120 XP"');
    expect(h).toContain('role="img"');
  });

  it("chaveDia usa a data local", () => {
    expect(chaveDia(new Date(2026, 0, 1, 23, 30))).toBe("2026-01-01");
  });

  it("mescla de aparelhos fica com o maior XP de cada dia", () => {
    const m = mesclar({ dias: { a: 10, b: 50 }, upd: 1 }, { dias: { b: 20, c: 5 }, upd: 2 });
    expect(m["dias"]).toEqual({ a: 10, b: 50, c: 5 });
  });
});
