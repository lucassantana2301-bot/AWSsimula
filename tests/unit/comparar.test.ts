import { describe, expect, it } from "vitest";
import { leuAsDuasNuvens, telaComparar } from "../../src/features/comparar/comparar";

const eq = { c: "Computação", az: "Virtual Machines", aw: "EC2", n: "Cobrança por segundo difere" };

describe("telaComparar", () => {
  it("lista cada par", () => {
    const t = telaComparar([eq, { ...eq, az: "Blob Storage", aw: "S3" }]).texto;
    expect(t.match(/class="eq"/g)).toHaveLength(2);
    expect(t).toContain("EC2");
    expect(t).toContain("Blob Storage");
  });

  it("escapa conteúdo", () => {
    const t = telaComparar([{ ...eq, az: "<img src=x onerror=alert(1)>" }]).texto;
    expect(t).not.toContain("<img");
    expect(t).toContain("&lt;img");
  });

  it("mostra estado vazio sem quebrar", () => {
    const t = telaComparar([]).texto;
    expect(t).not.toContain('class="eq"');
    expect(t).toContain("Nenhuma equivalência");
  });
});

describe("leuAsDuasNuvens", () => {
  const fichas = [
    { id: "a1", exam: "az900" },
    { id: "w1", exam: "clf" },
    { id: "x1", exam: "az104" },
  ];
  it("exige uma ficha de cada nuvem fundamental", () => {
    expect(leuAsDuasNuvens(fichas, { a1: true, w1: 1 })).toBe(true);
    expect(leuAsDuasNuvens(fichas, { a1: true })).toBe(false);
    expect(leuAsDuasNuvens(fichas, { x1: true, w1: true })).toBe(false);
    expect(leuAsDuasNuvens(fichas, { a1: false, w1: true })).toBe(false);
  });
});
