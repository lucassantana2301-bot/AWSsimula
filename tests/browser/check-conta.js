/* Conta e sincronização, contra um Supabase simulado (nenhum dado real):
   1. sem sessão, o app não baixa o cliente do Supabase nem fala com ele;
   2. e-mail inválido não dispara pedido;
   3. com sessão e progresso dos dois lados, pergunta antes de misturar;
   4. "Juntar" grava a mescla com a versão lida (escrita otimista) e o
      aparelho fica com o melhor dos dois. */
const fs = require("fs"), path = require("path");
const pup = require("./_navegador");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const manifesto = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "dist", ".vite", "manifest.json"), "utf8"));
const chunkSupabase = Object.entries(manifesto).find(([k]) => k.includes("@supabase/supabase-js"))?.[1]?.file;

(async () => {
  const b = await pup.launch({ executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome", args: ["--no-sandbox", "--disable-dev-shm-usage"] });
  const prob = [];
  const base = (process.env.CQ_URL || "http://localhost:4173/").replace(/\/?$/, "/");
  if (!chunkSupabase) prob.push("manifesto sem o chunk do supabase-js (deveria ser sob demanda)");

  /* ---------- 1 e 2: sem sessão ---------- */
  {
    const p = await b.newPage();
    p.on("pageerror", (e) => prob.push("erro JS: " + e.message));
    const urls = [];
    p.on("request", (r) => urls.push(r.url()));
    await p.setViewport({ width: 390, height: 844 });
    await p.goto(base, { waitUntil: "networkidle0" });
    if (urls.some((u) => u.includes("supabase.co"))) prob.push("sem sessão, o app falou com o Supabase");
    if (chunkSupabase && urls.some((u) => u.endsWith(chunkSupabase))) prob.push("sem sessão, o cliente do Supabase foi baixado");
    await p.click('[data-act="me"]'); await sleep(300);
    if (!(await p.$("form[data-conta-form] input[type=email]"))) prob.push("Perfil sem o formulário de login");
    const antes = urls.length;
    await p.type("#cq-email", "nao-e-email");
    await p.click("form[data-conta-form] button[type=submit]"); await sleep(400);
    if (urls.slice(antes).some((u) => u.includes("supabase.co"))) prob.push("e-mail inválido disparou pedido ao Supabase");
    const toast = await p.$eval("#toasts", (e) => e.textContent);
    if (!/Confira o e-mail/.test(toast)) prob.push("e-mail inválido sem aviso");
    if (!(await p.$("[data-telemetria]"))) prob.push("Perfil sem a opção de estatísticas anônimas");
    await p.close();
  }

  /* ---------- 3 e 4: com sessão (simulada) ---------- */
  {
    const p = await b.newPage();
    p.on("pageerror", (e) => prob.push("erro JS: " + e.message));
    const gravacoes = [];
    let leituras = 0;
    const remoto = { v: 2, xp: 300, answered: 2, fichas: { "f-remota": 111 }, concepts: {}, seen: {}, sims: [], upd: 500 };
    await p.setRequestInterception(true);
    p.on("request", (r) => {
      const u = r.url();
      if (!u.includes("supabase.co")) return r.continue();
      const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*", "Access-Control-Allow-Methods": "*" };
      if (r.method() === "OPTIONS") return r.respond({ status: 204, headers: cors });
      const auth = r.headers()["authorization"] || "";
      if (u.includes("/rest/v1/progresso")) {
        if (!auth.includes("token-de-teste")) prob.push("leitura sem o token da sessão");
        leituras++;
        return r.respond({ status: 200, headers: cors, contentType: "application/json", body: JSON.stringify([{ estado: remoto, versao: 3 }]) });
      }
      if (u.includes("/rest/v1/rpc/salvar_progresso")) {
        gravacoes.push(JSON.parse(r.postData() || "{}"));
        return r.respond({ status: 200, headers: cors, contentType: "application/json", body: "4" });
      }
      return r.respond({ status: 200, headers: cors, contentType: "application/json", body: "{}" });
    });
    await p.evaluateOnNewDocument(() => {
      const agora = Math.floor(Date.now() / 1000);
      const user = { id: "11111111-2222-3333-4444-555555555555", email: "aluno@exemplo.com", aud: "authenticated", role: "authenticated", app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() };
      localStorage.setItem("cq-auth", JSON.stringify({ access_token: "token-de-teste", token_type: "bearer", expires_in: 3600, expires_at: agora + 3600, refresh_token: "r", user }));
      localStorage.setItem("cloudquest.v2", JSON.stringify({ v: 2, xp: 100, answered: 9, fichas: { "f-local": 222 }, concepts: {}, seen: {}, sims: [], upd: 400 }));
    });
    await p.setViewport({ width: 390, height: 844 });
    await p.goto(base, { waitUntil: "networkidle0" });
    await sleep(800);
    await p.click('[data-act="me"]'); await sleep(400);
    if (!(await p.$('[data-conta="juntar"]'))) prob.push("com progresso nos dois lados, não perguntou antes de misturar");
    if (gravacoes.length) prob.push("gravou na conta antes do aluno escolher");
    await p.click('[data-conta="juntar"]').catch(() => {});
    await sleep(1200);
    const g = gravacoes[0];
    if (!g) prob.push("'Juntar' não gravou na conta");
    else {
      if (g.p_versao !== 3) prob.push("gravou sem a versão lida (escrita otimista): " + g.p_versao);
      if (g.p_estado.xp !== 300 || g.p_estado.answered !== 9) prob.push("mescla errada: xp " + g.p_estado.xp + ", respondidas " + g.p_estado.answered);
      if (!g.p_estado.fichas["f-local"] || !g.p_estado.fichas["f-remota"]) prob.push("mescla perdeu ficha de um dos lados");
    }
    const local = await p.evaluate(() => JSON.parse(localStorage.getItem("cloudquest.v2") || "{}"));
    if (local.xp !== 300 || !local.fichas["f-remota"]) prob.push("aparelho não ficou com o progresso mesclado");
    const st = await p.$eval(".conta [role=status]", (e) => e.textContent).catch(() => "");
    if (!/Sincronizado/.test(st)) prob.push("status depois de juntar: " + st);
    if (!leituras) prob.push("não leu o progresso da conta");
    await p.close();
  }

  await b.close();
  console.log(prob.length ? "FALHAS:\n  " + [...new Set(prob)].join("\n  ") : "OK: conta só carrega com sessão, pergunta antes de misturar e grava a mescla com versão");
  process.exit(prob.length ? 1 : 0);
})();
