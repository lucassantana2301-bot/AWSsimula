/**
 * Ponto de entrada (ADR-0001). Carrega o conteúdo, entrega ao motor e
 * registra erros não tratados num lugar só.
 */
import "./styles/app.css";
import { montarConteudo } from "./content/bundle";

declare global {
  // contrato temporário com o motor legado; some na fase 3
  var __CQ_CONTENT: ReturnType<typeof montarConteudo> | undefined;
}

globalThis.__CQ_CONTENT = montarConteudo();
await import("./legacy/engine.js");
