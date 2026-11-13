/* Service worker do CloudQuest (ADR-0002, decisão 5).
   Gerado no build por vite.config.ts, que troca os marcadores de versão e de
   lista pelo hash do build e pelos arquivos com hash no nome.

   Estratégias:
   - navegação (HTML): rede primeiro (3 s), cache como reserva -> nunca
     prende o aluno numa versão velha quando há internet;
   - /assets/* (nome com hash, imutável): cache primeiro;
   - outros arquivos do próprio site (ícones, manifest): cache e atualiza;
   - outros domínios (Supabase, YouTube): não toca.
   Atualização: a versão nova espera; o app pergunta antes de trocar,
   para não interromper uma sessão de estudo. */
const VERSAO = "__VERSAO__";
const CACHE = "cq-" + VERSAO;
const ARQUIVOS = __ARQUIVOS__;
const SHELL = ["/", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon.svg"];

self.addEventListener("install", (ev) => {
  ev.waitUntil(
    caches.open(CACHE).then(async (c) => {
      await c.addAll(SHELL);
      /* assets um a um: um arquivo que falhar não derruba a instalação inteira */
      await Promise.all(ARQUIVOS.map((a) => c.add(a).catch(() => undefined)));
    }),
  );
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(
    caches
      .keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith("cq-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (ev) => {
  if (ev.data === "atualizar") self.skipWaiting();
});

function comLimite(promessa, ms) {
  return new Promise((ok, falha) => {
    const t = setTimeout(() => falha(new Error("tempo")), ms);
    promessa.then(
      (r) => {
        clearTimeout(t);
        ok(r);
      },
      (e) => {
        clearTimeout(t);
        falha(e);
      },
    );
  });
}

self.addEventListener("fetch", (ev) => {
  const req = ev.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  /* funções da Vercel (página pública do resultado, imagem): sempre da rede */
  if (url.pathname.startsWith("/api/")) return;

  if (req.mode === "navigate") {
    ev.respondWith(
      comLimite(fetch(req), 3000)
        .then((r) => {
          /* só a casca do app vira "/" no cache; outra página HTML nunca a substitui */
          if (r.ok && (url.pathname === "/" || url.pathname === "/index.html")) {
            const copia = r.clone();
            caches.open(CACHE).then((c) => c.put("/", copia));
          }
          return r;
        })
        .catch(() =>
          caches
            .match("/")
            .then((r) => r || new Response("Sem conexão.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } })),
        ),
    );
    return;
  }

  if (url.pathname.startsWith("/assets/")) {
    ev.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((r) => {
            if (r.ok) {
              const copia = r.clone();
              caches.open(CACHE).then((c) => c.put(req, copia));
            }
            return r;
          }),
      ),
    );
    return;
  }

  ev.respondWith(
    caches.match(req).then((hit) => {
      const rede = fetch(req).then((r) => {
        if (r.ok) {
          const copia = r.clone();
          caches.open(CACHE).then((c) => c.put(req, copia));
        }
        return r;
      });
      if (hit) {
        rede.catch(() => undefined); /* offline: fica com o cache, sem erro solto */
        return hit;
      }
      return rede;
    }),
  );
});
