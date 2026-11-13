import { describe, expect, it } from "vitest";
import { dadosSeguros, eventosPermitidos, limpar, navegadorResumido } from "../../src/features/telemetria/telemetria";

describe("telemetria anônima", () => {
  it("tira e-mail, token, chave e parâmetros de URL", () => {
    const t = limpar(
      "falhou para maria.silva+x@empresa.com.br em https://app.exemplo.com/p?code=abc123&token=zzz com eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.abcdefghijk e sb_publishable_ABCDEFGHIJKLMN",
      500,
    );
    expect(t).not.toMatch(/maria|abc123|zzz|eyJ|sb_publishable_ABC/);
    expect(t).toContain("[email]");
    expect(t).toContain("https://app.exemplo.com/p");
    expect(t).toContain("[token]");
    expect(t).toContain("[chave]");
  });

  it("corta no tamanho máximo e normaliza espaços", () => {
    expect(limpar("a   b\n\nc", 100)).toBe("a b c");
    expect(limpar("x".repeat(900), 500)).toHaveLength(500);
  });

  it("resume o navegador sem guardar o user agent", () => {
    expect(navegadorResumido("Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/142.0.0.0 Mobile Safari/537.36")).toBe(
      "Chrome 142 móvel",
    );
    expect(navegadorResumido("Mozilla/5.0 (Macintosh) AppleWebKit/605.1.15 Version/18.1 Safari/605.1.15")).toBe("Safari 18");
    expect(navegadorResumido("Mozilla/5.0 Edg/141.0")).toBe("Edge 141");
    expect(navegadorResumido("curl/8")).toBe("outro");
  });

  it("evento só leva dados simples, com chave válida, no máximo 8", () => {
    const d = dadosSeguros({ exam: "saa", score: 812, pass: true, obj: { a: 1 }, "Chave Ruim": 1, email: "a@b.com", n: Number.NaN });
    expect(d).toEqual({ exam: "saa", score: 812, pass: true, email: "[email]" });
    expect(
      Object.keys(dadosSeguros(Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`k${"abcdefghijklmnopqrst"[i] ?? ""}`, i])))),
    ).toHaveLength(8);
  });

  it("respeita Do Not Track, GPC e a opção do aluno", () => {
    expect(eventosPermitidos({}, null)).toBe(true);
    expect(eventosPermitidos({ doNotTrack: "1" }, null)).toBe(false);
    expect(eventosPermitidos({ globalPrivacyControl: true }, null)).toBe(false);
    expect(eventosPermitidos({}, "0")).toBe(false);
  });
});

import { eventoDaRota } from "../../src/features/telemetria/telemetria";
describe("evento da rota", () => {
  it("mapeia só as telas que interessam", () => {
    expect(eventoDaRota("exam", { exam: "saa" })).toEqual({ nome: "abriu_prova", dados: { exam: "saa" } });
    expect(eventoDaRota("serv", { id: "s3" })).toEqual({ nome: "abriu_servico", dados: { servico: "s3" } });
    expect(eventoDaRota("home", {})).toBeNull();
    expect(eventoDaRota("exam", { exam: 42 })).toEqual({ nome: "abriu_prova", dados: { exam: "" } });
  });
});

import { ambienteDeProducao } from "../../src/features/telemetria/telemetria";
describe("onde a telemetria envia", () => {
  it("nunca em build local, CI ou localhost", () => {
    expect(ambienteDeProducao("dev", "awssimula.vercel.app")).toBe(false);
    expect(ambienteDeProducao("a1b2c3d", "localhost")).toBe(false);
    expect(ambienteDeProducao("a1b2c3d", "127.0.0.1")).toBe(false);
    expect(ambienteDeProducao("a1b2c3d", "app.localhost")).toBe(false);
    expect(ambienteDeProducao("a1b2c3d", "awssimula.vercel.app")).toBe(true);
  });
});
