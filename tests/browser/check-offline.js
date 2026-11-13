/* PWA: manifest válido com ícones; service worker controla a página; sem
   internet o app abre de novo e até o guia (baixado sob demanda) funciona. */
const pup = require("puppeteer-core");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await pup.launch({ executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const p = await b.newPage();
  const prob = [];
  p.on("pageerror", (e) => prob.push("erro JS: " + e.message));
  await p.setViewport({ width: 390, height: 844 });
  const base = (process.env.CQ_URL || "http://localhost:4173/").replace(/\/?$/, "/");
  await p.goto(base, { waitUntil: "networkidle0" });

  const man = await p.evaluate(async () => {
    const l = document.querySelector('link[rel="manifest"]');
    if (!l) return null;
    const m = await (await fetch(l.href)).json();
    const icones = await Promise.all(m.icons.map(async (i) => ({ ...i, ok: (await fetch(i.src)).ok })));
    return { ...m, icons: icones };
  });
  if (!man) prob.push("sem <link rel=manifest>");
  else {
    if (man.display !== "standalone" || !man.start_url || !man.name) prob.push("manifest incompleto");
    if (!man.icons.some((i) => i.sizes === "512x512" && i.purpose === "maskable")) prob.push("sem ícone maskable 512");
    if (!man.icons.some((i) => i.sizes === "192x192")) prob.push("sem ícone 192");
    man.icons.filter((i) => !i.ok).forEach((i) => prob.push("ícone não carrega: " + i.src));
  }

  const limite = (ms, rot) => new Promise((_, f) => setTimeout(() => f(new Error("tempo esgotado: " + rot)), ms));
  const controlado = await Promise.race([
    p.evaluate(async () => {
      if (!("serviceWorker" in navigator)) return "sem suporte";
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) return "app não registrou o service worker";
      await navigator.serviceWorker.ready;
      for (let i = 0; i < 50 && !navigator.serviceWorker.controller; i++) await new Promise((r) => setTimeout(r, 100));
      return navigator.serviceWorker.controller ? "ok" : "sem controller depois de 5 s";
    }),
    limite(15000, "service worker"),
  ]).catch((e) => e.message);
  if (controlado !== "ok") prob.push("service worker não assumiu a página: " + controlado);
  /* espera a instalação terminar de guardar os arquivos */
  await sleep(1500);

  await p.setOfflineMode(true);
  await p.reload({ waitUntil: "domcontentloaded" }).catch((e) => prob.push("recarregar offline falhou: " + e.message));
  await sleep(1200);
  const texto = await p.evaluate(() => document.querySelector("#app")?.textContent?.length ?? 0);
  if (texto < 200) prob.push("offline, o app abriu vazio");
  await p.click('[data-act="guia"]').catch(() => prob.push("offline, sem aba Guia"));
  await sleep(1200);
  const n = await p.evaluate(() => document.querySelectorAll(".gs-card").length);
  if (n < 100) prob.push(`offline, o guia não abriu (${n} serviços)`);
  await p.setOfflineMode(false);

  await b.close();
  console.log(prob.length ? "FALHAS:\n  " + prob.join("\n  ") : `OK: instalável (manifest e ícones) e funciona offline, inclusive o guia (${n} serviços)`);
  process.exit(prob.length ? 1 : 0);
})();
