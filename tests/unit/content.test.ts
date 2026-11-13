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

  describe("vídeos", () => {
    const com = (videos: unknown) => validarConteudo({ ...raw, videos }).map((x) => `${x.onde}: ${x.msg}`);
    const v = (yt: string, lang: "pt" | "en", extra: object = {}) => ({
      yt,
      titulo: "Vídeo oficial",
      canal: "Amazon Web Services",
      lang,
      ...extra,
    });

    it("recusa canal não oficial", () => {
      expect(com({ s3: [{ ...v("aaaaaaaaaaa", "pt"), canal: "Canal Qualquer" }] }).join("\n")).toMatch(/guia\/videos/);
    });
    it("recusa inglês antes do português", () => {
      expect(com({ s3: [v("aaaaaaaaaaa", "en"), v("bbbbbbbbbbb", "pt")] }).join("\n")).toMatch(/português deve vir antes/);
    });
    it("recusa mais de 2 vídeos, id inválido e duração fora de 1–6 min", () => {
      expect(com({ s3: [v("aaaaaaaaaaa", "pt"), v("bbbbbbbbbbb", "pt"), v("ccccccccccc", "en")] })).not.toEqual([]);
      expect(com({ s3: [v("curto", "pt")] })).not.toEqual([]);
      expect(com({ s3: [v("aaaaaaaaaaa", "pt", { min: 12 })] })).not.toEqual([]);
    });
    it("recusa serviço inexistente, serviço fechado e vídeo repetido", () => {
      expect(com({ "nao-existe": [v("aaaaaaaaaaa", "pt")] }).join("\n")).toMatch(/inexistente/);
      expect(com({ kendra: [v("aaaaaaaaaaa", "pt")] }).join("\n")).toMatch(/fechado/);
      expect(com({ s3: [v("aaaaaaaaaaa", "pt")], ebs: [v("aaaaaaaaaaa", "en")] }).join("\n")).toMatch(/repetido/);
    });
  });
});
