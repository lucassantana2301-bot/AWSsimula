/**
 * Ponto de entrada (ADR-0001). Carrega o conteúdo, entrega ao motor e
 * registra erros não tratados num lugar só.
 */
import "./styles/app.css";
import { montarConteudo } from "./content/bundle";
import { blocoVideos, definirVideos, instalarVideos } from "./features/guia/videos";

declare global {
  // contrato temporário com o motor legado; some na fase 3
  var __CQ_CONTENT: (ReturnType<typeof montarConteudo> & { blocoVideos: (servicoId: string) => string }) | undefined;
}

const conteudo = montarConteudo();
globalThis.__CQ_CONTENT = {
  ...conteudo,
  /* o motor pede o guia; os vídeos ficam com o módulo novo */
  carregarGuia: async () => {
    const g = await conteudo.carregarGuia();
    definirVideos(g.VIDEOS);
    return g;
  },
  blocoVideos,
};
instalarVideos();
await import("./legacy/engine.js");
