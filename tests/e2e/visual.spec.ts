/**
 * Regressão visual (auditoria de QA, item 13). Compara telas-chave com instantâneos versionados
 * em visual.spec.ts-snapshots/. Para ficar determinístico: relógio fixo, Math.random com
 * semente, animações desligadas e fontes do próprio app (woff2 empacotado).
 *
 * Mudou o visual de propósito? `npm run test:visual -- --update-snapshots` e revise o diff
 * das imagens no PR. Os instantâneos são gerados no Linux (mesmo SO do CI).
 */
import { expect, test, type Page } from "@playwright/test";

const AGORA = new Date("2026-11-13T12:00:00-03:00");

async function preparar(page: Page): Promise<void> {
  await page.clock.setFixedTime(AGORA);
  await page.addInitScript(() => {
    let s = 20261113;
    Math.random = (): number => (s = (s * 48271) % 2147483647) / 2147483647;
  });
  await page.goto("/");
  await page.locator("#app").waitFor();
  await page.evaluate(() => document.fonts.ready);
}
const pular = (page: Page): Promise<void> => page.locator('[data-act="onb-pular"]').click();

async function estabilizar(page: Page): Promise<void> {
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined))));
}

const opcoes = { fullPage: true, animations: "disabled", caret: "hide", maxDiffPixelRatio: 0.01 } as const;

for (const tema of ["light", "dark"] as const) {
  test.describe(`visual, tema ${tema === "light" ? "claro" : "escuro"}`, () => {
    test.use({ colorScheme: tema, viewport: { width: 1280, height: 900 } });

    test("boas-vindas", async ({ page }) => {
      await preparar(page);
      await estabilizar(page);
      await expect(page).toHaveScreenshot(`boas-vindas-${tema}.png`, opcoes);
    });

    test("início", async ({ page }) => {
      await preparar(page);
      await pular(page);
      await estabilizar(page);
      await expect(page).toHaveScreenshot(`inicio-${tema}.png`, opcoes);
    });

    test("prova SAA", async ({ page }) => {
      await preparar(page);
      await pular(page);
      await page.locator('[data-act="exam"][data-exam="saa"]').first().click();
      await estabilizar(page);
      await expect(page).toHaveScreenshot(`prova-saa-${tema}.png`, opcoes);
    });

    test("questão do simulado", async ({ page }) => {
      await preparar(page);
      await pular(page);
      await page.locator('[data-act="exam"][data-exam="saa"]').first().click();
      await page.locator('[data-act="simstart"]').first().click();
      await estabilizar(page);
      /* o relógio desce mesmo com o tempo fixo de partida: fica mascarado */
      await expect(page).toHaveScreenshot(`simulado-${tema}.png`, { ...opcoes, mask: [page.locator("#simclock")] });
    });
  });
}
