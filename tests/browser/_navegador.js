/* Navegador dos testes de tests/browser (auditoria de QA, item 16).
   Os testes nasceram em Puppeteer; agora rodam no Playwright, o mesmo dos
   testes de acessibilidade, e o puppeteer-core saiu do projeto.
   Esta camada mantém a API que os testes já usam, traduzida:
   - cada newPage() abre um contexto próprio (sem localStorage vazando
     de um teste para outro);
   - setViewport, emulateMediaFeatures, setOfflineMode,
     setBypassServiceWorker, evaluateOnNewDocument;
   - setRequestInterception + on("request") com abort/continue/respond;
   - goto com waitUntil "networkidle0"/"networkidle2";
   - depois de goto/reload, pula as boas-vindas da primeira visita ("Já sei
     usar"): estas suítes testam o app de quem já começou. As boas-vindas têm
     testes próprios em tests/test-dom.js e no axe de tests/e2e. */
const { chromium } = require("@playwright/test");

const traduzEspera = (o) => {
  if (!o || !o.waitUntil) return o;
  const w = o.waitUntil === "networkidle0" || o.waitUntil === "networkidle2" ? "networkidle" : o.waitUntil;
  return { ...o, waitUntil: w };
};

/* o app desenha #app de forma síncrona no carregamento; sem o botão, nada a fazer */
async function pularBoasVindas(page) {
  try {
    await page.locator("#app").waitFor({ timeout: 5000 });
    const b = page.locator('[data-act="onb-pular"]');
    if (await b.count()) await b.first().click();
  } catch {
    /* página sem o app (offline proposital, CSP): o próprio teste decide */
  }
}

/* requisição no formato do Puppeteer, resolvida uma vez só */
function pedido(route) {
  const r = route.request();
  let resolvido = false;
  const uma = (fn) => (...a) => {
    if (resolvido) return Promise.resolve();
    resolvido = true;
    return fn(...a);
  };
  return {
    url: () => r.url(),
    method: () => r.method(),
    headers: () => r.headers(),
    resourceType: () => r.resourceType(),
    postData: () => r.postData(),
    abort: uma(() => route.abort()),
    continue: uma(() => route.continue()),
    respond: uma(({ status = 200, headers = {}, contentType, body = "" }) =>
      route.fulfill({ status, headers, contentType, body: typeof body === "string" ? body : JSON.stringify(body) }),
    ),
    get resolvido() {
      return resolvido;
    },
  };
}

function embrulhar(navegador, pageInicial, contextoInicial) {
  /* página e contexto trocáveis: bloquear service worker exige contexto novo */
  const atual = { page: pageInicial, contexto: contextoInicial };
  const registros = []; // [evento, ouvinte] registrados antes de uma troca
  let viewport = null;
  let interceptar = false;
  let rotaLigada = false;
  const ouvintes = [];
  const ligarRota = async () => {
    if (rotaLigada || !interceptar || !ouvintes.length) return;
    rotaLigada = true;
    await atual.page.route("**/*", async (route) => {
      const p = pedido(route);
      for (const h of ouvintes) await h(p);
      if (!p.resolvido) await p.continue();
    });
  };
  const extra = {
    setViewport: ({ width, height }) => {
      viewport = { width, height };
      return atual.page.setViewportSize(viewport);
    },
    emulateMediaFeatures: (lista) => {
      const o = {};
      for (const { name, value } of lista || []) {
        if (name === "prefers-reduced-motion") o.reducedMotion = value === "reduce" ? "reduce" : "no-preference";
        if (name === "prefers-color-scheme") o.colorScheme = value;
      }
      return atual.page.emulateMedia(o);
    },
    /* como no Puppeteer: corta a rede só da página, pelo protocolo do Chrome.
       context.setOffline corta também a do service worker, e aí o app não
       consegue servir do cache, que é justamente o que se quer testar */
    setOfflineMode: async (b) => {
      const cdp = await atual.contexto.newCDPSession(atual.page);
      await cdp.send("Network.enable");
      await cdp.send("Network.emulateNetworkConditions", { offline: !!b, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    },
    /* requisições feitas pelo service worker não passam pelas rotas da página:
       para controlar a rede, o contexto precisa nascer com service worker bloqueado */
    setBypassServiceWorker: async (b) => {
      if (!b) return;
      const contexto = await navegador.newContext({ serviceWorkers: "block" });
      const page = await contexto.newPage();
      for (const [ev, h] of registros) page.on(ev, h);
      if (viewport) await page.setViewportSize(viewport);
      const velho = atual.contexto;
      atual.page = page;
      atual.contexto = contexto;
      await velho.close();
    },
    evaluateOnNewDocument: (fn, ...args) => atual.page.addInitScript(fn, args.length > 1 ? args : args[0]),
    setRequestInterception: async (b) => {
      interceptar = !!b;
      await ligarRota();
    },
    goto: async (url, o) => {
      const r = await atual.page.goto(url, traduzEspera(o));
      await pularBoasVindas(atual.page);
      return r;
    },
    reload: async (o) => {
      const r = await atual.page.reload(traduzEspera(o));
      await pularBoasVindas(atual.page);
      return r;
    },
    on: (ev, h) => {
      if (ev === "request" && interceptar) {
        ouvintes.push(h);
        void ligarRota();
        return proxy;
      }
      registros.push([ev, h]);
      atual.page.on(ev, h);
      return proxy;
    },
    close: async () => {
      await atual.page.close();
      await atual.contexto.close();
    },
  };
  const proxy = new Proxy(
    {},
    {
      get(_, k) {
        if (k in extra) return extra[k];
        const v = atual.page[k];
        return typeof v === "function" ? v.bind(atual.page) : v;
      },
    },
  );
  return proxy;
}

async function launch(opcoes = {}) {
  /* CHROME_PATH continua valendo: usa o Chrome do sistema quando existe */
  const caminho = process.env.CHROME_PATH || opcoes.executablePath;
  const fs = require("fs");
  const navegador = await chromium.launch(caminho && fs.existsSync(caminho) ? { executablePath: caminho, args: opcoes.args } : { args: opcoes.args });
  return {
    newPage: async () => {
      const contexto = await navegador.newContext({ serviceWorkers: "allow" });
      const page = await contexto.newPage();
      return embrulhar(navegador, page, contexto);
    },
    close: () => navegador.close(),
  };
}

module.exports = { launch };
