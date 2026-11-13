/**
 * App instalável e offline (ADR-0002, decisão 5).
 * - registra /sw.js só em produção (no dev o Vite serve módulos soltos);
 * - versão nova: avisa e só troca quando o aluno aceita, nunca no meio
 *   de uma questão;
 * - avisa quando a internet cai/volta;
 * - guarda o pedido de instalação do navegador para o botão do Perfil.
 */
interface PedidoInstalacao extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface Avisos {
  toast(msg: string, tipo?: "ok" | "no" | "fl"): void;
  render(): void;
  evento(nome: "instalou_pwa"): void;
}

let pedido: PedidoInstalacao | null = null;
let esperando: ServiceWorker | null = null;

export const podeInstalar = (): boolean => pedido !== null;
export const temAtualizacao = (): boolean => esperando !== null;

export async function instalar(): Promise<void> {
  if (!pedido) return;
  const p = pedido;
  pedido = null;
  await p.prompt();
  await p.userChoice;
}

export function atualizar(): void {
  if (!esperando) return;
  let recarregou = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (recarregou) return;
    recarregou = true;
    location.reload();
  });
  esperando.postMessage("atualizar");
}

/** Bloco do Perfil: instalar e atualizar (vazio se não houver nada a oferecer). */
export function blocoApp(): string {
  const botoes = [
    temAtualizacao() ? `<button class="btn fill sm" data-pwa="atualizar">Atualizar para a versão nova</button>` : "",
    podeInstalar() ? `<button class="btn sm" data-pwa="instalar">Instalar o app neste aparelho</button>` : "",
  ].join("");
  if (!botoes) return "";
  return `<section class="sheet stack" aria-labelledby="app-h">
    <div class="hd"><h2 id="app-h">App</h2></div>
    <p class="t-sm dim">Instalado, o CloudQuest abre direto da tela inicial e funciona sem internet.</p>
    <div class="row" style="flex-wrap:wrap;gap:8px">${botoes}</div>
  </section>`;
}

export function iniciarPwa(avisos: Avisos, producao: boolean): void {
  window.addEventListener("beforeinstallprompt", (ev) => {
    ev.preventDefault();
    pedido = ev as PedidoInstalacao;
    avisos.render();
  });
  window.addEventListener("appinstalled", () => {
    pedido = null;
    avisos.evento("instalou_pwa");
    avisos.render();
  });
  window.addEventListener("offline", () => {
    avisos.toast("Sem internet: o app continua funcionando", "fl");
  });
  window.addEventListener("online", () => {
    avisos.toast("Conexão de volta", "ok");
  });
  document.addEventListener("click", (ev) => {
    const alvo = ev.target instanceof Element ? ev.target.closest<HTMLElement>("[data-pwa]") : null;
    if (!alvo) return;
    if (alvo.dataset["pwa"] === "instalar")
      void instalar().then(() => {
        avisos.render();
      });
    else if (alvo.dataset["pwa"] === "atualizar") atualizar();
  });

  if (!producao || !("serviceWorker" in navigator)) return;
  const avisarNova = (sw: ServiceWorker): void => {
    esperando = sw;
    avisos.toast("Versão nova disponível: atualize pelo Perfil", "ok");
    avisos.render();
  };
  navigator.serviceWorker
    .register("/sw.js", { scope: "/" })
    .then((reg) => {
      /* só há "versão nova" se já existia uma controlando a página */
      if (reg.waiting && navigator.serviceWorker.controller) avisarNova(reg.waiting);
      reg.addEventListener("updatefound", () => {
        const novo = reg.installing;
        novo?.addEventListener("statechange", () => {
          if (novo.state === "installed" && navigator.serviceWorker.controller) avisarNova(novo);
        });
      });
      /* checa versão nova a cada hora com o app aberto */
      setInterval(() => {
        void reg.update().catch(() => undefined);
      }, 3_600_000);
    })
    .catch(() => {
      /* sem service worker o app funciona igual, só não fica offline */
    });
}
