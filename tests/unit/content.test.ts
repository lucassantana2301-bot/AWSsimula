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
    const q = (raw.porExame["saa"]!.questions as Array<Record<string, unknown>>).find((x) => x["type"] === "single")!;
    const quebrado = { ...raw, porExame: { ...raw.porExame, saa: { ...raw.porExame["saa"]!, questions: [{ ...q, ans: ["Z"] }] } } };
    const msgs = validarConteudo(quebrado).map((x) => x.msg).join("\n");
    expect(msgs).toMatch(/gabarito|ans/);
  });
});
