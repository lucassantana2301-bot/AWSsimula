import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { formatarVital, htmlPainel, lerVitaisPainel, type Painel } from "../../src/features/conta/conta";
import { NOMES_EVENTO } from "../../src/features/telemetria/telemetria";
import { AMOSTRA, clsDeJanelas, dadosDosVitais, faixa, observarVitais } from "../../src/features/telemetria/vitais";

describe("faixa (limites oficiais)", () => {
  it.each([
    ["lcp", 2500, "bom"],
    ["lcp", 2501, "melhorar"],
    ["lcp", 4001, "ruim"],
    ["inp", 200, "bom"],
    ["inp", 499, "melhorar"],
    ["inp", 501, "ruim"],
    ["cls", 0.1, "bom"],
    ["cls", 0.2, "melhorar"],
    ["cls", 0.3, "ruim"],
  ] as const)("%s %d → %s", (m, v, f) => {
    expect(faixa(m, v)).toBe(f);
  });
});

describe("clsDeJanelas", () => {
  it("soma dentro da janela e fica com a maior", () => {
    expect(
      clsDeJanelas([
        { valor: 0.05, t: 0, comInput: false },
        { valor: 0.05, t: 500, comInput: false },
        /* pausa > 1 s: nova janela */
        { valor: 0.02, t: 2000, comInput: false },
      ]),
    ).toBeCloseTo(0.1);
  });
  it("janela fecha em 5 s mesmo sem pausa", () => {
    const seguidas = Array.from({ length: 12 }, (_, i) => ({ valor: 0.01, t: i * 900, comInput: false }));
    expect(clsDeJanelas(seguidas)).toBeCloseTo(0.06);
  });
  it("ignora mudanças logo após input do usuário", () => {
    expect(clsDeJanelas([{ valor: 0.5, t: 0, comInput: true }])).toBe(0);
    expect(clsDeJanelas([])).toBe(0);
  });
});

describe("dadosDosVitais", () => {
  it("arredonda, classifica e só aceita tipos de rede conhecidos", () => {
    expect(dadosDosVitais({ lcp: 1834.6, inp: 96.2, cls: 0.01234 }, "4g")).toEqual({
      lcp: 1835,
      lcp_faixa: "bom",
      inp: 96,
      inp_faixa: "bom",
      cls: 0.012,
      cls_faixa: "bom",
      rede: "4g",
    });
    expect(dadosDosVitais({ lcp: null, inp: null, cls: null }, "wifi; drop table")).toEqual({});
  });
  it("cabe no filtro de dados seguros da telemetria (≤ 8 chaves, nomes curtos)", () => {
    const d = dadosDosVitais({ lcp: 1, inp: 1, cls: 0 }, "3g");
    expect(Object.keys(d).length).toBeLessThanOrEqual(8);
    for (const k of Object.keys(d)) expect(k).toMatch(/^[a-z_]{1,24}$/);
  });
  it("valor não finito é descartado", () => {
    expect(dadosDosVitais({ lcp: Number.POSITIVE_INFINITY, inp: Number.NaN, cls: 0.2 }, undefined)).toEqual({
      cls: 0.2,
      cls_faixa: "melhorar",
    });
  });
});

describe("observarVitais", () => {
  it("fora da amostra ou sem PerformanceObserver não faz nada", () => {
    let chamou = false;
    expect(() => {
      observarVitais(
        () => (chamou = true),
        () => AMOSTRA,
      );
    }).not.toThrow();
    expect(chamou).toBe(false);
  });
});

describe("eventos: cliente e banco com a mesma lista", () => {
  it("NOMES_EVENTO bate com o check da migração mais recente", () => {
    const pasta = "supabase/migrations";
    const ultima = readdirSync(pasta)
      .filter((f) => f.endsWith(".sql"))
      .sort()
      .map((f) => readFileSync(`${pasta}/${f}`, "utf8"))
      .filter((sql) => sql.includes("eventos_nome_check check"))
      .at(-1);
    const lista = /eventos_nome_check check \(nome in \(([^)]*)\)/.exec(ultima ?? "")?.[1] ?? "";
    const doBanco = [...lista.matchAll(/'([a-z_]+)'/g)].map((m) => m[1]).sort();
    expect(doBanco).toEqual([...NOMES_EVENTO].sort());
  });
});

describe("painel: vitais", () => {
  it("lerVitaisPainel aceita só as três métricas com números finitos", () => {
    expect(
      lerVitaisPainel({ lcp: { p75: 1800, bom: 82, n: 40 }, cls: { p75: "x", bom: 1, n: 1 }, outro: { p75: 1, bom: 1, n: 1 } }),
    ).toEqual({
      lcp: { p75: 1800, bom: 82, n: 40 },
    });
    expect(lerVitaisPainel(null)).toBeUndefined();
    expect(lerVitaisPainel({})).toBeUndefined();
    expect(lerVitaisPainel([1])).toBeUndefined();
  });
  it("formatarVital", () => {
    expect(formatarVital("lcp", 1834)).toBe("1.8 s");
    expect(formatarVital("inp", 96.4)).toBe("96 ms");
    expect(formatarVital("cls", 0.0412)).toBe("0.04");
  });
  it("seção aparece só com dados", () => {
    const base: Painel = {
      dias: 7,
      sessoes: 1,
      contas: 0,
      contas_ativas: 0,
      eventos: {},
      provas: {},
      simulados: {},
      servicos_top: [],
      erros: [],
    };
    expect(htmlPainel(base).texto).not.toContain("Web Vitals");
    const t = htmlPainel({ ...base, vitais: { inp: { p75: 120, bom: 90, n: 12 } } }).texto;
    expect(t).toContain("Web Vitals");
    expect(t).toContain("INP · 90% bom · 12 sessões");
    expect(t).toContain("120 ms");
  });
});
