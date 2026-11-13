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
import indiceGuia from "../content/guia/indice.json";

type Conteudo = ReturnType<typeof montarConteudo> & {
  blocoVideos: (servicoId: string) => string;
  fsrs: typeof fsrs;
  citados: (textos: string[]) => string[];
  nomesGuia: Record<string, string>;
  blocoConta: () => string;
  aoSalvar: () => void;
  aoNavegar: (tela: string, o?: Record<string, unknown>) => void;
  evento: (nome: NomeEvento, dados?: Record<string, unknown>) => void;
};

declare global {
  // contrato temporário com o motor legado; some na fase 3
  var __CQ_CONTENT: Conteudo | undefined;
  var __CQ_MOTOR: (Motor & { tela(): string }) | undefined;
}

/* erros desde o primeiro instante, inclusive os do carregamento do motor */
instalarTelemetria(() => globalThis.__CQ_MOTOR?.tela() ?? "inicio");

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
  blocoVideos,
  fsrs,
  /** serviços do guia citados na explicação, na resposta certa e no enunciado */
  citados: (textos: string[]): string[] => servicosCitados(textos, indice),
  nomesGuia: Object.fromEntries(indiceGuia.map((e) => [e.id, e.nome.replace(/\s*\(.*\)$/, "")])),
  blocoConta: () => blocoApp() + blocoConta() + blocoPrivacidade(),
  aoSalvar: agendar,
  aoNavegar: (tela, o) => {
    const ev = eventoDaRota(tela, o);
    if (ev) registrarEvento(ev.nome, ev.dados);
  },
  evento: registrarEvento,
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
