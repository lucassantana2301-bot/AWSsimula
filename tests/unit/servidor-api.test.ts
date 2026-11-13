import { describe, expect, it } from "vitest";
import { origemPublica, responder } from "../../server/api";

const ORIGEM = "http://localhost:8080";

describe("origemPublica", () => {
  it("normaliza e usa o padrão local", () => {
    expect(origemPublica(undefined)).toBe("http://localhost:8080");
    expect(origemPublica("  ")).toBe("http://localhost:8080");
    expect(origemPublica("https://cq.exemplo.com/qualquer/caminho")).toBe("https://cq.exemplo.com");
  });
  it("recusa esquema que não é http(s)", () => {
    expect(() => origemPublica("javascript:alert(1)")).toThrow();
    expect(() => origemPublica("ftp://x")).toThrow();
  });
});

describe("responder", () => {
  it("healthz", async () => {
    const r = await responder("GET", "/healthz", ORIGEM);
    expect(r.status).toBe(200);
    expect(await r.text()).toBe("ok");
  });
  it("405 para métodos de escrita", async () => {
    const r = await responder("POST", "/api/r", ORIGEM);
    expect(r.status).toBe(405);
    expect(r.headers.get("allow")).toBe("GET, HEAD");
  });
  it("404 fora das rotas", async () => {
    expect((await responder("GET", "/api/nada", ORIGEM)).status).toBe(404);
  });
  it("caminho absoluto não troca a origem", async () => {
    const r = await responder("GET", "http://malicioso.com/api/r?e=saa&s=800&d=2026-11-12", ORIGEM);
    expect(r.status).not.toBe(200);
    const r2 = await responder("GET", "//malicioso.com/api/r", ORIGEM);
    expect([400, 404]).toContain(r2.status);
  });
  it("página do resultado usa a origem configurada, não o Host do cliente", async () => {
    const r = await responder("GET", "/api/r?e=saa&s=812&d=2026-11-12", ORIGEM);
    expect(r.status).toBe(200);
    const html = await r.text();
    expect(html).toContain("http://localhost:8080/api/og");
    expect(html).not.toContain("malicioso");
  });
  it("parâmetro inválido redireciona para a home da origem configurada", async () => {
    const r = await responder("GET", "/api/r?e=xxx", ORIGEM);
    expect(r.status).toBe(302);
    expect(r.headers.get("location")).toBe("http://localhost:8080/");
  });
  it("gera o PNG do cartão", async () => {
    const r = await responder("GET", "/api/og?e=saa&s=812&d=2026-11-12", ORIGEM);
    expect(r.status).toBe(200);
    expect(r.headers.get("content-type")).toBe("image/png");
    const b = new Uint8Array(await r.arrayBuffer());
    expect([...b.slice(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
  }, 20_000);
});
