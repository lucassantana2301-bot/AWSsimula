/* O banco de questões chega como JSON antes do motor. Sem rede na primeira
   visita, a página mostra o problema e o "Tentar de novo" recupera. */
const pup = require("./_navegador");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await pup.launch({ executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const p = await b.newPage();
  const prob = [];
  p.on("pageerror", (e) => prob.push("erro JS: " + e.message));
  await p.setBypassServiceWorker(true);
  let bloquear = true;
  await p.setRequestInterception(true);
  p.on("request", (r) => (bloquear && /\/assets\/questions-/.test(r.url()) ? r.abort() : r.continue()));
  await p.goto(process.env.CQ_URL || "http://localhost:4173/", { waitUntil: "networkidle0" });
  const txt = await p.evaluate(() => document.querySelector("#app").innerText);
  if (!/Não deu para carregar as questões/.test(txt)) prob.push("sem rede, a página não explicou: " + txt.slice(0, 80));
  if (!(await p.$("#cq-tentar"))) prob.push("sem botão de tentar de novo");
  bloquear = false;
  await p.click("#cq-tentar").catch(() => {});
  await sleep(1500);
  const n = await p.evaluate(() => document.querySelectorAll("[data-exam]").length);
  if (n < 4) prob.push("depois de voltar a rede, o app não abriu (" + n + " provas na tela)");
  await b.close();
  console.log(prob.length ? "FALHAS:\n  " + prob.join("\n  ") : "OK: sem rede o app explica e se recupera ao tentar de novo");
  process.exit(prob.length ? 1 : 0);
})();
