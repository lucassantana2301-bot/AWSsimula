import { describe, expect, it } from "vitest";
import { join } from "node:path";
import { lerConteudo } from "../../src/content/read-disk";
import { validarConteudo } from "../../src/content/validate";

const raw = lerConteudo(join(__dirname, "..", "..", "content"));

describe("conteúdo", () => {
  it("passa em todos os schemas e regras entre arquivos", () => {
    const problemas = validarConteudo(raw);
    /* mensagem legível no CI: um problema por linha */
    expect(problemas.map((x) => `${x.onde}: ${x.msg}`)).toEqual([]);
  });

  it("não contém estado de execução (embaralhamento) gravado como conteúdo", () => {
    for (const c of Object.values(raw.porExame)) {
      expect(JSON.stringify(c.questions)).not.toMatch(/"shuf(Order)?"/);
    }
  });

  it("detecta gabarito quebrado (o validador não é permissivo)", () => {
    const saa = raw.porExame["saa"];
    if (!saa || !Array.isArray(saa.questions)) throw new Error("conteúdo do SAA ausente");
    const q: unknown = saa.questions.find((x: unknown) => typeof x === "object" && x !== null && "type" in x && x.type === "single");
    if (typeof q !== "object" || q === null) throw new Error("nenhuma questão single no SAA");
    const quebrado = { ...raw, porExame: { ...raw.porExame, saa: { ...saa, questions: [{ ...q, ans: ["Z"] }] } } };
    const msgs = validarConteudo(quebrado)
      .map((x) => x.msg)
      .join("\n");
    expect(msgs).toMatch(/gabarito|ans/);
  });
});
