import { describe, expect, it } from "vitest";
import { GET, MAX_CORPO, POST, lerRelatorios, urlSegura } from "../../api/csp";

const URL_API = "https://awssimula.vercel.app/api/csp";
const pedir = (corpo: string, tipo = "application/csp-report"): Request =>
  new Request(URL_API, { method: "POST", headers: { "Content-Type": tipo }, body: corpo });

describe("urlSegura", () => {
  it("tira query e fragmento (nota, token, e-mail)", () => {
    expect(urlSegura("https://awssimula.vercel.app/api/r?e=saa&s=812#x")).toBe("https://awssimula.vercel.app/api/r");
    expect(urlSegura("https://cdn.exemplo.com/a.js?token=eyJabc")).toBe("https://cdn.exemplo.com/a.js");
  });
  it("palavras-chave e esquemas especiais ficam só com o nome", () => {
    expect(urlSegura("inline")).toBe("inline");
    expect(urlSegura("EVAL")).toBe("eval");
    expect(urlSegura("data:image/png;base64,AAAA")).toBe("data:");
    expect(urlSegura("javascript:alert(document.cookie)")).toBe("javascript:");
  });
  it("lixo vira vazio", () => {
    expect(urlSegura(42)).toBe("");
    expect(urlSegura("não é url")).toBe("");
    expect(urlSegura(undefined)).toBe("");
  });
});

describe("lerRelatorios", () => {
  it("formato report-uri", () => {
    const v = lerRelatorios({
      "csp-report": {
        "document-uri": "https://awssimula.vercel.app/?x=1",
        "effective-directive": "script-src-elem",
        "blocked-uri": "https://mal.exemplo/x.js?q=1",
        "line-number": 12,
        "script-sample": "alert('segredo')",
      },
    });
    expect(v).toEqual([
      {
        diretiva: "script-src-elem",
        bloqueado: "https://mal.exemplo/x.js",
        pagina: "https://awssimula.vercel.app/",
        arquivo: "",
        linha: 12,
        disposicao: "enforce",
      },
    ]);
    expect(JSON.stringify(v)).not.toContain("segredo");
  });
  it("formato Reporting API: só csp-violation, no máximo 10", () => {
    const um = { type: "csp-violation", body: { effectiveDirective: "img-src", blockedURL: "https://x.com/a.png", disposition: "report" } };
    const v = lerRelatorios([...Array.from({ length: 15 }, () => um), { type: "deprecation", body: { effectiveDirective: "img-src" } }]);
    expect(v).toHaveLength(10);
    expect(v[0]).toMatchObject({ diretiva: "img-src", disposicao: "report" });
  });
  it("diretiva inválida ou formato desconhecido: nada", () => {
    expect(lerRelatorios({ "csp-report": { "effective-directive": "<script>" } })).toEqual([]);
    expect(lerRelatorios({ outro: 1 })).toEqual([]);
    expect(lerRelatorios(null)).toEqual([]);
    expect(lerRelatorios("texto")).toEqual([]);
  });
  it("linha absurda vira 0", () => {
    expect(lerRelatorios({ "csp-report": { "effective-directive": "img-src", "line-number": -5 } })[0]?.linha).toBe(0);
    expect(lerRelatorios({ "csp-report": { "effective-directive": "img-src", "line-number": 1.5 } })[0]?.linha).toBe(0);
  });
});

describe("POST /api/csp", () => {
  it("registra uma linha JSON por violação e responde 204", async () => {
    const linhas: string[] = [];
    const r = await POST(
      pedir(JSON.stringify({ "csp-report": { "effective-directive": "connect-src", "blocked-uri": "https://x.com/a" } })),
      (l) => linhas.push(l),
    );
    expect(r.status).toBe(204);
    expect(linhas).toHaveLength(1);
    expect(JSON.parse(linhas[0] ?? "{}")).toMatchObject({ nivel: "aviso", msg: "csp", diretiva: "connect-src" });
  });
  it("aceita application/reports+json com charset", async () => {
    const corpo = JSON.stringify([{ type: "csp-violation", body: { effectiveDirective: "img-src" } }]);
    expect((await POST(pedir(corpo, "application/reports+json; charset=utf-8"), () => undefined)).status).toBe(204);
  });
  it("415 para tipo desconhecido, 400 para JSON inválido, 413 acima do teto", async () => {
    const nada = (): void => undefined;
    expect((await POST(pedir("{}", "text/plain"), nada)).status).toBe(415);
    expect((await POST(pedir("{não json"), nada)).status).toBe(400);
    expect((await POST(pedir("x".repeat(MAX_CORPO + 1)), nada)).status).toBe(413);
  });
  it("413 mesmo sem content-length (corpo em pedaços)", async () => {
    const fluxo = new ReadableStream<Uint8Array>({
      start(c) {
        for (let i = 0; i < 20; i++) c.enqueue(new Uint8Array(1024));
        c.close();
      },
    });
    const req = new Request(URL_API, {
      method: "POST",
      headers: { "Content-Type": "application/csp-report" },
      body: fluxo,
      duplex: "half",
    } as RequestInit);
    expect((await POST(req, () => undefined)).status).toBe(413);
  });
  it("GET responde 405", () => {
    expect(GET().status).toBe(405);
  });
});
