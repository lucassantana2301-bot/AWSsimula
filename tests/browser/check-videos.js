/* Vídeos do guia: nada do YouTube carrega antes do toque, português vem
   primeiro, a duração só aparece quando conferida, e o toque cria o
   player em youtube-nocookie.com com título acessível. */
const pup = require("./_navegador");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await pup.launch({ executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const p = await b.newPage();
  const prob = [];
  const externos = [];
  p.on("pageerror", (e) => prob.push("erro JS: " + e.message));
  await p.setRequestInterception(true);
  p.on("request", (r) => {
    const u = r.url();
    if (/youtube|ytimg|googlevideo|doubleclick/.test(u)) { externos.push(u); return r.abort(); }
    r.continue();
  });
  await p.setViewport({ width: 390, height: 844 });
  await p.goto(process.env.CQ_URL || "http://localhost:4173/", { waitUntil: "networkidle0" });
  await p.click('[data-act="guia"]');
  await p.waitForSelector(".gs-card", { timeout: 5000 });
  await p.click('[data-act="gserv"][data-id="s3"]');
  await sleep(300);

  const cartoes = await p.$$eval(".gv-card", (cs) => cs.map((c) => ({
    lang: c.querySelector(".gv-lang [aria-hidden]")?.textContent?.trim(),
    rotulo: (c.querySelector("button")?.textContent || "").replace(/\s+/g, " ").trim(),
    meta: c.querySelector(".gv-m")?.textContent || "",
    link: c.querySelector("a.gv-yt")?.getAttribute("rel") || "",
  })));
  if (cartoes.length < 1 || cartoes.length > 2) prob.push("s3 deveria ter 1 ou 2 vídeos, tem " + cartoes.length);
  if (cartoes[0] && cartoes[0].lang !== "PT") prob.push("primeiro vídeo do s3 deveria ser em português");
  for (const c of cartoes) {
    if (!/^Assistir: .+ (PT|EN) em (Português|Inglês) /.test(c.rotulo)) prob.push("nome acessível fora do padrão: " + c.rotulo);
    if (!/noopener/.test(c.link)) prob.push("link do YouTube sem noopener");
  }
  if (await p.$(".gv-frame iframe")) prob.push("player criado antes do toque");
  if (externos.length) prob.push("acessou o YouTube antes do toque: " + externos[0]);

  /* duração exibida só quando existe no conteúdo */
  const dados = await p.evaluate(async () => (await (await fetch([...performance.getEntriesByType("resource")].map((e) => e.name).find((n) => /\/assets\/videos-.*\.json$/.test(n)))).json()));
  const s3 = dados.s3 || [];
  cartoes.forEach((c, i) => {
    const tem = /\d+ min/.test(c.meta);
    if (tem !== (s3[i] && s3[i].min !== undefined)) prob.push("duração exibida sem ter sido conferida: " + c.meta);
  });

  await p.click("button[data-gv-play]");
  await sleep(300);
  const fr = await p.$eval(".gv-frame iframe", (f) => ({ src: f.src, title: f.title, ref: f.referrerPolicy })).catch(() => null);
  if (!fr) prob.push("o toque não criou o player");
  else {
    if (!/^https:\/\/www\.youtube-nocookie\.com\/embed\/[A-Za-z0-9_-]{11}\?/.test(fr.src)) prob.push("player fora do youtube-nocookie: " + fr.src);
    if (!fr.title.startsWith("Assistir:")) prob.push("iframe sem título acessível");
    if (fr.ref !== "strict-origin-when-cross-origin") prob.push("referrerPolicy do player: " + fr.ref);
  }
  if (!externos.some((u) => u.includes("youtube-nocookie.com/embed/"))) prob.push("o player não pediu o youtube-nocookie");

  /* serviço sem vídeo não mostra a seção */
  await p.click('[data-act="guia"]');
  await sleep(300);
  const idSem = await p.$$eval(".gs-card", (cs) => cs.map((c) => c.dataset.id)).then((ids) => ids.find((id) => !(id in dados)));
  await p.click(`[data-act="gserv"][data-id="${idSem}"]`);
  await sleep(300);
  if (await p.$(".gv")) prob.push("seção Assista aparece em serviço sem vídeo: " + idSem);

  await b.close();
  const n = Object.values(dados).flat().length;
  console.log(prob.length ? "FALHAS:\n  " + prob.join("\n  ") : `OK: vídeos sob demanda, PT primeiro, player só no toque (${Object.keys(dados).length} serviços, ${n} vídeos)`);
  process.exit(prob.length ? 1 : 0);
})();
