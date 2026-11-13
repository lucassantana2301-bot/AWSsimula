/**
 * Ponto de entrada (ADR-0001/0002). Monta o conteúdo, liga os módulos
 * tipados (vídeos, revisão FSRS, conta, telemetria) e entrega tudo ao motor
 * legado por um contrato explícito, até a fase 3 tirar o motor daqui.
 */
import "./styles/app.css";
import { montarConteudo } from "./content/bundle";
import { blocoVideos, definirVideos, instalarVideos } from "./features/guia/videos";
import * as fsrs from "./features/srs/fsrs";
import { montarIndice, servicosCitados, type EntradaIndice } from "./features/guia/citados";
import { acaoDoGuia, filtrarGuia, ligarGuia, telaDoGuia } from "./features/guia/telas";
import { agendar, blocoConta, iniciarConta, type Motor } from "./features/conta/conta";
import {
  blocoPrivacidade,
  definirTelemetria,
  eventoDaRota,
  instalarTelemetria,
  registrarEvento,
  telemetriaLigada,
  type NomeEvento,
} from "./features/telemetria/telemetria";
import { blocoApp, iniciarPwa } from "./features/pwa/pwa";
import { blocoCalendario } from "./features/progresso/calendario";
import { type Html } from "./lib/html";
import { urlLinkedIn, urlResultado, type Resultado } from "./features/compartilhar/resultado";
import indiceGuia from "../content/guia/indice.json";

interface GuiaTelas {
  ligar: typeof ligarGuia;
  tela: (nome: string) => string;
  acao: typeof acaoDoGuia;
  filtrar: typeof filtrarGuia;
}

type Conteudo = ReturnType<typeof montarConteudo> & {
  blocoVideos: (servicoId: string) => string;
  fsrs: typeof fsrs;
  citados: (textos: string[]) => string[];
  nomesGuia: Record<string, string>;
  blocoConta: () => string;
  blocoCalendario: (dias: Record<string, number>, meta: number) => string;
  aoSalvar: () => void;
  aoNavegar: (tela: string, o?: Record<string, unknown>) => void;
  evento: (nome: NomeEvento, dados?: Record<string, unknown>) => void;
  guiaTelas: GuiaTelas;
  compartilharResultado: (r: Resultado) => void;
};

declare global {
  // contrato temporário com o motor legado; some na fase 3
  var __CQ_CONTENT: Conteudo | undefined;
  var __CQ_MOTOR: (Motor & { tela(): string }) | undefined;
}

/* erros desde o primeiro instante, inclusive os do carregamento do motor */
instalarTelemetria(() => globalThis.__CQ_MOTOR?.tela() ?? "inicio");

/** O motor legado ainda monta HTML com strings: a conversão acontece só aqui. */
const paraMotor = (h: Html | false): string => (h ? h.texto : "");

const conteudo = montarConteudo();
const indice = montarIndice(indiceGuia satisfies EntradaIndice[]);
globalThis.__CQ_CONTENT = {
  ...conteudo,
  /* o motor pede o guia; os vídeos ficam com o módulo novo */
  carregarGuia: async () => {
    const g = await conteudo.carregarGuia();
    definirVideos(g.VIDEOS);
    return g;
  },
  blocoVideos: (id) => paraMotor(blocoVideos(id)),
  fsrs,
  /** serviços do guia citados na explicação, na resposta certa e no enunciado */
  citados: (textos: string[]): string[] => servicosCitados(textos, indice),
  nomesGuia: Object.fromEntries(indiceGuia.map((e) => [e.id, e.nome.replace(/\s*\(.*\)$/, "")])),
  blocoConta: () => paraMotor(blocoApp()) + paraMotor(blocoConta()) + paraMotor(blocoPrivacidade()),
  blocoCalendario: (dias, meta) => paraMotor(blocoCalendario(dias, meta)),
  aoSalvar: agendar,
  aoNavegar: (tela, o) => {
    const ev = eventoDaRota(tela, o);
    if (ev) registrarEvento(ev.nome, ev.dados);
  },
  evento: registrarEvento,
  /* guia de serviços: telas e ações fora do motor (fase 3) */
  guiaTelas: { ligar: ligarGuia, tela: (nome) => telaDoGuia(nome).texto, acao: acaoDoGuia, filtrar: filtrarGuia },
  /* abre o LinkedIn com o link público do resultado e copia o link */
  compartilharResultado: (r) => {
    const link = urlResultado(location.origin, r);
    window.open(urlLinkedIn(link), "_blank", "noopener,noreferrer");
    navigator.clipboard.writeText(link).then(
      () => globalThis.__CQ_MOTOR?.toast("Link do resultado copiado", "ok"),
      () => undefined,
    );
  },
};
instalarVideos();

document.addEventListener("click", (ev) => {
  const alvo = ev.target instanceof Element ? ev.target.closest("[data-telemetria]") : null;
  if (!alvo) return;
  definirTelemetria(!telemetriaLigada());
  globalThis.__CQ_MOTOR?.render();
});
document.addEventListener("click", (ev) => {
  if (ev.target instanceof Element && ev.target.closest("button[data-gv-play]")) registrarEvento("tocou_video");
});

await import("./legacy/engine.js");

const motor = globalThis.__CQ_MOTOR;
if (!motor) throw new Error("motor não expôs o contrato __CQ_MOTOR");
iniciarConta(motor);
iniciarPwa(
  {
    toast: (m, t) => {
      motor.toast(m, t);
    },
    render: () => {
      motor.render();
    },
    evento: registrarEvento,
  },
  import.meta.env.PROD,
);
registrarEvento("abriu_app");
