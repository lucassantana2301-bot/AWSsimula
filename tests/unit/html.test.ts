import { describe, expect, it } from "vitest";
import { confiavel, escapar, html, url } from "../../src/lib/html";

describe("html`` com escape automático", () => {
  it("escapa texto interpolado no corpo e em atributo", () => {
    const nome = `<img src=x onerror="alert(1)">`;
    const h = html`<p title="${nome}">${nome}</p>`.texto;
    expect(h).toBe(`<p title="&lt;img src=x onerror=&quot;alert(1)&quot;&gt;">&lt;img src=x onerror=&quot;alert(1)&quot;&gt;</p>`);
    expect(h).not.toMatch(/<img/);
  });

  it("aspas simples e crase também saem escapadas", () => {
    expect(escapar(`' \``)).toBe("&#39; &#96;");
  });

  it("aninha html sem escapar duas vezes", () => {
    const item = (t: string) => html`<li>${t}</li>`;
    const itens = ["a&b", "c"].map(item);
    expect(html`<ul>${itens}</ul>`.texto).toBe("<ul><li>a&amp;b</li><li>c</li></ul>");
  });

  it("condicional: false/null/undefined somem; true é erro", () => {
    const mostrar = (n: number): boolean => n > 1;
    expect(html`<b>${mostrar(0) && html`x`}</b>${null}${undefined}`.texto).toBe("<b></b>");
    expect(html`<b>${mostrar(2) && html`x`}</b>`.texto).toBe("<b>x</b>");
    expect(() => html`${true as unknown as false}`).toThrow(TypeError);
  });

  it("números entram, NaN/Infinity são erro", () => {
    expect(html`${42}`.texto).toBe("42");
    expect(() => html`${Number.NaN}`).toThrow(TypeError);
  });

  it("confiavel() é a única forma de pular o escape", () => {
    expect(html`${confiavel("<svg></svg>")}`.texto).toBe("<svg></svg>");
    expect(html`${"<svg></svg>"}`.texto).toBe("&lt;svg&gt;&lt;/svg&gt;");
  });

  it("url() bloqueia esquemas perigosos", () => {
    expect(url("https://learn.microsoft.com/x")).toBe("https://learn.microsoft.com/x");
    expect(url("/api/r?e=saa")).toBe("/api/r?e=saa");
    for (const ruim of [
      "//evil.example/x",
      "\\\\evil.example",
      "javascript:alert(1)",
      " JaVaScRiPt:alert(1)",
      "data:text/html,<script>",
      "vbscript:x",
    ])
      expect(url(ruim)).toBe("#");
  });

  it("toString devolve o texto (usável em innerHTML e em templates antigos)", () => {
    expect(String(html`<i>${"<"}</i>`)).toBe("<i>&lt;</i>");
  });
});
