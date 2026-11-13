import { describe, expect, it } from "vitest";
import { blocoPlano, montarPlano } from "../../src/features/progresso/plano";
import { montarAdaptativo, pesosAdaptativos, rotuloModo, contaParaProntidao } from "../../src/features/simulado/simulado";

describe("montarPlano (item 48)", () => {
  const base = { hoje: "2026-11-13", questoesNovas: 100, fichasNovas: 20, temCompleta: true };
  it("reserva 7 dias de reta final e divide o resto", () => {
    const p = montarPlano({ ...base, prova: "2026-12-13" });
    expect(p?.dias).toBe(30);
    expect(p?.diasConteudo).toBe(23);
    expect(p?.porDia).toEqual({ questoes: 5, fichas: 1 });
    expect(p?.marcos.map((m) => m.quando)).toEqual(["2026-12-06", "2026-12-06", "2026-12-11", "2026-12-12"]);
  });
  it("prazo curto: reta final vira metade do prazo", () => {
    const p = montarPlano({ ...base, prova: "2026-11-17" });
    expect(p?.dias).toBe(4);
    expect(p?.diasConteudo).toBe(2);
    expect(p?.porDia.questoes).toBe(50);
  });
  it("amanhã: nada de conteúdo novo prometido além do possível", () => {
    const p = montarPlano({ ...base, prova: "2026-11-14" });
    expect(p?.dias).toBe(1);
    expect(p?.diasConteudo).toBe(1);
  });
  it("data passada, hoje ou inválida não gera plano", () => {
    expect(montarPlano({ ...base, prova: "2026-11-13" })).toBeNull();
    expect(montarPlano({ ...base, prova: "2026-11-01" })).toBeNull();
    expect(montarPlano({ ...base, prova: "13/12/2026" })).toBeNull();
    expect(blocoPlano(null)).toBe(false);
  });
  it("singular quando a meta é 1", () => {
    const t = blocoPlano(montarPlano({ ...base, questoesNovas: 23, fichasNovas: 23, prova: "2026-12-13" }));
    expect(t && t.texto).toContain("questão nova");
    expect(t && t.texto).not.toContain("1</b> fichas");
  });
  it("conteúdo em dia muda a mensagem e escapa nada inesperado", () => {
    const t = blocoPlano(montarPlano({ ...base, questoesNovas: 0, fichasNovas: 0, prova: "2026-12-13" }));
    expect(t && t.texto).toContain("Conteúdo em dia");
  });
  it("atravessa a virada do horário de verão sem errar o número de dias", () => {
    expect(montarPlano({ ...base, hoje: "2026-03-01", prova: "2026-04-01" })?.dias).toBe(31);
  });
});

describe("simulado adaptativo (item 46)", () => {
  const doms = [
    { id: "d1", w: "50%" },
    { id: "d2", w: "50%" },
  ];
  it("domínio fraco pesa mais que o dominado", () => {
    const [forte, fraco] = pesosAdaptativos(doms, { d1: 1, d2: 0 });
    expect(fraco).toBeGreaterThan(forte ?? 0);
    expect((fraco ?? 0) / (forte ?? 1)).toBeCloseTo(3);
  });
  it("proficiência fora de 0..1 é limitada", () => {
    expect(pesosAdaptativos(doms, { d1: 7, d2: -3 })).toEqual(pesosAdaptativos(doms, { d1: 1, d2: 0 }));
  });
  it("monta n questões puxando o domínio fraco", () => {
    const banco = ["d1", "d2"].flatMap((dom) => Array.from({ length: 40 }, (_, i) => ({ id: `${dom}-${String(i)}`, dom })));
    let s = 7;
    const rnd = (): number => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    const q = montarAdaptativo(banco, doms, 20, {}, { d1: 1, d2: 0 }, rnd);
    expect(q).toHaveLength(20);
    expect(q.filter((x) => x.dom === "d2").length).toBe(15);
  });
  it("não conta para a prontidão e tem rótulo próprio", () => {
    expect(contaParaProntidao("adaptativo")).toBe(false);
    expect(rotuloModo("adaptativo")).toMatch(/adaptativo/i);
  });
});
