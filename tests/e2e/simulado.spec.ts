/**
 * Fluxo completo do simulado (auditoria de QA, item 14), em Chrome, Firefox e WebKit:
 * começar → responder → marcar → sair → recarregar → retomar (com a resposta preservada)
 * → revisar → entregar (confirmação em dois toques) → resultado → gabarito → histórico salvo.
 */
import { expect, test, type Page } from "@playwright/test";

const CHAVE = "cloudquest.v2";

async function abrirProva(page: Page, exame = "saa"): Promise<void> {
  await page.goto("/");
  await page.locator("#app").waitFor();
  await page.locator(`[data-act="exam"][data-exam="${exame}"]`).first().click();
  await expect(page.locator('[data-act="simstart"]').first()).toBeVisible();
}

/** Responde a questão da tela se ela for de escolha; devolve a letra escolhida ou null. */
async function responderSePuder(page: Page): Promise<string | null> {
  const opt = page.locator('.sheet [data-act="qpick"]').first();
  if ((await opt.count()) === 0) return null;
  const k = await opt.getAttribute("data-k");
  await opt.click();
  await expect(opt).toHaveAttribute("data-sel", "1");
  return k;
}

const lerEstado = (page: Page): Promise<Record<string, unknown> | null> =>
  page.evaluate((c) => {
    const s = localStorage.getItem(c);
    return s ? (JSON.parse(s) as Record<string, unknown>) : null;
  }, CHAVE);

test.describe("simulado de ponta a ponta", () => {
  test("começa, responde, retoma depois de recarregar e entrega", async ({ page }) => {
    await abrirProva(page);
    await page.locator('[data-act="simstart"]').first().click();
    const contador = page.locator(".sim-bar .tag.mono").nth(1);
    await expect(contador).toHaveText(/^1\/\d+$/);
    const total = Number((await contador.innerText()).split("/")[1]);
    expect(total).toBeGreaterThanOrEqual(10);

    /* acha uma questão de escolha, responde e marca */
    let alvo = 0;
    let letra: string | null = null;
    for (; alvo < total && letra === null; alvo++) {
      letra = await responderSePuder(page);
      if (letra === null) await page.locator('[data-act="simnext"]').click();
    }
    alvo--;
    expect(letra, "o sorteio deveria trazer ao menos uma questão de escolha").not.toBeNull();
    await page.locator('[data-act="simflag"]').click();
    await expect(page.locator('[data-act="simflag"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(`.qnav [data-i="${String(alvo)}"]`)).toHaveAttribute("data-st", "flag");

    /* o relógio corre e é mm:ss */
    await expect(page.locator("#simclock")).toHaveText(/^\d{1,3}:\d{2}$/);

    /* sai e recarrega: o simulado tem que sobreviver */
    await page.locator('[data-act="simpausa"]').click();
    await page.reload();
    await page.locator("#app").waitFor();
    const retomar = page.locator('[data-act="simresume"]');
    await expect(retomar).toBeVisible();
    await retomar.click();
    await page.locator(`.qnav [data-i="${String(alvo)}"]`).click();
    await expect(page.locator(`.sheet [data-act="qpick"][data-k="${letra ?? ""}"]`)).toHaveAttribute("data-sel", "1");
    await expect(page.locator('[data-act="simflag"]')).toHaveAttribute("aria-pressed", "true");

    /* revisão mostra respondidas e marcadas; entregar pede confirmação porque faltam respostas */
    await page.locator('[data-act="simreview"]').first().click();
    const entregar = page.locator('[data-act="simfinish"]');
    await expect(entregar).toBeVisible();
    await entregar.click();
    await expect(page.locator(".big")).toHaveCount(0);
    await entregar.click();

    /* resultado: nota na escala, gabarito e filtros */
    const nota = page.locator(".result .big");
    await expect(nota).toBeVisible();
    const valor = Number(await nota.innerText());
    expect(valor).toBeGreaterThanOrEqual(300);
    expect(valor).toBeLessThanOrEqual(1000);
    await expect(page.getByRole("heading", { name: "Gabarito comentado" })).toBeVisible();
    await page.locator('[data-act="simfilter"][data-f="flag"]').click();
    await expect(page.locator('[data-act="simfilter"][data-f="flag"]')).toHaveAttribute("aria-pressed", "true");

    /* histórico persistido e o simulado em andamento foi limpo */
    const estado = await lerEstado(page);
    const sims = estado?.["sims"] as { exam: string; score: number }[] | undefined;
    expect(sims?.[0]).toMatchObject({ exam: "saa", score: valor });
    expect(estado?.["sim"] ?? null).toBeNull();
    await page.reload();
    await page.locator("#app").waitFor();
    await expect(page.locator('[data-act="simresume"]')).toHaveCount(0);
  });

  test("teclado: setas navegam e F marca", async ({ page }) => {
    await abrirProva(page);
    await page.locator('[data-act="simstart"]').first().click();
    const contador = page.locator(".sim-bar .tag.mono").nth(1);
    await page.locator("body").press("ArrowRight");
    await expect(contador).toHaveText(/^2\//);
    await page.locator("body").press("ArrowLeft");
    await expect(contador).toHaveText(/^1\//);
    await page.locator("body").press("f");
    await expect(page.locator('[data-act="simflag"]')).toHaveAttribute("aria-pressed", "true");
  });

  test("começar outro simulado com um em andamento pede confirmação", async ({ page }) => {
    await abrirProva(page);
    await page.locator('[data-act="simstart"]').first().click();
    await page.locator('[data-act="simpausa"]').click();
    await page.locator('[data-act="exam"][data-exam="saa"]').first().click();
    await page.locator('[data-act="simstart"]').first().click();
    /* primeiro toque só avisa: continua fora do simulado */
    await expect(page.locator(".sim-bar")).toHaveCount(0);
    await page.locator('[data-act="simstart"]').first().click();
    await expect(page.locator(".sim-bar")).toBeVisible();
  });
});
