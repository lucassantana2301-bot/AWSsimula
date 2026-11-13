import { describe, expect, it } from "vitest";
import {
  blocoReportar,
  completaDisponivel,
  contaParaProntidao,
  distribuir,
  errosDoBanco,
  especCompleta,
  minutosProporcionais,
  montarErros,
  montarPorDominio,
  montarSimulado,
  motivoValido,
  notaEscalonada,
  pesoDoDominio,
  porPrioridade,
  relogio,
  rotuloModo,
  telaRevisao,
} from "../../src/features/simulado/simulado";

/* gerador determinístico (mulberry32) para o sorteio ser repetível */
function semente(s: number): () => number {
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const banco = (porDom: Record<string, number>) =>
  Object.entries(porDom).flatMap(([dom, n]) => Array.from({ length: n }, (_, i) => ({ id: `${dom}-${String(i)}`, dom })));
const DOMS = [
  { id: "d1", w: "25-30%" },
  { id: "d2", w: "35-40%" },
  { id: "d3", w: "30-35%" },
];

describe("pesoDoDominio", () => {
  it("usa o ponto médio da faixa", () => {
    expect(pesoDoDominio("25-30%")).toBe(27.5);
    expect(pesoDoDominio("30%")).toBe(30);
    expect(pesoDoDominio("12,5%")).toBe(12.5);
    expect(pesoDoDominio("—")).toBe(25);
  });
});

describe("distribuir", () => {
  it("soma sempre n", () => {
    for (const n of [1, 7, 24, 50, 65]) {
      const r = distribuir(n, [27.5, 37.5, 32.5]);
      expect(r.reduce((a, b) => a + b, 0)).toBe(n);
    }
  });
  it("não estoura quando o arredondamento simples estouraria", () => {
    /* round(10/3*... ) daria 1+1+1+1+1+1 = 6 para n=5 com 6 pesos iguais */
    expect(distribuir(5, [1, 1, 1, 1, 1, 1]).reduce((a, b) => a + b, 0)).toBe(5);
  });
  it("respeita a proporção", () => {
    expect(distribuir(100, [30, 26, 24, 20])).toEqual([30, 26, 24, 20]);
  });
  it("casos de borda", () => {
    expect(distribuir(0, [1, 2])).toEqual([0, 0]);
    expect(distribuir(3, [])).toEqual([]);
    expect(distribuir(4, [0, 0])).toEqual([2, 2]);
  });
});

describe("porPrioridade", () => {
  it("inéditas, depois erradas, depois acertadas mais antigas", () => {
    const qs = [
      { id: "ok-novo", dom: "d1" },
      { id: "errada", dom: "d1" },
      { id: "inedita", dom: "d1" },
      { id: "ok-velho", dom: "d1" },
    ];
    const vistos = {
      "ok-novo": { ok: true, lastTs: 200 },
      errada: { ok: false, lastTs: 300 },
      "ok-velho": { ok: true, lastTs: 100 },
    };
    expect(porPrioridade(qs, vistos, semente(1)).map((q) => q.id)).toEqual(["inedita", "errada", "ok-velho", "ok-novo"]);
  });
});

describe("montarSimulado", () => {
  it("monta n questões sem repetir, na proporção", () => {
    const b = banco({ d1: 30, d2: 30, d3: 30 });
    const s = montarSimulado(b, DOMS, 24, {}, semente(2));
    expect(s).toHaveLength(24);
    expect(new Set(s.map((q) => q.id)).size).toBe(24);
    const conta = (d: string) => s.filter((q) => q.dom === d).length;
    expect([conta("d1"), conta("d2"), conta("d3")]).toEqual(distribuir(24, [27.5, 37.5, 32.5]));
  });
  it("completa com outros domínios quando um está curto", () => {
    const b = banco({ d1: 2, d2: 30, d3: 30 });
    const s = montarSimulado(b, DOMS, 24, {}, semente(3));
    expect(s).toHaveLength(24);
    expect(s.filter((q) => q.dom === "d1")).toHaveLength(2);
  });
  it("banco menor que n devolve o banco todo", () => {
    expect(montarSimulado(banco({ d1: 3, d2: 2, d3: 1 }), DOMS, 24, {}, semente(4))).toHaveLength(6);
  });
  it("prefere inéditas", () => {
    const b = banco({ d1: 20, d2: 20, d3: 20 });
    const vistos = Object.fromEntries(b.filter((_, i) => i % 2 === 0).map((q) => [q.id, { ok: true, lastTs: 1 }]));
    const s = montarSimulado(b, DOMS, 24, vistos, semente(5));
    expect(s.every((q) => !vistos[q.id])).toBe(true);
  });
});

describe("modos parciais", () => {
  const b = banco({ d1: 20, d2: 20 });
  it("por domínio só pega do domínio", () => {
    const s = montarPorDominio(b, "d2", 15, {}, semente(6));
    expect(s).toHaveLength(15);
    expect(s.every((q) => q.dom === "d2")).toBe(true);
  });
  it("erros: só as erradas, as mais recentes primeiro", () => {
    const vistos = {
      "d1-0": { ok: false, lastTs: 10 },
      "d1-1": { ok: true, lastTs: 50 },
      "d2-3": { ok: false, lastTs: 30 },
    };
    expect(errosDoBanco(b, vistos).map((q) => q.id)).toEqual(["d2-3", "d1-0"]);
    expect(montarErros(b, vistos, 1, semente(7)).map((q) => q.id)).toEqual(["d2-3"]);
  });
  it("tempo proporcional com piso", () => {
    expect(minutosProporcionais(35, 24, 15)).toBe(22);
    expect(minutosProporcionais(35, 24, 1)).toBe(5);
    expect(minutosProporcionais(35, 0, 10)).toBe(5);
  });
  it("prontidão ignora modos parciais", () => {
    expect(contaParaProntidao(undefined)).toBe(true);
    expect(contaParaProntidao("completo")).toBe(true);
    expect(contaParaProntidao("dominio")).toBe(false);
    expect(contaParaProntidao("erros")).toBe(false);
    expect(rotuloModo("dominio", "Segurança")).toContain("Segurança");
  });
});

describe("prova completa", () => {
  it("usa fullQ quando a prova real tem faixa", () => {
    expect(especCompleta({ realQ: "40-60", realMin: 45, fullQ: 50 })).toEqual({ q: 50, min: 45 });
    expect(especCompleta({ realQ: "40-60", realMin: 45 })).toBeNull();
    expect(especCompleta({ realQ: "65", realMin: 130 })).toEqual({ q: 65, min: 130 });
  });
  it("exige folga de 1,5x no banco", () => {
    expect(completaDisponivel({ realQ: "65", realMin: 130 }, 97)).toBe(false);
    expect(completaDisponivel({ realQ: "65", realMin: 130 }, 98)).toBe(true);
  });
});

describe("notaEscalonada", () => {
  it("tudo certo é 1000 e tudo errado é 300", () => {
    const tudo = { d1: { n: 5, ok: 5 }, d2: { n: 5, ok: 5 }, d3: { n: 5, ok: 5 } };
    expect(notaEscalonada(tudo, DOMS)).toBe(1000);
    expect(notaEscalonada({ d1: { n: 5, ok: 0 }, d2: { n: 5, ok: 0 }, d3: { n: 5, ok: 0 } }, DOMS)).toBe(300);
  });
  it("domínio ausente não puxa a nota para baixo", () => {
    expect(notaEscalonada({ d2: { n: 15, ok: 15 }, d1: { n: 0, ok: 0 } }, DOMS)).toBe(1000);
  });
  it("pondera pelo peso oficial", () => {
    /* d2 (37,5) certo, d1 (27,5) e d3 (32,5) errados: 300 + 700 * 37,5/97,5 */
    const r = notaEscalonada({ d1: { n: 4, ok: 0 }, d2: { n: 4, ok: 4 }, d3: { n: 4, ok: 0 } }, DOMS);
    expect(r).toBe(Math.round(300 + (700 * 37.5) / 97.5));
  });
});

describe("telaRevisao", () => {
  const base = {
    codigo: "AZ-900",
    rotulo: "Simulado curto",
    aws: false,
    restanteMs: 61_000,
    respondidas: [true, false, true, false],
    marcadas: [false, false, true, false],
  };
  it("conta respondidas, em branco e marcadas", () => {
    const t = telaRevisao(base).texto;
    expect(t).toMatch(/<b class="mono">2<\/b><span class="t-xs dim">respondidas/);
    expect(t).toMatch(/<b class="mono">2<\/b><span class="t-xs dim">em branco/);
    expect(t).toMatch(/<b class="mono">1<\/b><span class="t-xs dim">marcadas/);
    expect(t).toContain('id="simclock"');
    expect(t).toContain("01:01");
    expect(t).toContain("Questão 2: em branco");
    expect(t).toContain("Questão 3: marcada");
  });
  it("aponta para a primeira em branco e a primeira marcada", () => {
    const t = telaRevisao(base).texto;
    expect(t).toMatch(/data-i="1"\s*>Ir para a primeira em branco/);
    expect(t).toMatch(/data-i="2"\s*>Revisar marcadas/);
  });
  it("desabilita atalhos sem alvo e some com o aviso quando tudo foi respondido", () => {
    const t = telaRevisao({ ...base, respondidas: [true, true, true, true], marcadas: [false, false, false, false] }).texto;
    expect(t).toMatch(/disabled>Ir para a primeira em branco/);
    expect(t).toMatch(/disabled>Revisar marcadas/);
    expect(t).not.toContain("conta como erro");
  });
  it("escapa o rótulo", () => {
    expect(telaRevisao({ ...base, rotulo: "<b>x</b>" }).texto).toContain("&lt;b&gt;x&lt;/b&gt;");
  });
});

describe("reportar", () => {
  it("valida motivo e escapa o id", () => {
    expect(motivoValido("gabarito")).toBe(true);
    expect(motivoValido("qualquer")).toBe(false);
    const t = blocoReportar('x"><img>', false).texto;
    expect(t).not.toContain("<img>");
    expect(t.match(/data-act="qreport"/g)).toHaveLength(3);
    expect(blocoReportar("q", true).texto).toContain("Obrigado");
  });
  it("relógio", () => {
    expect(relogio(-5)).toBe("00:00");
    expect(relogio(3_600_000)).toBe("60:00");
  });
});
