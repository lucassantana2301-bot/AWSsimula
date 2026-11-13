/**
 * Auditoria WCAG 2.1 AA com axe-core em cada tela, nos temas claro e escuro.
 * Falha em qualquer violação; a mensagem lista regra, impacto e elementos.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

interface Tela {
  nome: string;
  abrir: (p: Page) => Promise<void>;
}

const clicar = async (p: Page, seletor: string): Promise<void> => {
  await p.locator(seletor).first().click();
  await p.waitForTimeout(350);
};

const TELAS: Tela[] = [
  { nome: "início", abrir: async () => {} },
  { nome: "trilha", abrir: (p) => clicar(p, '[data-act="trilha"]') },
  { nome: "prova SAA", abrir: (p) => clicar(p, '[data-act="exam"][data-exam="saa"]') },
  {
    nome: "guia",
    abrir: async (p) => {
      await clicar(p, '[data-act="guia"]');
      await p.locator(".gs-card").first().waitFor();
    },
  },
  {
    nome: "serviço do guia (S3, com vídeos)",
    abrir: async (p) => {
      await clicar(p, '[data-act="guia"]');
      await clicar(p, '[data-act="gserv"][data-id="s3"]');
    },
  },
  { nome: "treinar", abrir: (p) => clicar(p, '[data-act="review"]') },
  { nome: "desafios", abrir: (p) => clicar(p, '[data-act="chall"]') },
  {
    nome: "AWS × Azure",
    abrir: async (p) => {
      await clicar(p, '[data-act="review"]');
      await clicar(p, '[data-act="compare"]');
    },
  },
  { nome: "perfil (conta, calendário, privacidade)", abrir: (p) => clicar(p, '[data-act="me"]') },
];

for (const tema of ["light", "dark"] as const) {
  test.describe(`tema ${tema === "light" ? "claro" : "escuro"}`, () => {
    test.use({ colorScheme: tema });
    for (const t of TELAS) {
      test(`${t.nome}: sem violação WCAG 2.1 AA`, async ({ page }) => {
        await page.goto("/");
        await page.locator("#app").waitFor();
        await t.abrir(page);
        /* mede o estado final: entradas animadas (opacidade subindo) enganam o cálculo de contraste */
        await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined))));
        const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
        const resumo = r.violations.map(
          (v) =>
            `${v.id} (${v.impact ?? "?"}): ${v.help}\n    ${v.nodes
              .slice(0, 4)
              .map((n) => n.target.join(" "))
              .join("\n    ")}`,
        );
        expect(resumo, resumo.join("\n")).toEqual([]);
      });
    }
  });
}
