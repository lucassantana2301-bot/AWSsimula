import { describe, expect, it } from "vitest";
import { GET as imagem } from "../../api/og";
import { responder } from "../../server/api";
import { criarLimite, ipDoCliente, respostaLimite } from "../../server/limite";

describe("criarLimite (balde de fichas)", () => {
  it("permite a rajada, nega a seguinte e repõe com o tempo", () => {
    let t = 0;
    const lim = criarLimite({ capacidade: 3, porSegundo: 1 }, () => t);
    expect([lim("a"), lim("a"), lim("a")].every((v) => v.permitido)).toBe(true);
    const negado = lim("a");
    expect(negado).toMatchObject({ permitido: false, esperar: 1 });
    expect(lim("b").permitido).toBe(true);
    t = 1000;
    expect(lim("a").permitido).toBe(true);
    expect(lim("a").permitido).toBe(false);
  });
  it("Retry-After é o tempo até a próxima ficha, arredondado para cima", () => {
    let t = 0;
    const lim = criarLimite({ capacidade: 1, porSegundo: 1 / 3 }, () => t);
    lim("x");
    expect(lim("x").esperar).toBe(3);
    t = 2000;
    expect(lim("x").esperar).toBe(1);
  });
  it("nunca passa da capacidade, mesmo depois de muito tempo parado", () => {
    let t = 0;
    const lim = criarLimite({ capacidade: 2, porSegundo: 10 }, () => t);
    lim("a");
    t = 3_600_000;
    expect(lim("a").restantes).toBe(1);
  });
  it("relógio voltando não cria fichas", () => {
    let t = 10_000;
    const lim = criarLimite({ capacidade: 1, porSegundo: 1 }, () => t);
    lim("a");
    t = 0;
    expect(lim("a").permitido).toBe(false);
  });
  it("memória limitada: o cliente mais antigo sai quando passa do teto", () => {
    const t = 0;
    const lim = criarLimite({ capacidade: 1, porSegundo: 0.001, maxClientes: 2 }, () => t);
    lim("a");
    lim("b");
    lim("c");
    /* "a" foi descartado e volta com balde cheio; "c" continua vazio */
    expect(lim("a").permitido).toBe(true);
    expect(lim("c").permitido).toBe(false);
  });
  it("recusa configuração sem sentido", () => {
    expect(() => criarLimite({ capacidade: 0, porSegundo: 1 })).toThrow(RangeError);
    expect(() => criarLimite({ capacidade: 1, porSegundo: 0 })).toThrow(RangeError);
    expect(() => criarLimite({ capacidade: Number.NaN, porSegundo: 1 })).toThrow(RangeError);
  });
});

describe("ipDoCliente", () => {
  const h = new Headers({ "x-real-ip": "1.1.1.1", "x-forwarded-for": "2.2.2.2, 3.3.3.3" });
  it("sem proxy confiável, ignora cabeçalhos (o cliente os escreve)", () => {
    expect(ipDoCliente(h, "9.9.9.9", false)).toBe("9.9.9.9");
  });
  it("atrás de proxy: X-Real-IP, depois o primeiro do X-Forwarded-For, depois o socket", () => {
    expect(ipDoCliente(h, "9.9.9.9", true)).toBe("1.1.1.1");
    expect(ipDoCliente(new Headers({ "x-forwarded-for": " 2.2.2.2 , 3.3.3.3" }), "9.9.9.9", true)).toBe("2.2.2.2");
    expect(ipDoCliente(new Headers(), "9.9.9.9", true)).toBe("9.9.9.9");
    expect(ipDoCliente(new Headers(), undefined, false)).toBe("desconhecido");
  });
});

describe("respostaLimite", () => {
  it("429 com Retry-After e sem cache", async () => {
    const r = respostaLimite({ permitido: false, esperar: 4, restantes: 0 });
    expect(r.status).toBe(429);
    expect(r.headers.get("retry-after")).toBe("4");
    expect(r.headers.get("cache-control")).toBe("no-store");
    expect(await r.text()).toMatch(/Muitas requisições/);
  });
});

describe("servidor: limite nas rotas /api", () => {
  const ORIGEM = "http://localhost:8080";
  it("cliente acima do limite recebe 429; outro cliente e o healthz seguem", async () => {
    const lim = criarLimite({ capacidade: 2, porSegundo: 0.001 });
    const pedir = (id: string, caminho = "/api/r?e=saa&s=812&d=2026-11-12"): Promise<Response> =>
      responder("GET", caminho, ORIGEM, { id, limite: lim });
    expect((await pedir("a")).status).toBe(200);
    expect((await pedir("a")).status).toBe(200);
    expect((await pedir("a")).status).toBe(429);
    expect((await pedir("b")).status).toBe(200);
    expect((await pedir("a", "/healthz")).status).toBe(200);
  });
  it("rota inexistente não gasta ficha", async () => {
    const lim = criarLimite({ capacidade: 1, porSegundo: 0.001 });
    expect((await responder("GET", "/api/nada", ORIGEM, { id: "a", limite: lim })).status).toBe(404);
    expect((await responder("GET", "/api/r?e=saa&s=812&d=2026-11-12", ORIGEM, { id: "a", limite: lim })).status).toBe(200);
  });
});

describe("/api/og: URL canônica para o cache da CDN", () => {
  const base = "https://awssimula.vercel.app";
  it.each([
    ["ordem diferente", "d=2026-11-12&s=812&e=saa"],
    ["parâmetro a mais", "e=saa&s=812&d=2026-11-12&utm=x"],
    ["zero à esquerda", "e=saa&s=0812&d=2026-11-12"],
  ])("%s → 301 para e, s, d", async (_, q) => {
    const r = await imagem(new Request(`${base}/api/og?${q}`));
    expect(r.status).toBe(301);
    expect(r.headers.get("location")).toBe("/api/og?e=saa&s=812&d=2026-11-12");
  });
  it("canônica não redireciona", async () => {
    const r = await imagem(new Request(`${base}/api/og?e=saa&s=812&d=2026-11-12`));
    expect(r.status).toBe(200);
  });
});
