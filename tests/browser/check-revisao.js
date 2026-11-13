/* Revisão espaçada (FSRS): conceito vencido aparece na home, a sessão
   aceita "não tenho certeza" (botão e tecla D), e a resposta grava o estado
   do FSRS com a próxima data no futuro. Estado antigo do SM-2 é migrado. */
const pup = require("./_navegador");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await pup.launch({ executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const p = await b.newPage();
  const prob = [];
  p.on("pageerror", (e) => prob.push("erro JS: " + e.message));
  await p.setViewport({ width: 390, height: 844 });
  const base = (process.env.CQ_URL || "http://localhost:4173/").replace(/\/?$/, "/");
  await p.goto(base + "?cq-test", { waitUntil: "networkidle0" });

  /* um conceito com questões, salvo no formato antigo (SM-2) e vencido ontem */
  const tag = await p.evaluate(() => {
    const t = globalThis.__CQ_CONTENT.QUESTIONS.find((q) => q.type === "single" && q.tags && q.tags.length)?.tags[0];
    const S = globalThis.__CQ_TEST.S;
    S.concepts[t] = { ease: 2.5, reps: 2, intv: 3, due: Date.now() - 864e5, prof: 0.4, n: 2 };
    return t;
  });
  await p.click('[data-act="trilha"]'); await sleep(200);
  await p.click('[data-act="home"]'); await sleep(300);
  const card = await p.$('[data-act="review-go"]');
  if (!card) prob.push("home sem o cartão 'Revisão de hoje' com conceito vencido");
  else {
    await card.click(); await sleep(400);
    const duv = await p.$('[data-act="qduv"]');
    if (!duv) prob.push("sessão sem o botão 'Não tenho certeza'");
    else {
      await p.keyboard.press("d"); await sleep(150);
      if ((await p.$eval('[data-act="qduv"]', (e) => e.getAttribute("aria-pressed"))) !== "true") prob.push("tecla D não marcou dúvida");
      await p.keyboard.press("1"); await sleep(100);
      await p.keyboard.press("Enter"); await sleep(400);
      if (await p.$('[data-act="qduv"]')) prob.push("botão de dúvida continua depois de confirmar");
    }
    const c = await p.evaluate((t) => globalThis.__CQ_TEST.S.concepts[t], tag);
    if (!c || typeof c.s !== "number" || typeof c.d !== "number" || typeof c.last !== "number") prob.push("estado FSRS não gravado: " + JSON.stringify(c));
    else {
      if (!(c.due > Date.now())) prob.push("próxima revisão não ficou no futuro");
      if (c.d < 1 || c.d > 10) prob.push("dificuldade fora de 1..10: " + c.d);
      if (c.n !== 3) prob.push("contador de revisões: " + c.n);
    }
    const salvo = await p.evaluate(() => Object.keys(localStorage).some((k) => /"last":\d/.test(localStorage.getItem(k) || "")));
    if (!salvo) prob.push("estado FSRS não foi salvo no navegador");
  }
  await b.close();
  console.log(prob.length ? "FALHAS:\n  " + prob.join("\n  ") : "OK: revisão FSRS migra o SM-2, marca dúvida (botão e tecla D) e agenda no futuro");
  process.exit(prob.length ? 1 : 0);
})();
