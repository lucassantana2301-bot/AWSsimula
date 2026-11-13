/**
 * Ponto de entrada (ADR-0001). Carrega o conteúdo, entrega ao motor e
 * registra erros não tratados num lugar só.
 */
import "./styles/app.css";
import { montarConteudo } from "./content/bundle";
import { blocoVideos, definirVideos, instalarVideos } from "./features/guia/videos";
import * as fsrs from "./features/srs/fsrs";
import { montarIndice, servicosCitados, type EntradaIndice } from "./features/guia/citados";
import indiceGuia from "../content/guia/indice.json";

declare global {
  // contrato temporário com o motor legado; some na fase 3
  var __CQ_CONTENT:
    | (ReturnType<typeof montarConteudo> & {
        blocoVideos: (servicoId: string) => string;
        fsrs: typeof fsrs;
        citados: (textos: string[]) => string[];
        nomesGuia: Record<string, string>;
      })
    | undefined;
}

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
};
instalarVideos();
await import("./legacy/engine.js");
