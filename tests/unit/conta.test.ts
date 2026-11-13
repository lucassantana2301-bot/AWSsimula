import { describe, expect, it } from "vitest";
import { canonico, emailValido, mesmoProgresso } from "../../src/features/conta/conta";

describe("conta: comparação e validação", () => {
  it("canonico ignora a ordem das chaves e campos undefined", () => {
    expect(canonico({ b: 1, a: { d: [1, { y: 2, x: 1 }], c: undefined } })).toBe(canonico({ a: { d: [1, { x: 1, y: 2 }] }, b: 1 }));
    expect(canonico([3, null, "a"])).toBe('[3,null,"a"]');
  });

  it("mesmo progresso ignora só o carimbo de edição", () => {
    expect(mesmoProgresso({ xp: 1, upd: 5 }, { upd: 9, xp: 1 })).toBe(true);
    expect(mesmoProgresso({ xp: 1, upd: 5 }, { xp: 2, upd: 5 })).toBe(false);
  });

  it("valida e-mail sem aceitar lixo", () => {
    expect(emailValido("aluno@exemplo.com.br")).toBe(true);
    expect(emailValido("sem-arroba.com")).toBe(false);
    expect(emailValido("a@b.c")).toBe(false);
    expect(emailValido("a b@exemplo.com")).toBe(false);
    expect(emailValido(`${"x".repeat(250)}@ex.com`)).toBe(false);
  });
});

import { htmlPainel, type Painel } from "../../src/features/conta/conta";
describe("painel do dono", () => {
  const p: Painel = {
    dias: 7,
    sessoes: 42,
    contas: 5,
    contas_ativas: 3,
    eventos: {},
    provas: { saa: 20 },
    simulados: { saa: { n: 4, media: 712, aprovados: 3 } },
    servicos_top: [{ id: "s3", n: 9 }],
    erros: [{ mensagem: '<img src=x onerror="alert(1)">', n: 2, ultimo: "", versao: "abc1234" }],
  };
  it("mostra os números e escapa texto vindo do banco", () => {
    const h = htmlPainel(p).texto;
    expect(h).toContain("42");
    expect(h).toContain("SAA: média 712");
    expect(h).toContain("3/4 aprovados");
    expect(h).not.toContain("<img");
    expect(h).toContain("&lt;img");
  });
});
