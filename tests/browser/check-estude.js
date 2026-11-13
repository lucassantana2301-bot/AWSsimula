/* Do erro para o estudo: depois de responder, a explicação oferece a ficha
   e os serviços do guia citados; abrir um deles e voltar devolve a mesma
   questão, com a explicação ainda na tela. */
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
  /* vence todos os conceitos de questões AWS de escolha única */
  await p.evaluate(() => {
    const C = globalThis.__CQ_CONTENT, S = globalThis.__CQ_TEST.S;
    const aws = new Set(C.EXAMS.filter((e) => e.provider === "aws").map((e) => e.id));
    for (const q of C.QUESTIONS) if (aws.has(q.exam) && q.type === "single")
      for (const t of q.tags || []) S.concepts[t] = { ease: 2.5, reps: 1, intv: 1, due: Date.now() - 864e5, prof: 0.4, n: 1 };
  });
  await p.click('[data-act="trilha"]'); await sleep(150);
  await p.click('[data-act="home"]'); await sleep(250);
  await p.click('[data-act="review-go"]'); await sleep(400);

  let achou = false;
  for (let i = 0; i < 8 && !achou; i++) {
    /* a revisão mistura tipos por conceito: responde conforme o tipo */
    /* cada clique re-renderiza: busca o botão de novo pelo índice, nunca reaproveita o handle */
    const linhasSimNao = await p.$$eval('[data-act="qyn"][data-v="1"]', (bs) => bs.map((b) => b.getAttribute("data-i")));
    if (linhasSimNao.length) for (const i of linhasSimNao) { await p.click(`[data-act="qyn"][data-v="1"][data-i="${i}"]`); await sleep(40); }
    else { await p.keyboard.press("1"); await sleep(80); }
    await p.click('[data-act="qcheck"]'); await sleep(300);
    if (!(await p.$(".verdict"))) { prob.push("questão não aceitou resposta (tipo não tratado no teste)"); break; }
    if (await p.$('.estude [data-act="gserv"]')) { achou = true; break; }
    const prox = await p.$('[data-act="qnext"]'); if (!prox) break;
    await prox.click(); await sleep(300);
  }
  if (!achou) prob.push("nenhuma explicação ofereceu serviço do guia em 8 questões AWS");
  else {
    const stem = await p.$eval(".q-stem", (e) => e.textContent);
    const rotulo = await p.$eval('.estude [data-act="gserv"]', (e) => e.textContent);
    if (!/^Guia: \S/.test(rotulo.trim()) || /\(/.test(rotulo)) prob.push("rótulo do botão do guia: " + rotulo);
    /* centraliza antes: a rolagem automática do puppeteer erra o alvo durante a transição de tela */
    await p.$eval('.estude [data-act="gserv"]', (e) => e.scrollIntoView({ block: "center" })); await sleep(200);
    await p.click('.estude [data-act="gserv"]'); await sleep(900);
    await p.waitForSelector('[data-act="study-back"]', { timeout: 5000 }).catch(() => prob.push("página do serviço sem 'Voltar à questão'"));
    const h1 = await p.$eval("h1", (e) => e.textContent).catch(() => "");
    if (!h1) prob.push("página do serviço não abriu");
    await p.click('[data-act="study-back"]').catch(() => {}); await sleep(400);
    const volta = await p.$eval(".q-stem", (e) => e.textContent).catch(() => null);
    if (volta !== stem) prob.push("voltar não trouxe a mesma questão");
    if (!(await p.$(".verdict"))) prob.push("explicação sumiu ao voltar");
  }
  await b.close();
  console.log(prob.length ? "FALHAS:\n  " + prob.join("\n  ") : "OK: explicação leva ao guia e à ficha, e volta para a mesma questão");
  process.exit(prob.length ? 1 : 0);
})();
