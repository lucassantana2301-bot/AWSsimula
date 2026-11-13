/* O guia é baixado sob demanda. Sem rede, a aba precisa explicar o problema
   e se recuperar no "Tentar de novo", sem travar nem mostrar tela vazia. */
const pup = require("puppeteer-core");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await pup.launch({ executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const p = await b.newPage();
  const prob = [];
  p.on("pageerror", (e) => prob.push("erro JS: " + e.message));
  let bloquear = true;
  await p.setRequestInterception(true);
  p.on("request", (r) => (bloquear && /\/assets\/(servicos|duelos)-/.test(r.url()) ? r.abort() : r.continue()));
  await p.setViewport({ width: 390, height: 844 });
  await p.goto(process.env.CQ_URL || "http://localhost:4173/", { waitUntil: "networkidle0" });
  await p.click('[data-act="guia"]');
  await sleep(700);
  const falha = await p.evaluate(() => document.querySelector("#app").innerText);
  if (!/não carregou/i.test(falha)) prob.push("sem rede, a aba não explicou o problema: " + falha.slice(0, 120));
  if (!(await p.$('[data-act="guia-retry"]'))) prob.push("sem botão de tentar de novo");
  bloquear = false;
  await p.click('[data-act="guia-retry"]');
  await sleep(900);
  const n = await p.evaluate(() => document.querySelectorAll(".gs-card").length);
  if (n < 100) prob.push("depois de voltar a rede, o guia não carregou (" + n + " serviços)");
  await b.close();
  console.log(prob.length ? "FALHAS:\n  " + prob.join("\n  ") : "OK: guia sob demanda explica a falta de rede e se recupera (" + n + " serviços)");
  process.exit(prob.length ? 1 : 0);
})();
