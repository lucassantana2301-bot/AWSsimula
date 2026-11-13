import { describe, expect, it } from "vitest";
import {
  cartaoResultado,
  lerResultado,
  paginaResultado,
  tituloResultado,
  urlLinkedIn,
  urlResultado,
} from "../../src/features/compartilhar/resultado";

const q = (s: string): URLSearchParams => new URLSearchParams(s);

describe("link público do resultado", () => {
  it("lê parâmetros válidos e deriva 'aprovado' da nota, não do link", () => {
    expect(lerResultado(q("e=saa&s=812&d=2026-11-12"))).toEqual({ exam: "saa", score: 812, pass: true, data: "2026-11-12" });
    expect(lerResultado(q("e=saa&s=700&d=2026-11-12&a=1"))?.pass).toBe(false); /* corte do SAA é 720 */
  });

  it("recusa prova desconhecida, nota fora da escala e data inválida", () => {
    for (const s of [
      "e=xyz&s=800&d=2026-11-12",
      "e=saa&s=1001&d=2026-11-12",
      "e=saa&s=99&d=2026-11-12",
      "e=saa&s=8e2&d=2026-11-12",
      "e=saa&s=800&d=12/11/2026",
      "e=saa&s=800&d=2026-13-45",
      "e=saa&s=800",
    ])
      expect(lerResultado(q(s)), s).toBeNull();
  });

  it("monta o link e o link do LinkedIn", () => {
    const u = urlResultado("https://awssimula.vercel.app/", { exam: "clf", score: 765.4, pass: true, data: "2026-11-12" });
    expect(u).toBe("https://awssimula.vercel.app/api/r?e=clf&s=765&d=2026-11-12");
    expect(urlLinkedIn(u)).toBe(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}`);
  });

  it("título nunca diz certificação nem resultado oficial", () => {
    const t = tituloResultado({ exam: "saa", score: 812, pass: true, data: "2026-11-12" });
    expect(t).toBe("SAA-C03: 812/1000 no simulado de prática (acima do corte)");
    expect(t).not.toMatch(/certifica|oficial|aprovado na prova/i);
  });

  it("página tem Open Graph completo e escapa a URL", () => {
    const r = { exam: "saa", score: 812, pass: true, data: "2026-11-12" };
    const h = paginaResultado(
      r,
      "https://awssimula.vercel.app",
      'https://awssimula.vercel.app/api/r?e=saa&s=812&d=2026-11-12&x="><script>',
    );
    expect(h).toContain('property="og:image" content="https://awssimula.vercel.app/api/og?');
    expect(h).toContain('name="twitter:card" content="summary_large_image"');
    expect(h).toContain('content="noindex"');
    expect(h).not.toContain("<script>");
  });

  it("cartão é uma árvore de elementos com a nota e o rótulo de prática", () => {
    const texto = JSON.stringify(cartaoResultado({ exam: "az900", score: 650, pass: false, data: "2026-11-12" }));
    expect(texto).toContain('"650"');
    expect(texto).toContain("abaixo do corte");
    expect(texto).toContain("Simulado de prática · 12/11/2026");
    /* sem border-box o satori soma o padding e o rodapé (o rótulo de prática) cai fora da imagem */
    expect(cartaoResultado({ exam: "saa", score: 800, pass: true, data: "2026-11-12" }).props.style).toMatchObject({
      boxSizing: "border-box",
      width: 1200,
      height: 630,
    });
  });
});
