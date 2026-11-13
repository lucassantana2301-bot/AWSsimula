import { describe, expect, it } from "vitest";
import { GET as pagina } from "../../api/r";
import { GET as imagem } from "../../api/og";

const base = "https://awssimula.vercel.app";

describe("funções /api", () => {
  it("/api/r devolve HTML com Open Graph para link válido", async () => {
    const res = pagina(new Request(`${base}/api/r?e=saa&s=812&d=2026-11-12&lixo=1`));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    const html = await res.text();
    expect(html).toContain('property="og:url" content="https://awssimula.vercel.app/api/r?e=saa&amp;s=812&amp;d=2026-11-12"');
    expect(html).not.toContain("lixo");
  });

  it("/api/r volta para a home com link inválido", () => {
    const res = pagina(new Request(`${base}/api/r?e=saa&s=5000&d=2026-11-12`));
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(`${base}/`);
  });

  it("/api/og gera um PNG 1200x630 de verdade", async () => {
    const res = await imagem(new Request(`${base}/api/og?e=clf&s=765&d=2026-11-12`));
    expect(res.status).toBe(200);
    const bytes = new Uint8Array(await res.arrayBuffer());
    expect([...bytes.slice(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
    const dv = new DataView(bytes.buffer);
    expect([dv.getUint32(16), dv.getUint32(20)]).toEqual([1200, 630]);
  }, 30_000);

  it("/api/og recusa parâmetro inválido", async () => {
    expect((await imagem(new Request(`${base}/api/og?e=x`))).status).toBe(400);
  });
});
